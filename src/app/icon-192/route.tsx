import { ImageResponse } from 'next/og'
import { AppIcon } from '@components/brand/AppIcon'

/** The 192px size install checks and Android launchers look for, beside the 512px `/icon`. */
export const dynamic = 'force-static'

export function GET() {
  return new ImageResponse(<AppIcon size={192} />, { width: 192, height: 192 })
}
