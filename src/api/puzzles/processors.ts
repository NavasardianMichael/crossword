import { unwrapValue } from '@api/unwrap'
import type { CreatePuzzleAPI, GetDailyAPI, GetPuzzleAPI, GetSamplesAPI, ReportWordAPI, SendResultAPI } from './types'

export const processPuzzleResponse: CreatePuzzleAPI['processor'] & GetPuzzleAPI['processor'] = unwrapValue

export const processEmptyResponse: ReportWordAPI['processor'] & SendResultAPI['processor'] = () => null

export const processSamplesResponse: GetSamplesAPI['processor'] = unwrapValue

export const processDailyResponse: GetDailyAPI['processor'] = unwrapValue
