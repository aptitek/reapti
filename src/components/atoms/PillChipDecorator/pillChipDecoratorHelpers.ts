import type { PillChipPlacement } from './PillChipDecorator.types.ts';

export function resolvePillChipDecoratorClass(
  className?: string,
  placement: PillChipPlacement = 'end',
  open?: boolean
): string {
  const parts = ['pill-chip_decorator', `pill-chip_decorator--${placement}`];
  if (open) {
    parts.push('pill-chip_decorator--open');
  }
  if (className) {
    parts.push(className);
  }
  return parts.join(' ');
}

export function resolvePillChipClass(className?: string): string {
  const parts = ['pill-chip_decorator_chip'];
  if (className) {
    parts.push(className);
  }
  return parts.join(' ');
}
