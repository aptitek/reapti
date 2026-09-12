import { describe, it, expect } from 'vitest';
import {
  resolveBackground,
  resolveHandle,
  resolveActiveState,
  syncSwitchStyles,
} from '../../src/components/atoms/Switch/switchHelpers.ts';
import type { SwitchProps } from '../../src/components/atoms/Switch/Switch.types.ts';

describe('switchHelpers backgrounds', () => {
  it('resolves background using on/off objects and fallback function', () => {
    const onObjProps: SwitchProps = { on: { backgroundSvg: 'bg-on-obj' } };
    expect(resolveBackground(onObjProps, true)).toBe('bg-on-obj');

    const offObjProps: SwitchProps = { off: { backgroundSvg: 'bg-off-obj' } };
    expect(resolveBackground(offObjProps, false)).toBe('bg-off-obj');

    const onProps: SwitchProps = { backgroundSvgOn: 'bg-on-value' };
    expect(resolveBackground(onProps, true)).toBe('bg-on-value');

    const offProps: SwitchProps = { backgroundSvgOff: 'bg-off-value' };
    expect(resolveBackground(offProps, false)).toBe('bg-off-value');

    const fnProps: SwitchProps = {
      backgroundSvg: (checked: boolean) => (checked ? 'day-sky' : 'night-sky'),
    };
    expect(resolveBackground(fnProps, true)).toBe('day-sky');
    expect(resolveBackground(fnProps, false)).toBe('night-sky');

    const staticProps: SwitchProps = { backgroundSvg: 'static-bg' };
    expect(resolveBackground(staticProps, true)).toBe('static-bg');
    expect(resolveBackground(staticProps, false)).toBe('static-bg');
  });
});

describe('switchHelpers handles', () => {
  it('resolves handle icons and transition components', () => {
    const onOffHandleProps: SwitchProps = {
      on: { handleIcon: 'handle-on-obj' },
      off: { handleIcon: 'handle-off-obj' },
    };
    expect(
      resolveHandle(onOffHandleProps, true, {
        isTransitioning: false,
        direction: 'to-on',
      })
    ).toBe('handle-on-obj');
    expect(
      resolveHandle(onOffHandleProps, false, {
        isTransitioning: false,
        direction: 'to-off',
      })
    ).toBe('handle-off-obj');

    const handleProps: SwitchProps = {
      handleIconOn: 'icon-on',
      handleIconOff: 'icon-off',
    };
    expect(
      resolveHandle(handleProps, true, {
        isTransitioning: false,
        direction: 'to-on',
      })
    ).toBe('icon-on');
    expect(
      resolveHandle(handleProps, false, {
        isTransitioning: false,
        direction: 'to-off',
      })
    ).toBe('icon-off');

    const transitionProps: SwitchProps = {
      handleTransitionComponent: (dir) => `transitioning-${dir}`,
    };
    expect(
      resolveHandle(transitionProps, true, {
        isTransitioning: true,
        direction: 'to-on',
      })
    ).toBe('transitioning-to-on');
  });
});

describe('switchHelpers active states', () => {
  it('resolves active state icons and syncs switch styles', () => {
    const stateProps: SwitchProps = {
      on: { ghostIcon: 'sun', peekingIcon: 'plane' },
      off: { ghostIcon: 'moon', peekingIcon: 'hotel' },
    };
    expect(resolveActiveState(stateProps, true)).toEqual({
      ghostIcon: 'sun',
      peekingIcon: 'plane',
    });
    expect(resolveActiveState(stateProps, false)).toEqual({
      ghostIcon: 'moon',
      peekingIcon: 'hotel',
    });

    const element = {
      style: { setProperty: () => {}, removeProperty: () => {} },
    } as unknown as HTMLElement;

    expect(() => {
      syncSwitchStyles(element, { on: { color: 'var(--colors-primary)' } });
    }).not.toThrow();
  });
});
