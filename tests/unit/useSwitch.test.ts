import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSwitchInternalState } from '../../src/components/atoms/Switch/useSwitch.ts';

describe('useSwitch Internal State Hook', () => {
  it('handles uncontrolled state and event toggling', () => {
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

    const mockEvent = {
      currentTarget: { checked: true },
    } as unknown as Event;

    hookApi.handleChange(mockEvent);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled state and fires onChange', () => {
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

    const mockEvent = {
      currentTarget: { checked: false },
    } as unknown as Event;

    hookApi.handleChange(mockEvent);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
