import { describe, it, expect, vi } from 'vitest';
import {
  DEFAULT_HERO_TICKER_PHRASES,
  DEFAULT_HERO_TICKER_PREFIX,
  DEFAULT_HERO_TICKER_SUFFIX,
  DEFAULT_HERO_TICKER_ANIMATION_MODE,
  THEME_ACCENT_VARS,
  resolveAccentVar,
  computeIsPaused,
  resolvePhrasesList,
  resolveNibVisibility,
  resolveTestId,
  resolveHeroTickerConfig,
  createTickerInteractionHandlers,
  FLOURISH_PATHS,
  calculateFlourishOffset,
  syncCursiveStyle,
  syncWrapperWidth,
  getNextIndex,
  getPrevIndex,
  incrementChars,
  decrementChars,
  calculateCurrentProgress,
  resolveHeroTickerDark,
} from '../../src/components/molecules/HeroTicker/heroTickerHelpers.ts';

describe('heroTickerHelpers - Defaults and States', () => {
  it('defines default phrases, prefix, and suffix', () => {
    expect(DEFAULT_HERO_TICKER_PHRASES.length).toBeGreaterThan(0);
    expect(DEFAULT_HERO_TICKER_PREFIX).toBe('We craft ');
    expect(DEFAULT_HERO_TICKER_SUFFIX).toBe(' that inspire.');
    expect(DEFAULT_HERO_TICKER_ANIMATION_MODE).toBe('cursive-draw');
  });

  it('resolves accent variables correctly', () => {
    expect(resolveAccentVar('primary')).toBe(THEME_ACCENT_VARS.primary);
    expect(resolveAccentVar('secondary')).toBe(THEME_ACCENT_VARS.secondary);
    expect(resolveAccentVar('tertiary')).toBe(THEME_ACCENT_VARS.tertiary);
    expect(resolveAccentVar('primary', 'var(--custom-accent)')).toBe(
      'var(--custom-accent)'
    );
  });

  it('computes pause states under various interaction conditions', () => {
    expect(
      computeIsPaused({
        isPausedManually: true,
        pauseOnHover: false,
        isHovered: false,
        pauseOnFocus: false,
        isFocused: false,
      })
    ).toBe(true);

    expect(
      computeIsPaused({
        isPausedManually: false,
        pauseOnHover: true,
        isHovered: true,
        pauseOnFocus: false,
        isFocused: false,
      })
    ).toBe(true);

    expect(
      computeIsPaused({
        isPausedManually: false,
        pauseOnHover: true,
        isHovered: false,
        pauseOnFocus: true,
        isFocused: true,
      })
    ).toBe(true);

    expect(
      computeIsPaused({
        isPausedManually: false,
        pauseOnHover: true,
        isHovered: false,
        pauseOnFocus: true,
        isFocused: false,
      })
    ).toBe(false);
  });
});

describe('heroTickerHelpers - Config Resolvers', () => {
  it('resolves phrases list fallback and clones', () => {
    expect(resolvePhrasesList()).toEqual([...DEFAULT_HERO_TICKER_PHRASES]);
    expect(resolvePhrasesList([])).toEqual([...DEFAULT_HERO_TICKER_PHRASES]);
    expect(resolvePhrasesList(['Custom'])).toEqual(['Custom']);
  });

  it('resolves nib and quill visibility flags', () => {
    expect(resolveNibVisibility(true, undefined)).toBe(true);
    expect(resolveNibVisibility(false, undefined)).toBe(false);
    expect(resolveNibVisibility(true, false)).toBe(false);
    expect(resolveNibVisibility(false, true)).toBe(true);
    expect(resolveNibVisibility(undefined, undefined)).toBe(true);
  });

  it('resolves test ids with fallbacks', () => {
    expect(resolveTestId({})).toBe('hero-ticker');
    expect(resolveTestId({ dataTestId: 'custom-id' })).toBe('custom-id');
    expect(resolveTestId({ 'data-testid': 'legacy-id' })).toBe('legacy-id');
  });

  it('resolves full HeroTicker configuration with merged defaults', () => {
    const config = resolveHeroTickerConfig({
      prefix: 'Start ',
      suffix: ' End',
      phrases: ['One', 'Two'],
      accentColor: 'secondary',
    });

    expect(config.prefix).toBe('Start ');
    expect(config.suffix).toBe(' End');
    expect(config.phrases).toEqual(['One', 'Two']);
    expect(config.accentColor).toBe('secondary');
    expect(config.accentVar).toBe(THEME_ACCENT_VARS.secondary);
    expect(config.animationMode).toBe('cursive-draw');
    expect(config.flourish).toBe('swoosh');
    expect(config.drawSpeed).toBe(2400);
    expect(config.typeSpeed).toBe(120);
    expect(config.eraseSpeed).toBe(50);
    expect(config.pauseDuration).toBe(2600);
    expect(config.testId).toBe('hero-ticker');
  });

  it('finely tunes drawSpeed and typeSpeed when custom timing props are passed', () => {
    const config = resolveHeroTickerConfig({
      drawSpeed: 3500,
      typeSpeed: 140,
      eraseSpeed: 60,
      pauseDuration: 3000,
    });
    expect(config.drawSpeed).toBe(3500);
    expect(config.typeSpeed).toBe(140);
    expect(config.eraseSpeed).toBe(60);
    expect(config.pauseDuration).toBe(3000);
  });
});

describe('heroTickerHelpers - Handlers and DOM Sync', () => {
  it('creates interaction handlers for hover and focus management', () => {
    let hovered = false;
    let focused = false;
    const handlers = createTickerInteractionHandlers(
      (v) => {
        hovered = v;
      },
      (v) => {
        focused = v;
      }
    );

    handlers.onMouseEnter();
    expect(hovered).toBe(true);
    handlers.onMouseLeave();
    expect(hovered).toBe(false);
    handlers.onFocus();
    expect(focused).toBe(true);

    const internalChild = {};
    handlers.onBlur({
      currentTarget: { contains: (node: unknown) => node === internalChild },
      relatedTarget: internalChild,
    });
    expect(focused).toBe(true);

    handlers.onBlur({
      currentTarget: { contains: () => false },
      relatedTarget: null,
    });
    expect(focused).toBe(false);

    handlers.onBlur({});
    expect(focused).toBe(false);
  });

  it('syncs cursive and wrapper width safely', () => {
    const store = new Map<string, string>();
    const mockEl = {
      style: { setProperty: (k: string, v: string) => store.set(k, v) },
      setAttribute: vi.fn(),
    } as unknown as HTMLSpanElement;

    syncCursiveStyle(mockEl, { clipProg: 80, isFade: true, fadeOpacity: 0.5 });
    expect(store.get('--ticker-clip-prog')).toBe('80%');
    expect(store.get('--ticker-fade-opacity')).toBe('0.5');

    syncCursiveStyle(mockEl, { clipProg: 100, isFade: false, fadeOpacity: 1 });
    expect(store.get('--ticker-fade-opacity')).toBe('1');
    expect(() =>
      syncCursiveStyle(null, { clipProg: 50, isFade: false, fadeOpacity: 1 })
    ).not.toThrow();

    syncWrapperWidth(mockEl, 120);
    expect(store.get('--ticker-word-width')).toBe('120px');
    expect(() => syncWrapperWidth(null, 120)).not.toThrow();
    expect(() => syncWrapperWidth(mockEl, 0)).not.toThrow();
  });
});

describe('heroTickerHelpers - Animation & Flourish Math', () => {
  it('calculates flourish offset and provides flourish path strings', () => {
    expect(FLOURISH_PATHS.swoosh).toContain('M 0 12');
    expect(FLOURISH_PATHS.wave).toContain('M 0 14');
    expect(FLOURISH_PATHS.loop).toContain('M 0 16');

    expect(calculateFlourishOffset('drawing', 50)).toBe(100);
    expect(calculateFlourishOffset('erasing', 50)).toBe(100);
    expect(calculateFlourishOffset('paused', 50)).toBe(0);
  });

  it('computes index navigation, char counts, and progress', () => {
    expect(getNextIndex(1, 3)).toBe(2);
    expect(getNextIndex(2, 3)).toBe(0);
    expect(getPrevIndex(0, 3)).toBe(2);
    expect(getPrevIndex(2, 3)).toBe(1);

    expect(incrementChars(2)).toBe(3);
    expect(decrementChars(2)).toBe(1);

    expect(
      calculateCurrentProgress({
        mode: 'cursive-draw',
        drawProgress: 75,
        typeCharsCount: 5,
        phraseLength: 10,
      })
    ).toBe(75);
    expect(
      calculateCurrentProgress({
        mode: 'cursive-type',
        drawProgress: 0,
        typeCharsCount: 5,
        phraseLength: 10,
      })
    ).toBe(50);
    expect(
      calculateCurrentProgress({
        mode: 'cursive-type',
        drawProgress: 0,
        typeCharsCount: 0,
        phraseLength: 0,
      })
    ).toBe(0);
    expect(
      calculateCurrentProgress({
        mode: 'fade',
        drawProgress: 0,
        typeCharsCount: 0,
        phraseLength: 10,
      })
    ).toBe(100);
  });
});

describe('heroTickerHelpers - Theme Mode Resolution', () => {
  it('resolves dark and light theme overrides correctly', () => {
    expect(resolveHeroTickerDark('dark', false)).toBe(true);
    expect(resolveHeroTickerDark('dark', true)).toBe(true);
    expect(resolveHeroTickerDark('light', true)).toBe(false);
    expect(resolveHeroTickerDark('light', false)).toBe(false);
    expect(resolveHeroTickerDark('auto', true)).toBe(true);
    expect(resolveHeroTickerDark('auto', false)).toBe(false);
    expect(resolveHeroTickerDark(undefined, true)).toBe(true);
    expect(resolveHeroTickerDark(undefined, false)).toBe(false);
  });
});
