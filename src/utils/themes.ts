export type ThemeName =
  | 'matrix'
  | 'amber'
  | 'cyberpunk'
  | 'ubuntu'
  | 'monochrome'
  | 'dracula'
  | 'nord'
  | 'tokyo-night'
  | 'synthwave'
  | 'gruvbox'
  | 'blood'
  | 'catppuccin';

export interface Theme {
  name: ThemeName;
  label: string;
  bgColor: string;
  textColor: string;
  promptColor: string;
  highlightColor: string;
  glowClass: string;
  screenBg: string;
  borderColor: string;
}

export const themes: Record<ThemeName, Theme> = {
  matrix: {
    name: 'matrix',
    label: 'Matrix Green',
    bgColor: '#001a00',
    textColor: '#22c55e',
    promptColor: '#00ff41',
    highlightColor: '#4ade80',
    glowClass: 'glow-matrix',
    screenBg: '#000a00',
    borderColor: '#22c55e',
  },
  amber: {
    name: 'amber',
    label: 'Amber Phosphor',
    bgColor: '#1a0f00',
    textColor: '#f59e0b',
    promptColor: '#fbbf24',
    highlightColor: '#fcd34d',
    glowClass: 'glow-amber',
    screenBg: '#0f0800',
    borderColor: '#f59e0b',
  },
  cyberpunk: {
    name: 'cyberpunk',
    label: 'Cyberpunk Neon',
    bgColor: '#0d001a',
    textColor: '#22d3ee',
    promptColor: '#d946ef',
    highlightColor: '#e879f9',
    glowClass: 'glow-cyan',
    screenBg: '#08000f',
    borderColor: '#d946ef',
  },
  ubuntu: {
    name: 'ubuntu',
    label: 'Ubuntu Terminal',
    bgColor: '#1a0410',
    textColor: '#e2e8f0',
    promptColor: '#df4c1e',
    highlightColor: '#e95420',
    glowClass: 'glow-ubuntu',
    screenBg: '#0f020a',
    borderColor: '#df4c1e',
  },
  monochrome: {
    name: 'monochrome',
    label: 'Monochrome',
    bgColor: '#0a0a0a',
    textColor: '#d4d4d4',
    promptColor: '#ffffff',
    highlightColor: '#a3a3a3',
    glowClass: '',
    screenBg: '#050505',
    borderColor: '#666666',
  },
  dracula: {
    name: 'dracula',
    label: 'Dracula',
    bgColor: '#1e1f2b',
    textColor: '#f8f8f2',
    promptColor: '#ff79c6',
    highlightColor: '#50fa7b',
    glowClass: 'glow-dracula',
    screenBg: '#13141c',
    borderColor: '#bd93f9',
  },
  nord: {
    name: 'nord',
    label: 'Nord Arctic',
    bgColor: '#1e222a',
    textColor: '#d8dee9',
    promptColor: '#88c0d0',
    highlightColor: '#a3be8c',
    glowClass: 'glow-nord',
    screenBg: '#13161c',
    borderColor: '#81a1c1',
  },
  'tokyo-night': {
    name: 'tokyo-night',
    label: 'Tokyo Night',
    bgColor: '#13141f',
    textColor: '#a9b1d6',
    promptColor: '#7dcfff',
    highlightColor: '#bb9af7',
    glowClass: 'glow-tokyo',
    screenBg: '#0b0c15',
    borderColor: '#ff9e64',
  },
  synthwave: {
    name: 'synthwave',
    label: 'Synthwave 84',
    bgColor: '#1e0929',
    textColor: '#e0c8f0',
    promptColor: '#ff2d95',
    highlightColor: '#36d8e7',
    glowClass: 'glow-synthwave',
    screenBg: '#12041a',
    borderColor: '#fcee8f',
  },
  gruvbox: {
    name: 'gruvbox',
    label: 'Gruvbox Dark',
    bgColor: '#1c1c1c',
    textColor: '#ebdbb2',
    promptColor: '#fe8019',
    highlightColor: '#b8bb26',
    glowClass: 'glow-gruvbox',
    screenBg: '#111111',
    borderColor: '#d3869b',
  },
  blood: {
    name: 'blood',
    label: 'Blood Red',
    bgColor: '#0f0000',
    textColor: '#ff6b6b',
    promptColor: '#ff0000',
    highlightColor: '#ff3333',
    glowClass: 'glow-blood',
    screenBg: '#080000',
    borderColor: '#8b0000',
  },
  catppuccin: {
    name: 'catppuccin',
    label: 'Catppuccin Mocha',
    bgColor: '#181825',
    textColor: '#cdd6f4',
    promptColor: '#f5c2e7',
    highlightColor: '#94e2d5',
    glowClass: 'glow-catppuccin',
    screenBg: '#0e0e17',
    borderColor: '#b4befe',
  },
};

export const themeList: ThemeName[] = Object.keys(themes) as ThemeName[];

export const themeLabels: Record<ThemeName, string> = {} as Record<ThemeName, string>;
for (const key of themeList) {
  themeLabels[key] = themes[key].label;
}
