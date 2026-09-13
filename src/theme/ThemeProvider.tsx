import type { ReactNode, ReactElement } from 'react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import type { ThemeMode, ResolvedThemeMode } from './types.ts';
import { getTheme } from './themeRegistry.ts';
import { useThemeMode } from './useThemeMode.ts';
import { ThemeContext } from './ThemeContext.ts';

import {
  resolveNextThemeMode,
  syncDocumentTheme,
  resolveCurrentMode,
} from './themeProviderHelpers.ts';

export interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeName?: string;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultThemeName = 'solarized',
  defaultMode = 'auto',
}: ThemeProviderProps): ReactElement {
  const detectedMode = useThemeMode();
  const [themeName, setThemeName] = useState<string>(defaultThemeName);
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const resolvedMode: ResolvedThemeMode = useMemo(
    () => resolveCurrentMode(mode, detectedMode),
    [mode, detectedMode]
  );

  useEffect(() => {
    syncDocumentTheme(resolvedMode);
  }, [resolvedMode]);

  const toggleMode = useCallback(() => {
    setMode(resolveNextThemeMode);
  }, []);

  const theme = useMemo(() => getTheme(themeName), [themeName]);

  const value = useMemo(
    () => ({
      themeName,
      theme,
      mode,
      resolvedMode,
      setThemeName,
      setMode,
      toggleMode,
    }),
    [themeName, theme, mode, resolvedMode, toggleMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
