import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { Switch } from '../../src/components/atoms/Switch/Switch.tsx';
import {
  resolveHandle,
  resolveBackground,
  syncSwitchStyles,
} from '../../src/components/atoms/Switch/switchHelpers.ts';

describe('Switch Atom Basic Rendering', () => {
  it('renders native m3e-switch inside scoped wrapper with track frame', () => {
    const html = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        ariaLabel: 'System switch',
        dataTestId: 'test-switch',
      })
    );

    expect(html).toContain('switch_root');
    expect(html).toContain('override-switch');
    expect(html).toContain('switch_track_frame');
    expect(html).toContain('m3e-switch');
    expect(html).toContain('data-size="medium"');
    expect(html).toContain('data-testid="test-switch"');
  });

  it('renders different size presets (small, large)', () => {
    const smallHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        size: 'small',
        ariaLabel: 'Small switch',
      })
    );
    expect(smallHtml).toContain('data-size="small"');

    const largeHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        size: 'large',
        ariaLabel: 'Large switch',
      })
    );
    expect(largeHtml).toContain('data-size="large"');
  });
});

describe('Switch Ghost Icons', () => {
  it('renders ghost icons on opposite side when checked vs unchecked', () => {
    const checkedHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        ghostIconOn: createElement(Box, { 'data-testid': 'ghost-sun' }),
        ghostIconOff: createElement(Box, { 'data-testid': 'ghost-moon' }),
      })
    );
    expect(checkedHtml).toContain('ghost-sun');
    expect(checkedHtml).not.toContain('ghost-moon');

    const uncheckedHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        ghostIconOn: createElement(Box, { 'data-testid': 'ghost-sun' }),
        ghostIconOff: createElement(Box, { 'data-testid': 'ghost-moon' }),
      })
    );
    expect(uncheckedHtml).toContain('ghost-moon');
    expect(uncheckedHtml).not.toContain('ghost-sun');
  });

  it('renders arbitrary glyph strings as ghost icons via on/off objects', () => {
    const checkedHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        on: { ghostIcon: 'PM' },
        off: { ghostIcon: 'AM' },
      })
    );
    expect(checkedHtml).toContain('PM');
    expect(checkedHtml).not.toContain('AM');

    const uncheckedHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        ghostIconOn: 'PM',
        ghostIconOff: 'AM',
      })
    );
    expect(uncheckedHtml).toContain('AM');
    expect(uncheckedHtml).not.toContain('PM');
  });
});

describe('Switch Peeking Features', () => {
  it('renders peeking icons for each state via on/off objects and flat props', () => {
    const checkedHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        on: {
          peekingIcon: createElement(Box, { 'data-testid': 'peeking-plane' }),
        },
        off: {
          peekingIcon: createElement(Box, { 'data-testid': 'peeking-train' }),
        },
      })
    );
    expect(checkedHtml).toContain('peeking-plane');
    expect(checkedHtml).not.toContain('peeking-train');

    const uncheckedHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        peekingIconOn: createElement(Box, { 'data-testid': 'peeking-plane' }),
        peekingIconOff: createElement(Box, { 'data-testid': 'peeking-train' }),
      })
    );
    expect(uncheckedHtml).toContain('peeking-train');
    expect(uncheckedHtml).not.toContain('peeking-plane');
  });
});

describe('Switch Layered Background SVG', () => {
  it('renders static, function, and state-specific background SVGs', () => {
    const staticHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        backgroundSvg: createElement(Box, { 'data-testid': 'bg-svg' }),
      })
    );
    expect(staticHtml).toContain('bg-svg');

    const fnHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        backgroundSvg: (c) =>
          createElement(Box, { 'data-testid': c ? 'bg-day' : 'bg-night' }),
      })
    );
    expect(fnHtml).toContain('bg-night');

    const specificHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        on: { backgroundSvg: createElement(Box, { 'data-testid': 'bg-on' }) },
        off: {
          backgroundSvg: createElement(Box, { 'data-testid': 'bg-off' }),
        },
      })
    );
    expect(specificHtml).toContain('bg-on');

    const offSpecificHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        backgroundSvgOn: createElement(Box, { 'data-testid': 'bg-on' }),
        backgroundSvgOff: createElement(Box, { 'data-testid': 'bg-off' }),
      })
    );
    expect(offSpecificHtml).toContain('bg-off');
  });
});

describe('Switch Handle Content and Transitions', () => {
  it('renders resting handle icons for on and off states', () => {
    const checkedHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        on: { handleIcon: createElement(Box, { 'data-testid': 'handle-on' }) },
        off: {
          handleIcon: createElement(Box, { 'data-testid': 'handle-off' }),
        },
      })
    );
    expect(checkedHtml).toContain('handle-on');

    const uncheckedHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        handleIconOn: createElement(Box, { 'data-testid': 'handle-on' }),
        handleIconOff: createElement(Box, { 'data-testid': 'handle-off' }),
      })
    );
    expect(uncheckedHtml).toContain('handle-off');
  });

  it('resolves handle transition components and directions', () => {
    const fnResult = resolveHandle(
      { handleTransitionComponent: (d) => `active-${d}` },
      false,
      { isTransitioning: true, direction: 'to-on' }
    );
    expect(fnResult).toBe('active-to-on');

    const staticResult = resolveHandle(
      { handleTransitionComponent: 'spinner' },
      false,
      { isTransitioning: true, direction: 'to-off' }
    );
    expect(staticResult).toBe('spinner');

    expect(
      resolveBackground({ backgroundSvg: (c) => (c ? 'day' : 'night') }, true)
    ).toBe('day');
  });
});

describe('Switch Atom Configuration & Style Sync', () => {
  it('synchronizes switch styles and custom class names', () => {
    const el = {
      style: { setProperty: () => {}, removeProperty: () => {} },
    } as unknown as HTMLElement;
    syncSwitchStyles(el, { colorOn: 'var(--colors-primary)' });

    const html = renderToStaticMarkup(
      createElement(Switch, {
        id: 'settings-switch',
        className: 'custom-class',
        ariaLabel: 'Custom styled switch',
      })
    );

    expect(html).toContain('custom-class');
    expect(html).toContain('id="settings-switch"');
  });

  it('exposes Switch component with displayName and defaultChecked', () => {
    expect(Switch.displayName).toBe('Switch');

    const html = renderToStaticMarkup(
      createElement(Switch, {
        defaultChecked: true,
        ariaLabel: 'Uncontrolled checked switch',
      })
    );
    expect(html).toContain('data-checked="true"');
  });
});
