export const ENDPOINTS = {
  puzzles: '/puzzles',
  puzzle: (id: string) => `/puzzles/${encodeURIComponent(id)}`,
  report: (id: string) => `/puzzles/${encodeURIComponent(id)}/report`,
  result: (id: string) => `/puzzles/${encodeURIComponent(id)}/result`,
  plays: '/puzzles/plays',
  samples: '/samples',
} as const
