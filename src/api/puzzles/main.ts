import { cache } from 'react'
import { axiosInstance } from '@api/axiosInstance'
import type { APIResponse } from '@interfaces/api'
import { API_PUZZLE_TIMEOUT_MS } from '@constants/app'
import { ENDPOINTS } from './endpoints'
import { processDailyResponse, processEmptyResponse, processPuzzleResponse, processSamplesResponse } from './processors'
import type {
  CreatePuzzleAPI,
  CreatePuzzlePayload,
  GetDailyAPI,
  GetPuzzleAPI,
  GetSamplesAPI,
  ReportWordAPI,
  SendResultAPI,
  SyncPlaysAPI,
} from './types'

/** May wait for a fresh Gemini batch when the pool is short, so it gets the long ceiling. `signal` aborts the wait. */
export const createPuzzleAPI = async (payload: CreatePuzzlePayload, signal?: AbortSignal): Promise<CreatePuzzleAPI['processed']> => {
  const { data } = await axiosInstance.post<APIResponse<CreatePuzzleAPI['response']>>(ENDPOINTS.puzzles, payload, {
    timeout: API_PUZZLE_TIMEOUT_MS,
    signal,
  })
  return processPuzzleResponse(data)
}

/** Cached per request, so a page's metadata and body share one read. */
export const getPuzzleAPI: GetPuzzleAPI['api'] = cache(async ({ id }) => {
  const { data } = await axiosInstance.get<APIResponse<GetPuzzleAPI['response']>>(ENDPOINTS.puzzle(id))
  return processPuzzleResponse(data)
})

export const reportWordAPI: ReportWordAPI['api'] = async ({ puzzleId, wordId, reason, note }) => {
  await axiosInstance.post(ENDPOINTS.report(puzzleId), { wordId, reason, note })
  return processEmptyResponse({ value: null, error: null })
}

export const sendResultAPI: SendResultAPI['api'] = async ({ puzzleId, solved, revealedWordIds }) => {
  await axiosInstance.post(ENDPOINTS.result(puzzleId), { solved, revealedWordIds })
  return processEmptyResponse({ value: null, error: null })
}

/** Signed in only: joins the puzzles to the account's seen-list. */
export const syncPlaysAPI: SyncPlaysAPI['api'] = async ({ plays }) => {
  await axiosInstance.post(ENDPOINTS.plays, { plays })
  return processEmptyResponse({ value: null, error: null })
}

/** Today's daily (no answers), yesterday's with its answers, and the days before. */
export const getDailyAPI: GetDailyAPI['api'] = cache(async ({ locale }) => {
  const { data } = await axiosInstance.get<APIResponse<GetDailyAPI['response']>>(ENDPOINTS.daily(locale))
  return processDailyResponse(data)
})

export const getSamplesAPI: GetSamplesAPI['api'] = cache(async ({ locale, topic }) => {
  const { data } = await axiosInstance.get<APIResponse<GetSamplesAPI['response']>>(ENDPOINTS.samples, {
    params: { locale, topic },
  })
  return processSamplesResponse(data)
})
