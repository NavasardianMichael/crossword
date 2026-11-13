import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The model chain in `server/src/lib/gemini.ts`, with the SDK replaced: which failures fall
 * through to the next model, which stop the chain, cooldowns, and the request deadline.
 */
const generateContent = vi.fn()

// The server package owns @google/genai; mock the very file its import resolves to.
const genaiPath = vi.hoisted(() => {
  const { createRequire } = process.getBuiltinModule('node:module')
  const path = process.getBuiltinModule('node:path')
  const resolved = createRequire(path.resolve(__dirname, '../../server/package.json')).resolve('@google/genai')
  return resolved.replace(/index\.cjs$/, 'index.mjs').split(path.sep).join('/')
})

vi.mock(genaiPath, async (importActual) => ({
  ...(await importActual<Record<string, unknown>>()),
  GoogleGenAI: class {
    models = { generateContent }
  },
}))

const MODELS = 'model-a:LOW,model-b:LOW,model-c:LOW'

const loadGemini = async () => {
  vi.resetModules()
  vi.stubEnv('GEMINI_KEY', 'test-key')
  vi.stubEnv('GEMINI_MODELS', MODELS)
  return import('../../server/src/lib/gemini.js')
}

const apiError = (status: number) => Object.assign(new Error(`status ${status}`), { status })
const answer = (text: string) => ({ text, usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 2 } })
const options = { contents: 'x', systemInstruction: 'y', schema: {} }
const modelsTried = () => generateContent.mock.calls.map(([request]) => (request as { model: string }).model)

beforeEach(() => {
  generateContent.mockReset()
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('generateJson', () => {
  it.each([
    ['a retired model (404)', apiError(404)],
    ['quota (429)', apiError(429)],
    ['a gateway timeout (504)', apiError(504)],
    ['a network error or our own timeout (no status)', new Error('fetch failed')],
  ])('falls through to the next model on %s', async (_, failure) => {
    const { generateJson } = await loadGemini()
    generateContent.mockRejectedValueOnce(failure).mockResolvedValueOnce(answer('{"ok":true}'))
    const result = await generateJson(options)
    expect(result.model).toBe('model-b')
    expect(modelsTried()).toEqual(['model-a', 'model-b'])
  })

  it('stops on a request the model rejects (400): the next model would reject it too', async () => {
    const { generateJson } = await loadGemini()
    generateContent.mockRejectedValueOnce(apiError(400))
    await expect(generateJson(options)).rejects.toMatchObject({ status: 400 })
    expect(modelsTried()).toEqual(['model-a'])
  })

  it('skips a cooling model on the next call, and a retired one for hours', async () => {
    const { generateJson, allModelsCoolingDown } = await loadGemini()
    generateContent.mockRejectedValueOnce(apiError(404)).mockResolvedValue(answer('{}'))
    await generateJson(options)
    generateContent.mockClear()
    vi.useFakeTimers({ now: Date.now() + 60 * 60 * 1000 })
    try {
      await generateJson(options)
      expect(modelsTried()).toEqual(['model-b'])
      expect(allModelsCoolingDown()).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('gives every call a timeout, never past the deadline', async () => {
    const { generateJson } = await loadGemini()
    generateContent.mockResolvedValue(answer('{}'))
    await generateJson({ ...options, deadline: Date.now() + 5_000 })
    const timeout = (generateContent.mock.calls[0]![0] as { config: { httpOptions: { timeout: number } } }).config.httpOptions.timeout
    expect(timeout).toBeGreaterThan(3_000)
    expect(timeout).toBeLessThanOrEqual(5_000)
  })

  it('tries no model once the deadline has passed', async () => {
    const { AllModelsFailedError, generateJson } = await loadGemini()
    await expect(generateJson({ ...options, deadline: Date.now() - 1 })).rejects.toBeInstanceOf(AllModelsFailedError)
    expect(generateContent).not.toHaveBeenCalled()
  })

  it('reports every model when the whole chain fails', async () => {
    const { AllModelsFailedError, generateJson } = await loadGemini()
    generateContent.mockRejectedValue(apiError(503))
    const failure = await generateJson(options).catch((error: unknown) => error)
    expect(failure).toBeInstanceOf(AllModelsFailedError)
    expect((failure as InstanceType<typeof AllModelsFailedError>).failures.map(({ model }) => model)).toEqual(['model-a', 'model-b', 'model-c'])
  })
})
