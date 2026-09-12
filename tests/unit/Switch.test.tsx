import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Switch } from '../../src/components/atoms/Switch/Switch.tsx';
import { useSwitchInternalState } from '../../src/components/atoms/Switch/useSwitch.ts';

describe('Switch Atom Basic Rendering', () => {
  it('renders native m3e-switch inside scoped wrapper', () => {
    const html = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        ariaLabel: 'System switch',
        dataTestId: 'test-switch',
      })
    );

    expect(html).toContain('switch_root');
    expect(html).toContain('override-switch');
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

describe('Switch Atom Configuration', () => {
  it('passes disabled attribute and icons configuration to wrapper and m3e-switch', () => {
    const html = renderToStaticMarkup(
      createElement(Switch, {
        checked: true,
        disabled: true,
        icons: 'both',
        ariaLabel: 'Disabled switch with icons',
      })
    );

    expect(html).toContain('data-disabled="true"');
    expect(html).toContain('data-icons="both"');
    expect(html).toContain('data-checked="true"');
  });

  it('handles custom className and element id', () => {
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

describe('Switch Internal State Hook', () => {
  it('toggles uncontrolled checked state and fires onChange', () => {
    let hookApi: ReturnType<typeof useSwitchInternalState> | null = null;
    const onChange = vi.fn();

    function Probe() {
      hookApi = useSwitchInternalState(undefined, false, onChange);
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.isChecked).toBe(false);
    hookApi.handleChange({ currentTarget: { checked: true } } as never);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled checked state on change', () => {
    let hookApi: ReturnType<typeof useSwitchInternalState> | null = null;
    const onChange = vi.fn();

    function Probe() {
      hookApi = useSwitchInternalState(true, false, onChange);
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.isChecked).toBe(true);
    hookApi.handleChange({ currentTarget: { checked: false } } as never);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
