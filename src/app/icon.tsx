import { ImageResponse } from 'next/og'
import { AppIcon } from '@components/brand/AppIcon'

/** Rendered, not committed: one 512px source covers the favicon, install prompt and home screen. */
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(<AppIcon size={512} />, size)
}
