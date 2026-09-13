import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from './ThemeContext.ts';

/**
 * Hook to access active theme and mode from ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
