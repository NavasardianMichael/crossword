export const ENDPOINTS = {
  status: '/billing',
  packs: '/billing/packs',
  checkout: '/billing/checkout',
  payment: (id: string) => `/billing/payments/${encodeURIComponent(id)}`,
} as const
