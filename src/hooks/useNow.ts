import { useEffect, useState } from 'react'

/** The current time, re-rendering every `intervalMs` while `active` — for a running clock. */
export const useNow = (active: boolean, intervalMs = 1000): number => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(timer)
  }, [active, intervalMs])

  return now
}
