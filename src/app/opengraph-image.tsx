import { ImageResponse } from 'next/og'
import { APP_NAME, OG_IMAGE_SIZE } from '@constants/app'
import { emblemDataUri } from '@helpers/brand'
import { CORAL, CREAM, INK, LINE, SUN, TEAL, WHITE } from '@styles/tokens'

/**
 * The link preview every page and shared puzzle carries (`pageMetadata` points at it). Latin
 * text only — satori's bundled font has no Armenian — so the brand is the English name and
 * the languages are their codes; the `alt` text is translated per page.
 */
export const alt = `${APP_NAME} — free AI crosswords and scanwords`
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

const LANGUAGES = ['EN', 'RU', 'HY']

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 64,
        padding: '0 88px',
        background: `radial-gradient(circle at 25% 40%, ${SUN[100]}, ${CREAM[200]} 75%)`,
        color: INK[900],
      }}
    >
      <img src={emblemDataUri({ background: true })} width={380} height={380} alt='' />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
          {APP_NAME}
        </div>
        <div style={{ display: 'flex', fontSize: 40, lineHeight: 1.25, color: INK[700], maxWidth: 600 }}>
          Free crosswords & scanwords, written fresh by AI.
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {LANGUAGES.map((code, index) => (
            <div
              key={code}
              style={{
                display: 'flex',
                padding: '8px 22px',
                fontSize: 32,
                fontWeight: 800,
                borderRadius: 999,
                border: `4px solid ${INK[900]}`,
                background: [CORAL[200], SUN[300], TEAL[200]][index],
              }}
            >
              {code}
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              padding: '8px 22px',
              fontSize: 32,
              fontWeight: 800,
              borderRadius: 999,
              border: `4px solid ${LINE.strong}`,
              background: WHITE,
              color: INK[700],
            }}
          >
            Free
          </div>
        </div>
      </div>
    </div>,
    size
  )
}
