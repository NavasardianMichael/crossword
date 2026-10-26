import { ImageResponse } from 'next/og'
import { AppIcon } from '@components/brand/AppIcon'

/** The maskable variant: the emblem kept inside the safe zone launchers crop to. */
export const dynamic = 'force-static'

export function GET() {
  return new ImageResponse(<AppIcon size={512} safeZone />, { width: 512, height: 512 })
}
