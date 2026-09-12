import type {
  SegmentedChipVariant,
  SegmentedChipSize,
  SegmentInteraction,
} from './SegmentedChip.types.ts';

export function resolveSegmentInteraction(
  interaction?: SegmentInteraction,
  href?: string,
  onClick?: () => void
): SegmentInteraction {
  if (interaction) {
    return interaction;
  }
  if (href) {
    return 'link';
  }
  if (onClick) {
    return 'button';
  }
  return 'none';
}

export function resolveSegmentedChipRootClass(
  className?: string,
  variant: SegmentedChipVariant = 'outlined',
  size: SegmentedChipSize = 'medium'
): string {
  const parts = [
    'segmented-chip-root',
    `segmented-chip-root--${variant}`,
    `segmented-chip-root--${size}`,
  ];
  if (className) {
    parts.push(className);
  }
  return parts.join(' ');
}

export function resolveSegmentItemClass(
  className?: string,
  interaction: SegmentInteraction = 'none',
  disabled = false
): string {
  const parts = ['segmented-chip__segment'];
  if (interaction !== 'none') {
    parts.push('segmented-chip__segment--interactive');
    parts.push(`segmented-chip__segment--${interaction}`);
  }
  if (disabled) {
    parts.push('segmented-chip__segment--disabled');
  }
  if (className) {
    parts.push(className);
  }
  return parts.join(' ');
}

export function resolveAriaProps(ariaLabel?: string): {
  role: string;
  'aria-label'?: string;
} {
  const props: { role: string; 'aria-label'?: string } = {
    role: 'group',
  };
  if (ariaLabel) {
    props['aria-label'] = ariaLabel;
  }
  return props;
}

export interface SegmentAriaInput {
  label: string;
  ariaLabel?: string;
  disabled?: boolean;
  interaction?: SegmentInteraction;
}

export function resolveSegmentAria(input: SegmentAriaInput): {
  role?: string;
  'aria-label': string;
  'aria-disabled'?: 'true';
} {
  const effectiveLabel = input.ariaLabel ?? input.label;
  const result: {
    role?: string;
    'aria-label': string;
    'aria-disabled'?: 'true';
  } = {
    'aria-label': effectiveLabel,
  };
  if (input.interaction && input.interaction !== 'none') {
    result.role = input.interaction;
  }
  if (input.disabled) {
    result['aria-disabled'] = 'true';
  }
  return result;
}
