/**
 * Design Tokens for Designer Portfolio
 * A sophisticated design system with dark/light themes
 * Typography: Display (Space Grotesk) + Body (Geist)
 * Accent: Sophisticated Mint/Teal #00E5A0
 */

export type ThemeMode = 'light' | 'dark';

export interface ColorTokens {
  // Base colors
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderStrong: string;

  // Accent colors
  accent: string;
  accentHover: string;
  accentMuted: string;
  accentFaint: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textAccent: string;

  // Semantic colors
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;

  // Overlay
  overlay: string;
  overlayStrong: string;
}

export interface TypographyTokens {
  fontFamily: {
    display: string;
    body: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface SpacingTokens {
  base: number;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface BorderRadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ShadowTokens {
  subtle: string;
  medium: string;
  strong: string;
  glow: string;
  glowStrong: string;
}

export interface TransitionTokens {
  fast: string;
  normal: string;
  slow: string;
  spring: string;
}

export interface BreakpointTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ContainerTokens {
  maxWidth: string;
  paddingMobile: string;
  paddingDesktop: string;
}

export interface ZIndexTokens {
  hide: number;
  base: number;
  dropdown: number;
  sticky: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
}

export interface DesignTokens {
  colors: Record<ThemeMode, ColorTokens>;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
  transitions: TransitionTokens;
  breakpoints: BreakpointTokens;
  container: ContainerTokens;
  zIndex: ZIndexTokens;
}

// ============================================
// COLOR TOKENS
// ============================================

const darkColors: ColorTokens = {
  background: '#0A0A0A',
  surface: '#121212',
  surfaceElevated: '#1A1A1A',
  border: '#2A2A2A',
  borderStrong: '#3A3A3A',

  accent: '#00E5A0',
  accentHover: '#00FFB8',
  accentMuted: '#00B880',
  accentFaint: '#00E5A01A',

  textPrimary: '#FAFAFA',
  textSecondary: '#A3A3A3',
  textMuted: '#737373',
  textInverse: '#0A0A0A',
  textAccent: '#00E5A0',

  success: '#00E5A0',
  successMuted: '#00E5A01A',
  warning: '#FFB800',
  warningMuted: '#FFB8001A',
  error: '#FF4D4D',
  errorMuted: '#FF4D4D1A',

  overlay: '#00000080',
  overlayStrong: '#000000CC',
};

const lightColors: ColorTokens = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E5E5E5',
  borderStrong: '#D4D4D4',

  accent: '#00B880',
  accentHover: '#00E5A0',
  accentMuted: '#008F64',
  accentFaint: '#00E5A01A',

  textPrimary: '#0A0A0A',
  textSecondary: '#525252',
  textMuted: '#737373',
  textInverse: '#FAFAFA',
  textAccent: '#00B880',

  success: '#00B880',
  successMuted: '#00E5A01A',
  warning: '#E6A000',
  warningMuted: '#FFB8001A',
  error: '#E02B2B',
  errorMuted: '#FF4D4D1A',

  overlay: '#00000040',
  overlayStrong: '#00000080',
};

export const colors: Record<ThemeMode, ColorTokens> = {
  dark: darkColors,
  light: lightColors,
};

// ============================================
// TYPOGRAPHY TOKENS
// ============================================

export const typography: TypographyTokens = {
  fontFamily: {
    display: "'Space Grotesk', 'Syne', system-ui, sans-serif",
    body: "'Geist', 'Inter', 'DM Sans', system-ui, sans-serif",
    mono: "'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',      // 12-14px
    sm: 'clamp(0.875rem, 0.825rem + 0.25vw, 1rem)',        // 14-16px
    base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',       // 16-18px
    lg: 'clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem)',     // 18-20px
    xl: 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',         // 20-24px
    '2xl': 'clamp(1.5rem, 1.35rem + 0.75vw, 2rem)',        // 24-32px
    '3xl': 'clamp(2rem, 1.75rem + 1.25vw, 3rem)',          // 32-48px
    '4xl': 'clamp(2.5rem, 2.1rem + 2vw, 4rem)',            // 40-64px
    '5xl': 'clamp(3.5rem, 2.8rem + 3.5vw, 6rem)',          // 56-96px
    '6xl': 'clamp(4.5rem, 3.5rem + 5vw, 8rem)',            // 72-128px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.7,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
};

// Fluid display font sizes for headlines
export const displayFontSize = {
  sm: 'clamp(2rem, 1.5rem + 2.5vw, 3.5rem)',      // 32-56px
  md: 'clamp(2.5rem, 1.8rem + 3.5vw, 5rem)',      // 40-80px
  lg: 'clamp(3.5rem, 2.5rem + 5vw, 7rem)',        // 56-112px
  xl: 'clamp(4.5rem, 3rem + 7.5vw, 10rem)',       // 72-160px
  '2xl': 'clamp(6rem, 4rem + 10vw, 14rem)',       // 96-224px
};

// ============================================
// SPACING TOKENS
// ============================================

export const spacing: SpacingTokens = {
  base: 4,
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

// Fluid spacing for responsive layouts
export const fluidSpacing = {
  section: 'clamp(48px, 8vw, 96px)',     // Section vertical padding
  container: 'clamp(24px, 5vw, 48px)',    // Container horizontal padding
  gap: 'clamp(16px, 3vw, 32px)',          // Grid/flex gap
  gapSm: 'clamp(8px, 1.5vw, 16px)',       // Small gap
  gapLg: 'clamp(32px, 5vw, 64px)',        // Large gap
};

// ============================================
// BORDER RADIUS TOKENS
// ============================================

export const borderRadius: BorderRadiusTokens = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
};

// ============================================
// SHADOW TOKENS
// ============================================

export const shadows: ShadowTokens = {
  subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 1px rgb(0 0 0 / 0.1)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  strong: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px rgb(0 229 160 / 0.15), 0 0 40px rgb(0 229 160 / 0.1)',
  glowStrong: '0 0 30px rgb(0 229 160 / 0.25), 0 0 60px rgb(0 229 160 / 0.15)',
};

// Dark mode specific shadows (darker, more subtle)
export const darkShadows: ShadowTokens = {
  subtle: '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 1px 3px 1px rgb(0 0 0 / 0.4)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  strong: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
  glow: '0 0 20px rgb(0 229 160 / 0.2), 0 0 40px rgb(0 229 160 / 0.1)',
  glowStrong: '0 0 30px rgb(0 229 160 / 0.3), 0 0 60px rgb(0 229 160 / 0.2)',
};

// ============================================
// TRANSITION TOKENS
// ============================================

export const transitions: TransitionTokens = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// ============================================
// BREAKPOINT TOKENS
// ============================================

export const breakpoints: BreakpointTokens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Media query helpers
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  // Max-width queries
  'max-sm': `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  'max-md': `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  'max-lg': `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  'max-xl': `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  // Dark/light mode
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
};

// ============================================
// CONTAINER TOKENS
// ============================================

export const container: ContainerTokens = {
  maxWidth: '1280px',
  paddingMobile: '24px',
  paddingDesktop: '32px',
};

// ============================================
// Z-INDEX TOKENS
// ============================================

export const zIndex: ZIndexTokens = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
  toast: 600,
};

// ============================================
// COMPOSITE DESIGN TOKENS OBJECT
// ============================================

export const designTokens: DesignTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  container,
  zIndex,
};

// ============================================
// CSS CUSTOM PROPERTIES GENERATOR
// ============================================

/**
 * Generates CSS custom properties for a theme
 */
export function generateCSSVariables(theme: ThemeMode = 'dark'): string {
  const themeColors = colors[theme];
  const themeShadows = theme === 'dark' ? darkShadows : shadows;

  const vars: Record<string, string> = {
    // Colors
    '--color-background': themeColors.background,
    '--color-surface': themeColors.surface,
    '--color-surface-elevated': themeColors.surfaceElevated,
    '--color-border': themeColors.border,
    '--color-border-strong': themeColors.borderStrong,

    '--color-accent': themeColors.accent,
    '--color-accent-hover': themeColors.accentHover,
    '--color-accent-muted': themeColors.accentMuted,
    '--color-accent-faint': themeColors.accentFaint,

    '--color-text-primary': themeColors.textPrimary,
    '--color-text-secondary': themeColors.textSecondary,
    '--color-text-muted': themeColors.textMuted,
    '--color-text-inverse': themeColors.textInverse,
    '--color-text-accent': themeColors.textAccent,

    '--color-success': themeColors.success,
    '--color-success-muted': themeColors.successMuted,
    '--color-warning': themeColors.warning,
    '--color-warning-muted': themeColors.warningMuted,
    '--color-error': themeColors.error,
    '--color-error-muted': themeColors.errorMuted,

    '--color-overlay': themeColors.overlay,
    '--color-overlay-strong': themeColors.overlayStrong,

    // Typography
    '--font-display': typography.fontFamily.display,
    '--font-body': typography.fontFamily.body,
    '--font-mono': typography.fontFamily.mono,

    '--font-size-xs': typography.fontSize.xs,
    '--font-size-sm': typography.fontSize.sm,
    '--font-size-base': typography.fontSize.base,
    '--font-size-lg': typography.fontSize.lg,
    '--font-size-xl': typography.fontSize.xl,
    '--font-size-2xl': typography.fontSize['2xl'],
    '--font-size-3xl': typography.fontSize['3xl'],
    '--font-size-4xl': typography.fontSize['4xl'],
    '--font-size-5xl': typography.fontSize['5xl'],
    '--font-size-6xl': typography.fontSize['6xl'],

    '--font-weight-light': String(typography.fontWeight.light),
    '--font-weight-normal': String(typography.fontWeight.normal),
    '--font-weight-medium': String(typography.fontWeight.medium),
    '--font-weight-semibold': String(typography.fontWeight.semibold),
    '--font-weight-bold': String(typography.fontWeight.bold),

    '--line-height-tight': String(typography.lineHeight.tight),
    '--line-height-normal': String(typography.lineHeight.normal),
    '--line-height-relaxed': String(typography.lineHeight.relaxed),

    '--letter-spacing-tight': typography.letterSpacing.tight,
    '--letter-spacing-normal': typography.letterSpacing.normal,
    '--letter-spacing-wide': typography.letterSpacing.wide,

    // Display font sizes
    '--font-size-display-sm': displayFontSize.sm,
    '--font-size-display-md': displayFontSize.md,
    '--font-size-display-lg': displayFontSize.lg,
    '--font-size-display-xl': displayFontSize.xl,
    '--font-size-display-2xl': displayFontSize['2xl'],

    // Spacing
    '--space-xs': spacing.xs,
    '--space-sm': spacing.sm,
    '--space-md': spacing.md,
    '--space-lg': spacing.lg,
    '--space-xl': spacing.xl,
    '--space-2xl': spacing['2xl'],
    '--space-3xl': spacing['3xl'],
    '--space-4xl': spacing['4xl'],

    // Fluid spacing
    '--space-section': fluidSpacing.section,
    '--space-container': fluidSpacing.container,
    '--space-gap': fluidSpacing.gap,
    '--space-gap-sm': fluidSpacing.gapSm,
    '--space-gap-lg': fluidSpacing.gapLg,

    // Border radius
    '--radius-none': borderRadius.none,
    '--radius-sm': borderRadius.sm,
    '--radius-md': borderRadius.md,
    '--radius-lg': borderRadius.lg,
    '--radius-xl': borderRadius.xl,
    '--radius-2xl': borderRadius['2xl'],
    '--radius-full': borderRadius.full,

    // Shadows
    '--shadow-subtle': themeShadows.subtle,
    '--shadow-medium': themeShadows.medium,
    '--shadow-strong': themeShadows.strong,
    '--shadow-glow': themeShadows.glow,
    '--shadow-glow-strong': themeShadows.glowStrong,

    // Transitions
    '--transition-fast': transitions.fast,
    '--transition-normal': transitions.normal,
    '--transition-slow': transitions.slow,
    '--transition-spring': transitions.spring,

    // Container
    '--container-max-width': container.maxWidth,
    '--container-padding-mobile': container.paddingMobile,
    '--container-padding-desktop': container.paddingDesktop,

    // Z-index
    '--z-hide': String(zIndex.hide),
    '--z-base': String(zIndex.base),
    '--z-dropdown': String(zIndex.dropdown),
    '--z-sticky': String(zIndex.sticky),
    '--z-modal': String(zIndex.modal),
    '--z-popover': String(zIndex.popover),
    '--z-tooltip': String(zIndex.tooltip),
    '--z-toast': String(zIndex.toast),
  };

  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');
}

/**
 * Generates complete CSS with both light and dark themes
 */
export function generateFullCSS(): string {
  const darkVars = generateCSSVariables('dark');
  const lightVars = generateCSSVariables('light');

  return `:root {
  ${lightVars}
}

[data-theme="dark"] {
  ${darkVars}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    ${darkVars}
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`;
}

// ============================================
// THEME UTILITIES
// ============================================

/**
 * Get color value for current theme
 */
export function getColor(token: keyof ColorTokens, theme: ThemeMode = 'dark'): string {
  return colors[theme][token];
}

/**
 * Get spacing value
 */
export function getSpacing(key: keyof SpacingTokens): string {
  return spacing[key];
}

/**
 * Get fluid spacing value
 */
export function getFluidSpacing(key: keyof typeof fluidSpacing): string {
  return fluidSpacing[key];
}

/**
 * Get font size
 */
export function getFontSize(key: keyof TypographyTokens['fontSize']): string {
  return typography.fontSize[key];
}

/**
 * Get display font size
 */
export function getDisplayFontSize(key: keyof typeof displayFontSize): string {
  return displayFontSize[key];
}

/**
 * Get shadow
 */
export function getShadow(key: keyof ShadowTokens, theme: ThemeMode = 'dark'): string {
  return theme === 'dark' ? darkShadows[key] : shadows[key];
}

/**
 * Get transition
 */
export function getTransition(key: keyof TransitionTokens): string {
  return transitions[key];
}

/**
 * Get breakpoint
 */
export function getBreakpoint(key: keyof BreakpointTokens): string {
  return breakpoints[key];
}

/**
 * Get media query
 */
export function getMediaQuery(key: keyof typeof mediaQueries): string {
  return mediaQueries[key];
}

/**
 * Get container styles
 */
export function getContainerStyles(): { maxWidth: string; padding: string } {
  return {
    maxWidth: container.maxWidth,
    padding: `clamp(${container.paddingMobile}, 5vw, ${container.paddingDesktop})`,
  };
}

/**
 * Generate responsive font-size clamp
 */
export function fluidFontSize(
  min: number,
  max: number,
  viewportMin = 320,
  viewportMax = 1920
): string {
  const slope = (max - min) / (viewportMax - viewportMin);
  const intercept = min - slope * viewportMin;
  return `clamp(${min}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${max}px)`;
}

/**
 * Generate responsive spacing clamp
 */
export function fluidSpacingCSS(
  min: number,
  max: number,
  viewportMin = 320,
  viewportMax = 1920
): string {
  const slope = (max - min) / (viewportMax - viewportMin);
  const intercept = min - slope * viewportMin;
  return `clamp(${min}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${max}px)`;
}

// ============================================
// COMPONENT TOKEN PRESETS
// ============================================

export const componentTokens = {
  button: {
    height: {
      sm: '36px',
      md: '44px',
      lg: '52px',
    },
    padding: {
      sm: '0 12px',
      md: '0 20px',
      lg: '0 28px',
    },
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
    borderRadius: borderRadius.lg,
    fontWeight: typography.fontWeight.medium,
    transition: transitions.fast,
  },

  input: {
    height: '48px',
    padding: '0 16px',
    fontSize: typography.fontSize.base,
    borderRadius: borderRadius.md,
    borderWidth: '1px',
    transition: transitions.fast,
  },

  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: '1px',
    shadow: shadows.medium,
    transition: transitions.normal,
  },

  modal: {
    borderRadius: borderRadius['2xl'],
    shadow: shadows.strong,
    overlay: darkColors.overlayStrong,
  },

  tooltip: {
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: typography.fontSize.sm,
    borderRadius: borderRadius.md,
    shadow: shadows.medium,
    zIndex: zIndex.tooltip,
  },

  toast: {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.lg,
    shadow: shadows.strong,
    zIndex: zIndex.toast,
    minWidth: '280px',
    maxWidth: '480px',
  },
};

// ============================================
// EXPORT ALL
// ============================================

export default designTokens;