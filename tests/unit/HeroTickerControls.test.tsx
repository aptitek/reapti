import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  HeroTickerControls,
  HeroTickerDot,
} from '../../src/components/molecules/HeroTicker/HeroTickerControls.tsx';

describe('HeroTickerControls Component', () => {
  const phrases = ['Alpha', 'Beta', 'Gamma'];

  it('renders control buttons and tablist markup', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerControls, {
        phrases,
        currentIndex: 0,
        isPaused: false,
        onPrev: vi.fn(),
        onNext: vi.fn(),
        onTogglePause: vi.fn(),
        onSelectIndex: vi.fn(),
        dataTestId: 'controls-test',
      })
    );

    expect(html).toContain('data-testid="controls-test"');
    expect(html).toContain('role="group"');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-selected="false"');
    expect(html).toContain('m3e-icon-button');
    expect(html).toContain('m3e-icon');
    expect(html).toContain('Previous slogan phrase');
    expect(html).toContain('Next slogan phrase');
    expect(html).toContain('Pause ticker animation');
  });
});

describe('HeroTickerControls Paused and Custom Labels', () => {
  const phrases = ['Alpha', 'Beta', 'Gamma'];

  it('renders resume state when paused', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerControls, {
        phrases,
        currentIndex: 1,
        isPaused: true,
        onPrev: vi.fn(),
        onNext: vi.fn(),
        onTogglePause: vi.fn(),
        onSelectIndex: vi.fn(),
      })
    );

    expect(html).toContain('Resume ticker animation');
    expect(html).toContain('m3e-icon');
  });

  it('handles custom labels and data-testid fallback', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerControls, {
        phrases,
        currentIndex: 0,
        isPaused: true,
        onPrev: vi.fn(),
        onNext: vi.fn(),
        onTogglePause: vi.fn(),
        onSelectIndex: vi.fn(),
        previousAriaLabel: 'Custom Prev',
        nextAriaLabel: 'Custom Next',
        resumeAriaLabel: 'Custom Resume',
        controlsBarAriaLabel: 'Custom Bar',
        'data-testid': 'legacy-controls',
      })
    );

    expect(html).toContain('Custom Prev');
    expect(html).toContain('Custom Next');
    expect(html).toContain('Custom Resume');
    expect(html).toContain('Custom Bar');
    expect(html).toContain('data-testid="legacy-controls"');
  });
});

describe('HeroTickerControls Dot Interaction', () => {
  it('handles HeroTickerDot clicks and keyboard navigation', () => {
    const onSelect = vi.fn();
    const dot = HeroTickerDot({
      phrase: 'Beta',
      idx: 1,
      isCurrent: false,
      onSelect,
    });

    dot.props.onClick();
    expect(onSelect).toHaveBeenCalledWith(1);

    const preventDefault = vi.fn();
    dot.props.onKeyDown({
      key: 'Enter',
      preventDefault,
    } as unknown as React.KeyboardEvent);
    expect(preventDefault).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith(1);

    const preventDefaultSpace = vi.fn();
    dot.props.onKeyDown({
      key: ' ',
      preventDefault: preventDefaultSpace,
    } as unknown as React.KeyboardEvent);
    expect(preventDefaultSpace).toHaveBeenCalled();

    const preventDefaultOther = vi.fn();
    dot.props.onKeyDown({
      key: 'Tab',
      preventDefault: preventDefaultOther,
    } as unknown as React.KeyboardEvent);
    expect(preventDefaultOther).not.toHaveBeenCalled();
  });
});
