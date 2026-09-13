import { createContext } from 'react';
import type { ThemeMode, ResolvedThemeMode, ThemeTokens } from './types.ts';

export interface ThemeContextValue {
  themeName: string;
  theme: ThemeTokens;
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  setThemeName: (name: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
