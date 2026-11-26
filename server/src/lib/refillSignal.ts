/**
 * "A shortfall was just recorded": how services wake the refill job (`jobs/poolRefill.ts`)
 * without importing it. The job subscribes when it starts (`index.ts`); without it — in tests,
 * scripts — a signal goes nowhere.
 */
let listener: (() => void) | null = null

export const onRefillRequested = (handler: (() => void) | null): void => {
  listener = handler
}

export const requestRefill = (): void => listener?.()
