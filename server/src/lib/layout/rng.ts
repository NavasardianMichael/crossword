/**
 * mulberry32: a tiny seeded PRNG. Layouts are reproducible from `(candidates, seed)`, which is
 * what makes the engine testable and a stored puzzle explainable.
 */
export type Random = () => number

export const createRandom = (seed: number): Random => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const randomInt = (random: Random, maxExclusive: number): number => Math.floor(random() * maxExclusive)

/**
 * Weighted shuffle (Efraimidis–Spirakis): heavier items tend to come first, every item can
 * still come anywhere. Returns indexes.
 */
export const weightedOrder = (weights: readonly number[], random: Random): number[] =>
  weights
    .map((weight, index) => ({ index, key: Math.pow(random(), 1 / Math.max(weight, 0.001)) }))
    .sort((a, b) => b.key - a.key)
    .map(({ index }) => index)
