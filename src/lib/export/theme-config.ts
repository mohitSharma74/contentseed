export const themeConfig = {
  dark: {
    background: 'oklch(0.18 0.004 308.19)',
    foreground: 'oklch(0.81 0 0)',
    primary: 'oklch(0.72 0.134 49.98)',
    secondary: 'oklch(0.59 0.044 196.02)',
    muted: 'oklch(0.25 0 0)',
    border: 'oklch(0.25 0 0)',
  },
  light: {
    background: 'oklch(1.0 0 0)',
    foreground: 'oklch(0.21 0.032 264.66)',
    primary: 'oklch(0.67 0.137 48.51)',
    secondary: 'oklch(0.54 0.040 196.03)',
    muted: 'oklch(0.97 0.003 264.54)',
    border: 'oklch(0.93 0.006 264.53)',
  },
  fonts: {
    sans: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
    mono: "'JetBrains Mono', monospace",
  },
  platformColors: {
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    reddit: '#FF4500',
    substack: '#FF6719',
  },
  borderRadius: '0.75rem',
};

export type ThemeMode = 'dark' | 'light';
