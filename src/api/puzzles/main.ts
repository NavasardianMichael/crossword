import { cache } from 'react'
import { axiosInstance } from '@api/axiosInstance'
import type { APIResponse } from '@interfaces/api'
import { API_PUZZLE_TIMEOUT_MS } from '@constants/app'
import { ENDPOINTS } from './endpoints'
import { processEmptyResponse, processPuzzleResponse, processSamplesResponse } from './processors'
import type { CreatePuzzleAPI, GetPuzzleAPI, GetSamplesAPI, ReportWordAPI, SendResultAPI } from './types'

/** May wait for a fresh Gemini batch when the pool is short, so it gets the long ceiling. */
export const createPuzzleAPI: CreatePuzzleAPI['api'] = async (payload) => {
  const { data } = await axiosInstance.post<APIResponse<CreatePuzzleAPI['response']>>(ENDPOINTS.puzzles, payload, {
    timeout: API_PUZZLE_TIMEOUT_MS,
  })
  return processPuzzleResponse(data)
}

/** Cached per request, so a page's metadata and body share one read. */
export const getPuzzleAPI: GetPuzzleAPI['api'] = cache(async ({ id }) => {
  const { data } = await axiosInstance.get<APIResponse<GetPuzzleAPI['response']>>(ENDPOINTS.puzzle(id))
  return processPuzzleResponse(data)
})

export const reportWordAPI: ReportWordAPI['api'] = async ({ puzzleId, wordId, reason }) => {
  await axiosInstance.post(ENDPOINTS.report(puzzleId), { wordId, reason })
  return processEmptyResponse({ value: null, error: null })
}

export const sendResultAPI: SendResultAPI['api'] = async ({ puzzleId, solved, revealedWordIds }) => {
  await axiosInstance.post(ENDPOINTS.result(puzzleId), { solved, revealedWordIds })
  return processEmptyResponse({ value: null, error: null })
}

export const getSamplesAPI: GetSamplesAPI['api'] = cache(async ({ locale, topic }) => {
  const { data } = await axiosInstance.get<APIResponse<GetSamplesAPI['response']>>(ENDPOINTS.samples, {
    params: { locale, topic },
  })
  return processSamplesResponse(data)
})
