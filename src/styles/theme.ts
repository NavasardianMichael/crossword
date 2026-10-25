import { theme, type ThemeConfig } from 'antd'
import { CORAL, CREAM, CSS_VAR_SCOPE, INK, LAVENDER, LINE, MINT, RADII, ROSE, SUN, TEAL, WHITE } from './tokens'

/**
 * antd's theme, derived from `tokens.ts` (bookie's pattern, on the light algorithm).
 *
 * - **CSS-variable mode** (`cssVar`): antd emits `--ant-*` on `:root` (the scope class is on
 *   `<html>`), so globals.css §2 can alias them for Tailwind and both libraries move together.
 * - **Cascade layer**: the registry wraps antd's styles in `@layer antd`, declared *below*
 *   Tailwind's utilities in globals.css — a utility class always beats antd's own rule, so
 *   no `!important` and no fighting cssinjs.
 * - Seed colours are literals: antd feeds them to its palette generator, which cannot read
 *   `var()`.
 *
 * Coral is the primary colour. A coral fill carries ink text, not white: white on coral
 * would miss AA contrast, ink passes it with room to spare.
 */
export const antdTheme: ThemeConfig = {
  cssVar: { prefix: 'ant', key: CSS_VAR_SCOPE },
  hashed: false,
  algorithm: theme.defaultAlgorithm,

  token: {
    fontFamily: 'var(--font-sans)',
    fontSize: 16,

    colorPrimary: CORAL[500],
    colorLink: TEAL[700],
    colorLinkHover: TEAL[600],
    colorInfo: TEAL[600],
    colorSuccess: MINT[600],
    colorWarning: SUN[600],
    colorError: ROSE[600],

    colorTextBase: INK[900],
    colorTextSecondary: INK[700],
    colorTextTertiary: INK[500],
    colorTextDescription: INK[700],
    colorTextPlaceholder: INK[500],

    colorBgBase: WHITE,
    colorBgLayout: CREAM[100],
    colorBgContainer: WHITE,
    colorBgElevated: WHITE,
    colorBorder: LINE.strong,
    colorBorderSecondary: LINE.subtle,
    colorFillSecondary: CREAM[200],

    borderRadius: RADII.base,
    borderRadiusLG: RADII.lg,
    borderRadiusSM: RADII.sm,
    borderRadiusXS: 4,

    controlHeight: 44,
    controlHeightLG: 52,
    wireframe: false,
    motionDurationMid: '0.2s',
    boxShadowSecondary: `0 18px 40px -18px ${INK[700]}55`,
  },

  components: {
    Button: {
      primaryColor: INK[900],
      primaryShadow: 'none',
      defaultBg: WHITE,
      defaultBorderColor: LINE.strong,
      defaultColor: INK[900],
      defaultHoverBg: CREAM[50],
      defaultHoverBorderColor: INK[300],
      defaultHoverColor: INK[900],
      fontWeight: 700,
      contentFontSizeLG: 17,
    },
    Modal: { titleFontSize: 22, titleColor: INK[900] },
    Segmented: {
      trackBg: CREAM[200],
      itemColor: INK[700],
      itemHoverColor: INK[900],
      itemHoverBg: CREAM[300],
      itemSelectedBg: WHITE,
      itemSelectedColor: INK[900],
    },
    Select: { optionSelectedBg: CORAL[100], optionSelectedColor: INK[900], optionActiveBg: CREAM[100] },
    Input: { activeBorderColor: CORAL[500], hoverBorderColor: INK[300] },
    Tag: { defaultBg: CREAM[100], defaultColor: INK[700] },
    Collapse: { headerBg: 'transparent', contentBg: 'transparent' },
    Tooltip: { colorBgSpotlight: INK[900] },
    Message: { contentBg: WHITE },
    Progress: { defaultColor: CORAL[500], remainingColor: CREAM[200] },
    Skeleton: { gradientFromColor: CREAM[200], gradientToColor: CREAM[100] },
    Alert: { colorErrorBg: ROSE[100], colorErrorBorder: ROSE[300] },
    Switch: { colorPrimary: TEAL[600], colorPrimaryHover: TEAL[700] },
    Steps: { colorPrimary: CORAL[500] },
    Badge: { colorBgContainer: LAVENDER[500] },
  },
}
