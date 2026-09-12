import type { ReactNode } from 'react';

export type SegmentedChipVariant = 'outlined' | 'elevated';

export type SegmentedChipSize = 'small' | 'medium' | 'large';

export type SegmentInteraction = 'button' | 'link' | 'none';

export interface SegmentedChipItemConfig {
  id: string;
  label: string;
  icon?: string;
  trailingIcon?: string;
  interaction?: SegmentInteraction;
  onClick?: () => void;
  href?: string;
  target?: string;
  tooltip?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface SegmentedChipProps {
  items?: readonly SegmentedChipItemConfig[];
  variant?: SegmentedChipVariant;
  size?: SegmentedChipSize;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  dataTestId?: string;
  children?: ReactNode;
}

export interface ChipSegmentProps {
  id?: string;
  label?: string;
  icon?: string;
  trailingIcon?: string;
  interaction?: SegmentInteraction;
  onClick?: () => void;
  href?: string;
  target?: string;
  tooltip?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  dataTestId?: string;
  children?: ReactNode;
}
