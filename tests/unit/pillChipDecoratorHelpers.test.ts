import { describe, it, expect } from 'vitest';
import {
  resolvePillChipDecoratorClass,
  resolvePillChipClass,
} from '../../src/components/atoms/PillChipDecorator/pillChipDecoratorHelpers.ts';

describe('PillChipDecorator Helper Class Resolvers', () => {
  it('resolves root decorator classes correctly', () => {
    expect(resolvePillChipDecoratorClass()).toBe(
      'pill-chip_decorator pill-chip_decorator--end'
    );
    expect(resolvePillChipDecoratorClass('custom-cls', 'start', true)).toBe(
      'pill-chip_decorator pill-chip_decorator--start pill-chip_decorator--open custom-cls'
    );
  });

  it('resolves standalone pill chip classes correctly', () => {
    expect(resolvePillChipClass()).toBe('pill-chip_decorator_chip');
    expect(resolvePillChipClass('extra-cls')).toBe(
      'pill-chip_decorator_chip extra-cls'
    );
  });
});
