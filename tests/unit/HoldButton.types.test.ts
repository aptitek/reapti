import { describe, it, expect } from 'vitest';
import type {
  HoldButtonProps,
  HoldButtonVariant,
  HoldButtonSize,
  HoldButtonBorderWidth,
  HoldButtonSpacing,
} from '../../src/components/atoms/HoldButton/HoldButton.types.ts';

describe('HoldButton Type Contract Verification', () => {
  it('supports all valid HoldButtonVariants', () => {
    const variants: HoldButtonVariant[] = [
      'filled',
      'tonal',
      'elevated',
      'outlined',
      'text',
    ];
    expect(variants).toHaveLength(5);
  });

  it('supports all valid HoldButtonSizes', () => {
    const sizes: HoldButtonSize[] = ['small', 'medium', 'large', 'extra-large'];
    expect(sizes).toHaveLength(4);
  });

  it('supports tokenised borderWidth and borderSpacing', () => {
    const widths: HoldButtonBorderWidth[] = [
      'none',
      'thin',
      'medium',
      'thick',
      'heavy',
      3.5,
    ];
    const spacings: HoldButtonSpacing[] = [
      'none',
      'compact',
      'standard',
      'relaxed',
      6,
    ];
    expect(widths).toHaveLength(6);
    expect(spacings).toHaveLength(5);
  });

  it('constructs a valid HoldButtonProps object', () => {
    const props: HoldButtonProps = {
      holdingTime: 1200,
      shape: 'sunny',
      targetShape: 'arch',
      variant: 'filled',
      size: 'medium',
      borderWidth: 'thick',
      borderSpacing: 'standard',
      borderColor: 'var(--colors-primary)',
      retractDuration: 300,
      disabled: false,
      ariaLabel: 'Accessible action',
      dataTestId: 'hold-btn',
    };
    expect(props.holdingTime).toBe(1200);
    expect(props.shape).toBe('sunny');
    expect(props.borderWidth).toBe('thick');
    expect(props.borderSpacing).toBe('standard');
  });
});
