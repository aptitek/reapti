import type { ReactNode, FocusEvent } from 'react';

export type EmailFieldVariant = 'outlined' | 'filled';
export type EmailFieldSize = 'small' | 'medium';

export interface EmailFieldLabels {
  clearPrefix?: string;
  fixedDomain?: string;
  usernamePlaceholder?: string;
}

export interface EmailFieldProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  domain?: string;
  onEmailChange?: (fullEmail: string, localPart: string) => void;
  onChange?: (fullEmail: string) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  placeholder?: string;
  helperText?: ReactNode;
  supportingText?: string;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: EmailFieldVariant;
  size?: EmailFieldSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode | null;
  showClearButton?: boolean;
  showDomainLock?: boolean;
  clearAriaLabel?: string;
  domainAriaLabel?: string;
  className?: string;
  testId?: string;
  dataTestId?: string;
  'data-testid'?: string;
}

export interface EmailFieldMetrics {
  iconSize: number;
  clearBtnSize: number;
  lockIconSize: number;
}
