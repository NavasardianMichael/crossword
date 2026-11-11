'use client'

import { useNavigationProgressStore } from '@store/navigation/progress/store'

/**
 * A thin bar across the top of the screen while a link or router call is loading the next page.
 * It fades in after a short delay (globals.css `.nav-progress`), so a prefetched page that opens
 * at once never flashes it. The cursor turns to `progress` meanwhile.
 */
export const NavigationProgress = () => {
  const pending = Object.keys(useNavigationProgressStore.use.pending()).length > 0
  if (!pending) return null
  return (
    <div className='nav-progress' aria-hidden>
      <div className='nav-progress-bar' />
    </div>
  )
}
