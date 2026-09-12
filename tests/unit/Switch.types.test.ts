import { describe, it, expect } from 'vitest';
import type {
  SwitchProps,
  SwitchStateConfig,
  SwitchSize,
  SwitchRotation,
  SwitchSymmetry,
  SwitchTransitionDirection,
} from '../../src/components/atoms/Switch/Switch.types.ts';

describe('Switch Types Coverage', () => {
  it('validates structural conformance of switch props and types', () => {
    const rot: SwitchRotation = { on: 180, off: 0 };
    const sym: SwitchSymmetry = { on: true, off: false };
    const dir: SwitchTransitionDirection = 'to-on';

    const onCfg: SwitchStateConfig = {
      ghostIcon: '☀️',
      color: '#006874',
      trackColor: '#006874',
      handleColor: '#ffffff',
      peekingIcon: '✈️',
      peekingRotation: 180,
      peekingSymmetry: true,
      handleIcon: 'ON',
      backgroundSvg: '<svg class="day"></svg>',
    };

    const offCfg: SwitchStateConfig = {
      ghostIcon: '🌙',
      color: '#dbe4e6',
      trackColor: '#dbe4e6',
      handleColor: '#3f484a',
      peekingIcon: '🏨',
      peekingRotation: 0,
      peekingSymmetry: false,
      handleIcon: 'OFF',
      backgroundSvg: '<svg class="night"></svg>',
    };

    const props: SwitchProps = {
      checked: true,
      size: 'medium' as SwitchSize,
      disabled: false,
      ariaLabel: 'Accessible switch',
      on: onCfg,
      off: offCfg,
      ghostIconOn: '☀️',
      ghostIconOff: '🌙',
      peekingRotation: rot,
      peekingSymmetry: sym,
      backgroundSvg: '<svg></svg>',
      handleTransitionComponent: (d) => `moving-${d}`,
      transitionDuration: 350,
    };

    expect(props.checked).toBe(true);
    expect(props.on?.ghostIcon).toBe('☀️');
    expect(props.off?.ghostIcon).toBe('🌙');
    expect(props.ghostIconOn).toBe('☀️');
    expect(props.peekingRotation).toBe(rot);
    expect(props.peekingSymmetry).toBe(sym);
    expect(dir).toBe('to-on');
    expect(props.transitionDuration).toBe(350);
  });
});
