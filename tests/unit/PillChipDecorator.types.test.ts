import { describe, it, expect } from 'vitest';
import type {
  PillChipPlacement,
  PillChipProps,
  PillChipDecoratorProps,
} from '../../src/components/atoms/PillChipDecorator/PillChipDecorator.types.ts';

describe('PillChipDecorator Type Definitions', () => {
  it('validates PillChipPlacement values', () => {
    const endPlacement: PillChipPlacement = 'end';
    const startPlacement: PillChipPlacement = 'start';
    expect(endPlacement).toBe('end');
    expect(startPlacement).toBe('start');
  });

  it('validates PillChipProps and PillChipDecoratorProps structures', () => {
    const chipProps: PillChipProps = {
      label: 'Home',
      badge: 4,
      testId: 'chip-1',
      className: 'my-chip',
      role: 'tooltip',
      ariaHidden: true,
      onClick: () => {},
    };
    expect(chipProps.label).toBe('Home');
    expect(chipProps.badge).toBe(4);

    const decoratorProps: PillChipDecoratorProps = {
      children: null,
      label: 'Notifications',
      badge: 'NEW',
      active: true,
      open: false,
      placement: 'end',
      onChipClick: () => {},
      chipTestId: 'notif-chip',
      dataTestId: 'notif-decorator',
      className: 'decorator-wrap',
      chipClassName: 'chip-inner',
    };
    expect(decoratorProps.label).toBe('Notifications');
    expect(decoratorProps.active).toBe(true);
    expect(decoratorProps.placement).toBe('end');
  });
});
