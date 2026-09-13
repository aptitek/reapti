import { describe, it, expect, vi } from 'vitest';
import React, { createElement, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { ThemeProvider } from '../../src/theme/ThemeProvider.tsx';
import { useTheme } from '../../src/theme/useTheme.ts';

function ConsumerComponent() {
  const { themeName, resolvedMode } = useTheme();
  return createElement(Box, null, themeName + ':' + resolvedMode);
}

function ActionConsumer() {
  const { toggleMode, setThemeName, setMode } = useTheme();
  useEffect(() => {
    toggleMode();
    setThemeName('md3');
    setMode('light');
  }, [toggleMode, setThemeName, setMode]);
  return null;
}

describe('ThemeProvider Rendering', () => {
  it('renders children with default fallback props', () => {
    const html = renderToStaticMarkup(
      createElement(ThemeProvider, null, createElement(ConsumerComponent))
    );
    expect(html).toContain('solarized:');
  });

  it('renders children with explicit theme values', () => {
    const html = renderToStaticMarkup(
      createElement(
        ThemeProvider,
        { defaultThemeName: 'solarized', defaultMode: 'light' },
        createElement(ConsumerComponent)
      )
    );
    expect(html).toContain('solarized:light');
  });

  it('renders with md3 theme and dark mode', () => {
    const html = renderToStaticMarkup(
      createElement(
        ThemeProvider,
        { defaultThemeName: 'md3', defaultMode: 'dark' },
        createElement(ConsumerComponent)
      )
    );
    expect(html).toContain('md3:dark');
  });
});

describe('ThemeProvider Effects', () => {
  it('executes effect and functional context callbacks', () => {
    const origDoc = globalThis.document;
    const setAttribute = vi.fn();
    globalThis.document = {
      documentElement: { setAttribute },
    } as unknown as Document;

    const internals = (
      React as unknown as {
        __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
          H?: {
            useEffect?: (effect: () => void) => void;
          };
        };
      }
    ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

    let ranEffect = false;
    function Probe() {
      if (internals?.H) {
        const orig = internals.H.useEffect;
        internals.H.useEffect = (eff) => {
          ranEffect = true;
          eff();
          orig?.(eff);
        };
      }
      return createElement(
        ThemeProvider,
        { defaultThemeName: 'solarized', defaultMode: 'dark' },
        createElement(ActionConsumer)
      );
    }

    try {
      renderToStaticMarkup(createElement(Probe));
      expect(ranEffect).toBe(true);
      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    } finally {
      globalThis.document = origDoc;
    }
  });
});
