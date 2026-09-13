import type { ReactNode } from 'react';

export type PillChipPlacement = 'end' | 'start';

export interface PillChipProps {
  label: string;
  badge?: string | number;
  testId?: string;
  onClick?: () => void;
  className?: string;
  role?: string;
  ariaHidden?: boolean;
}

export interface PillChipDecoratorProps {
  children: ReactNode;
  label: string;
  badge?: string | number;
  active?: boolean;
  open?: boolean;
  placement?: PillChipPlacement;
  onChipClick?: () => void;
  chipTestId?: string;
  dataTestId?: string;
  className?: string;
  chipClassName?: string;
}
