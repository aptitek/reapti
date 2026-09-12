import type { M3eSwitchElement, SwitchIcons } from '@m3e/web/switch';

export type SwitchSize = 'small' | 'medium' | 'large';
export type { M3eSwitchElement };

export interface SwitchProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Callback fired when checked state toggles */
  onChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Density size preset ('small' | 'medium' | 'large') */
  size?: SwitchSize;
  /** Native icon presentation ('none' | 'selected' | 'both') */
  icons?: SwitchIcons;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Form submission identifier */
  name?: string;
  /** Value string when selected */
  value?: string;
  /** Unique element id */
  id?: string;
  /** Additional CSS class names */
  className?: string;
  /** Test identifier */
  dataTestId?: string;
}
