import type { CSSProperties, ReactNode } from 'react'
import type { PuzzleView } from '@constants/puzzle'
import { emblemDataUri } from '@helpers/brand'
import { CORAL, CREAM, INK, LAVENDER, LINE, MINT, SKY, SUN, TEAL, WHITE } from '@styles/tokens'

/**
 * The link-preview cards, for `ImageResponse` (satori: flexbox only, every element with more
 * than one child needs `display: flex`). 1200×630, the important part kept away from the
 * edges — some apps crop the card to a square or a 1.91:1 strip around its centre.
 */
const HEADING = 'Rubik, "Noto Sans Armenian"'
const BODY = 'Nunito, "Noto Sans Armenian"'

const PAPER: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  color: INK[900],
  fontFamily: BODY,
  background: `radial-gradient(circle at 30% 35%, ${SUN[100]}, ${CREAM[200]} 80%)`,
}

const Chip = ({ children, background, border = INK[900] }: { children: ReactNode; background: string; border?: string }) => (
  <div
    style={{
      display: 'flex',
      padding: '8px 24px',
      borderRadius: 999,
      border: `4px solid ${border}`,
      background,
      fontSize: 30,
      fontWeight: 700,
      lineHeight: 1.2,
    }}
  >
    {children}
  </div>
)

/** A lettered sticker tile, like the ones floating around the home page's hero. */
const Tile = ({ letter, background, size, rotate, style }: { letter: string; background: string; size: number; rotate: number; style: CSSProperties }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: size * 0.22,
      border: `4px solid ${INK[900]}`,
      background,
      boxShadow: `0 6px 0 ${INK[900]}2e`,
      fontFamily: HEADING,
      fontSize: size * 0.55,
      fontWeight: 700,
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    {letter}
  </div>
)

const Brand = ({ appName, size }: { appName: string; size: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.35 }}>
    <img src={emblemDataUri({ background: true })} width={size * 1.3} height={size * 1.3} alt='' />
    <div style={{ display: 'flex', fontFamily: HEADING, fontSize: size, fontWeight: 700 }}>{appName}</div>
  </div>
)

/** `"Crosswords that are <mark>always new</mark>"` → its plain and highlighted runs, in order. */
const splitMark = (text: string): { text: string; mark: boolean }[] =>
  text
    .split(/(<mark>.*?<\/mark>)/)
    .filter(Boolean)
    .map((part) => {
      const marked = /^<mark>(.*)<\/mark>$/.exec(part)
      return marked ? { text: marked[1], mark: true } : { text: part, mark: false }
    })

type SiteCardProps = {
  appName: string
  eyebrow: string
  /** The home page's headline; its `<mark>` run is highlighted as on the page. */
  title: string
  languages: string[]
  host: string
}

export const SiteCard = ({ appName, eyebrow, title, languages, host }: SiteCardProps) => (
  <div style={{ ...PAPER, position: 'relative', alignItems: 'center', padding: '0 80px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: 700 }}>
      <Brand appName={appName} size={40} />
      <div
        style={{
          display: 'flex',
          alignSelf: 'flex-start',
          padding: '6px 20px',
          borderRadius: 999,
          border: `3px solid ${TEAL[500]}`,
          background: TEAL[100],
          color: TEAL[700],
          fontSize: eyebrow.length > 40 ? 17 : 24,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          fontFamily: HEADING,
          // Two lines in every language: the Russian headline is the longest.
          fontSize: title.replace(/<\/?mark>/g, '').length > 30 ? 60 : 70,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: -1,
        }}
      >
        {splitMark(title).map((run, index) =>
          run.mark ? (
            <span key={index} style={{ background: `linear-gradient(transparent 58%, ${SUN[300]} 58%, ${SUN[300]} 92%, transparent 92%)` }}>
              {run.text}
            </span>
          ) : (
            <span key={index}>{run.text}</span>
          )
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {languages.map((language, index) => (
          <Chip key={language} background={[CORAL[200], SUN[300], TEAL[200]][index % 3]}>
            {language}
          </Chip>
        ))}
      </div>
    </div>
    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', height: '100%' }}>
      <img
        src={emblemDataUri({ background: true })}
        width={330}
        height={330}
        alt=''
        style={{ transform: 'rotate(4deg)', boxShadow: `0 14px 0 ${INK[900]}26`, borderRadius: 76 }}
      />
      <Tile letter='Ж' background={MINT[300]} size={92} rotate={-12} style={{ top: 70, left: 10 }} />
      <Tile letter='Շ' background={LAVENDER[300]} size={84} rotate={10} style={{ bottom: 78, right: 0 }} />
    </div>
    <div style={{ position: 'absolute', bottom: 34, left: 80, display: 'flex', fontSize: 24, fontWeight: 700, color: INK[700] }}>
      {host}
    </div>
  </div>
)

/** Decorative scanword blocks, in the board's sticker colours. */
const BLOCK_FILLS = [CORAL[100], SUN[100], MINT[100], SKY[100], LAVENDER[100]]

const GRID_BOX = 430

/**
 * The puzzle's shape with every cell blank: what a shared link promises without giving any of
 * it away. The longest across word is lit like the board's active word.
 */
const GridPreview = ({ puzzle }: { puzzle: PuzzleView }) => {
  const cell = Math.floor(GRID_BOX / Math.max(puzzle.width, puzzle.height))
  const gap = Math.max(2, Math.round(cell * 0.08))
  const lit = [...puzzle.words].filter((word) => word.dir === 'across').sort((a, b) => b.length - a.length)[0]
  const litCells = new Set(lit ? Array.from({ length: lit.length }, (_, i) => lit.row * puzzle.width + lit.col + i) : [])
  const firstLit = lit ? lit.row * puzzle.width + lit.col : -1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: puzzle.height }, (_, row) => (
        <div key={row} style={{ display: 'flex', gap }}>
          {Array.from({ length: puzzle.width }, (_, col) => {
            const index = row * puzzle.width + col
            const view = puzzle.cells[index]
            const base: CSSProperties = { width: cell, height: cell, borderRadius: Math.round(cell * 0.2), display: 'flex' }
            if (view?.k === 'L')
              return (
                <div
                  key={col}
                  style={{
                    ...base,
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `${Math.max(2, Math.round(cell * 0.07))}px solid ${INK[900]}`,
                    background: index === firstLit ? SUN[400] : litCells.has(index) ? SUN[200] : WHITE,
                    fontFamily: HEADING,
                    fontSize: cell * 0.6,
                    fontWeight: 700,
                  }}
                >
                  {index === firstLit ? '?' : ''}
                </div>
              )
            if (view?.k === 'C') return <div key={col} style={{ ...base, background: TEAL[100], border: `2px solid ${TEAL[300]}` }} />
            if (view?.k === 'B' && puzzle.format === 'scanword')
              return <div key={col} style={{ ...base, background: BLOCK_FILLS[(view.d ?? index) % BLOCK_FILLS.length] }} />
            return <div key={col} style={base} />
          })}
        </div>
      ))}
    </div>
  )
}

type PuzzleCardProps = {
  puzzle: PuzzleView
  appName: string
  format: string
  topic: string
  difficulty: string
  meta: string
  cta: string
}

export const PuzzleCard = ({ puzzle, appName, format, topic, difficulty, meta, cta }: PuzzleCardProps) => (
  <div style={{ ...PAPER, alignItems: 'center', gap: 64, padding: '0 80px' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 500,
        height: 500,
        borderRadius: 40,
        border: `4px solid ${INK[900]}`,
        background: CREAM[50],
        boxShadow: `0 12px 0 ${LINE.strong}`,
        transform: 'rotate(-2deg)',
      }}
    >
      <GridPreview puzzle={puzzle} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, flex: 1 }}>
      <Brand appName={appName} size={34} />
      <div style={{ display: 'flex', fontFamily: HEADING, fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
        {format}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        <Chip background={MINT[100]} border={MINT[400]}>
          {topic}
        </Chip>
        <Chip background={SUN[100]} border={SUN[400]}>
          {difficulty}
        </Chip>
      </div>
      <div style={{ display: 'flex', fontSize: 32, color: INK[700] }}>{meta}</div>
      <div
        style={{
          display: 'flex',
          alignSelf: 'flex-start',
          marginTop: 8,
          padding: '14px 30px',
          borderRadius: 20,
          border: `4px solid ${INK[900]}`,
          background: CORAL[400],
          boxShadow: `0 8px 0 ${INK[900]}`,
          fontFamily: HEADING,
          fontSize: 34,
          whiteSpace: 'nowrap',
          fontWeight: 700,
        }}
      >
        {cta}
      </div>
    </div>
  </div>
)
