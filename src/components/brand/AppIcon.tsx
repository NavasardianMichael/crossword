import { emblemDataUri } from '@helpers/brand'
import { CREAM, SUN } from '@styles/tokens'

/**
 * The raster app icon, for `ImageResponse` (satori renders a flexbox subset, not arbitrary
 * SVG — the emblem goes in as an image). Full-bleed square: the OS applies its own mask.
 * `safeZone` shrinks the emblem into the 80% circle a maskable icon must survive.
 */
export const AppIcon = ({ size, safeZone = false }: { size: number; safeZone?: boolean }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `radial-gradient(circle at 50% 30%, ${SUN[100]}, ${CREAM[200]} 80%)`,
    }}
  >
    <img src={emblemDataUri()} width={size * (safeZone ? 0.6 : 0.8)} height={size * (safeZone ? 0.6 : 0.8)} alt='' />
  </div>
)
