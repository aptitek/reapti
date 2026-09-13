import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTheme } from '../../src/theme/useTheme.ts';

function FaultyConsumer() {
  useTheme();
  return null;
}

describe('useTheme', () => {
  it('throws error when invoked outside ThemeProvider', () => {
    expect(() => renderToStaticMarkup(createElement(FaultyConsumer))).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
  });
});
