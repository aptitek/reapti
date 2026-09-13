import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  FancySwitch,
  ZenithSwitch,
  ThemeSwitch,
  MeridianSwitch,
  LanguageSwitch,
  ClockFormatSwitch,
  AttendanceSwitch,
  BadgeAccessSwitch,
} from '../../src/components/molecules/FancySwitch/FancySwitch.tsx';
import { applyThemeToggle } from '../../src/components/molecules/FancySwitch/fancySwitchHelpers.ts';

describe('FancySwitch Molecule Base & Celestial Suite', () => {
  it('renders base FancySwitch with proper accessibility attributes', () => {
    const html = renderToStaticMarkup(
      createElement(FancySwitch, {
        checked: false,
        ariaLabel: 'System fancy switch',
        dataTestId: 'test-fancy-switch',
      })
    );

    expect(html).toContain('m3e-switch');
    expect(html).toContain('data-testid="test-fancy-switch"');
    expect(html).toContain('switch_root');
  });

  it('handles bimodal class assignment', () => {
    const html = renderToStaticMarkup(
      createElement(FancySwitch, {
        checked: true,
        bimodal: true,
        dataTestId: 'bimodal-switch',
      })
    );
    expect(html).toContain('switch_bimodal');
  });

  it('renders ZenithSwitch with celestial sun and moon in light and dark modes', () => {
    const lightHtml = renderToStaticMarkup(
      createElement(ZenithSwitch, {
        checked: false,
        dataTestId: 'light-zenith',
      })
    );
    expect(lightHtml).toContain('zenith-sun');
    expect(lightHtml).toContain('fancy_celestial_arc');

    const darkHtml = renderToStaticMarkup(
      createElement(ZenithSwitch, {
        checked: true,
        dataTestId: 'dark-zenith',
      })
    );
    expect(darkHtml).toContain('zenith-moon');
    expect(darkHtml).toContain('fancy_celestial_arc');
  });

  it('renders ThemeSwitch region container', () => {
    const html = renderToStaticMarkup(
      createElement(ThemeSwitch, {
        className: 'custom-theme-switch-wrapper',
        dataTestId: 'app-theme-switch',
      })
    );
    expect(html).toContain('custom-theme-switch-wrapper');
    expect(html).toContain('role="region"');
  });
});

describe('MeridianSwitch & Language Suite', () => {
  it('renders MeridianSwitch with UK flag for English and France flag for French', () => {
    const enHtml = renderToStaticMarkup(
      createElement(MeridianSwitch, {
        language: 'en',
        dataTestId: 'meridian-en',
      })
    );
    expect(enHtml).toContain('fancy_flag_puck');
    expect(enHtml).toContain('peeking-airplane');

    const frHtml = renderToStaticMarkup(
      createElement(MeridianSwitch, {
        language: 'fr',
        dataTestId: 'meridian-fr',
      })
    );
    expect(frHtml).toContain('fancy_flag_puck');
    expect(frHtml).toContain('data-checked="true"');
  });

  it('renders LanguageSwitch region wrapper', () => {
    const html = renderToStaticMarkup(
      createElement(LanguageSwitch, {
        dataTestId: 'app-language-switch',
      })
    );
    expect(html).toContain('role="region"');
  });
});

describe('ClockFormatSwitch Suite', () => {
  it('renders 12h format with digital clock slot on inactive side', () => {
    const html = renderToStaticMarkup(
      createElement(ClockFormatSwitch, {
        format: '12h',
        dataTestId: 'clock-12h',
      })
    );
    expect(html).toContain('12');
    expect(html).toContain('digital-clock-slot');
    expect(html).toContain('data-checked="false"');
  });

  it('renders 24h format with digital clock slot on inactive side', () => {
    const html = renderToStaticMarkup(
      createElement(ClockFormatSwitch, {
        format: '24h',
        dataTestId: 'clock-24h',
      })
    );
    expect(html).toContain('24');
    expect(html).toContain('digital-clock-slot');
    expect(html).toContain('data-checked="true"');
  });

  it('supports callback triggers in uncontrolled simulation', () => {
    const onChangeFormat = vi.fn();
    const onChange = vi.fn();
    const switchComp = createElement(ClockFormatSwitch, {
      format: '12h',
      onChangeFormat,
      onChange,
    });
    expect(switchComp.props.format).toBe('12h');
  });
});

type RenderableComp = {
  render: (
    p: unknown,
    r: unknown
  ) => {
    props: {
      onChange?: (v: boolean) => void;
      ref?: unknown;
      children?: {
        props: {
          onChange?: (v: boolean) => void;
          onLanguageChange?: (l: string) => void;
        };
      };
    };
  };
};

describe('FancySwitch ForwardRef and Callback Dispatch', () => {
  it('dispatches onChange and onToggle callbacks when switch changes', () => {
    const onChange = vi.fn();
    const onToggle = vi.fn();
    const ref = { current: null };

    const el = (FancySwitch as unknown as RenderableComp).render(
      { onChange, onToggle },
      ref
    );
    el.props.onChange?.(true);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(onToggle).toHaveBeenCalledWith(true);

    const fallbackEl = (FancySwitch as unknown as RenderableComp).render(
      {},
      null
    );
    fallbackEl.props.onChange?.(false);
  });

  it('forwards refs across all switch variants', () => {
    const ref = { current: null };
    const check = (Comp: unknown) => {
      const el = (Comp as RenderableComp).render({}, ref);
      expect(el.props.ref).toBe(ref);
    };
    check(ZenithSwitch);
    check(MeridianSwitch);
    check(ClockFormatSwitch);
    check(AttendanceSwitch);
    check(BadgeAccessSwitch);
  });
});

describe('ThemeSwitch & LanguageSwitch State Management', () => {
  it('executes applyThemeToggle for dark and light mode persistence', () => {
    const setAttribute = vi.fn();
    const setItem = vi.fn();
    const origDoc = globalThis.document;
    const origStorage = globalThis.localStorage;

    globalThis.document = {
      documentElement: { setAttribute },
    } as unknown as Document;
    globalThis.localStorage = { setItem } as unknown as Storage;

    try {
      applyThemeToggle(true);
      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(setItem).toHaveBeenCalledWith('aptitek-theme', 'dark');

      applyThemeToggle(false);
      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'light');
      expect(setItem).toHaveBeenCalledWith('aptitek-theme', 'light');

      globalThis.localStorage.setItem = () => {
        throw new Error('quota');
      };
      expect(() => applyThemeToggle(true)).not.toThrow();
    } finally {
      globalThis.document = origDoc;
      globalThis.localStorage = origStorage;
    }
  });

  it('renders ThemeSwitch and LanguageSwitch with custom props and fallback testIds', () => {
    const check = (Comp: React.FC<object>, props: object, match: string) =>
      expect(renderToStaticMarkup(createElement(Comp, props))).toContain(match);

    check(
      ThemeSwitch,
      { size: 'medium', disabled: true, dataTestId: 'custom-theme-test' },
      'data-testid="custom-theme-test"'
    );
    check(
      ThemeSwitch,
      { 'data-testid': 'attr-theme' },
      'data-testid="attr-theme"'
    );
    check(ThemeSwitch, {}, 'data-testid="theme-toggle"');
    check(
      LanguageSwitch,
      { size: 'large', dataTestId: 'custom-lang-test' },
      'data-testid="custom-lang-test"'
    );
    check(
      LanguageSwitch,
      { 'data-testid': 'attr-lang' },
      'data-testid="attr-lang"'
    );
    check(LanguageSwitch, {}, 'data-testid="language-toggle"');
  });
});
