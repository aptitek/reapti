import type { ReactNode, PointerEvent, KeyboardEvent } from 'react';
import type { M3eButtonElement } from '@m3e/web/button';
import type { ShapeName } from '@m3e/web/shape';

export type { M3eButtonElement };

export type HoldButtonVariant =
  'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';

export type HoldButtonSize = 'small' | 'medium' | 'large' | 'extra-large';

export type HoldButtonBorderWidth =
  'none' | 'thin' | 'medium' | 'thick' | 'heavy' | number;

export type HoldButtonSpacing =
  'none' | 'compact' | 'standard' | 'relaxed' | number;

export interface HoldButtonProps {
  /** Holding duration in milliseconds required to trigger the action. Default: 1000 */
  holdingTime?: number;
  /** Shape name from expressive shape catalog, or 'rounded' | 'square' */
  shape?: ShapeName | 'rounded' | 'square' | string;
  /** Target shape for interactive morph transitions */
  targetShape?: ShapeName | string;
  /** Button visual variant from Material Design 3 */
  variant?: HoldButtonVariant;
  /** Button density size preset */
  size?: HoldButtonSize;
  /** Callback fired upon sustained holding completion */
  onHoldComplete?: () => void;
  /** Alias callback fired upon sustained holding completion */
  onHold?: () => void;
  /** Callback fired when released too briefly before hold completion */
  onBriefPress?: () => void;
  /** Width of the animated border outline in pixels or token. Default: 'thick' (3px) */
  borderWidth?: HoldButtonBorderWidth;
  /** Spacing between the button shape and animated border outline. Default: 'standard' (4px) */
  borderSpacing?: HoldButtonSpacing;
  /** Border stroke color override */
  borderColor?: string;
  /** Retraction duration in milliseconds when released. Default: 350 */
  retractDuration?: number;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is disabled but interactive */
  disabledInteractive?: boolean;
  /** Button content */
  children?: ReactNode;
  /** Optional icon slot before the button label */
  icon?: ReactNode;
  /** Optional trailing icon slot after the button label */
  trailingIcon?: ReactNode;
  /** Form submission type */
  type?: 'button' | 'submit' | 'reset';
  /** Form field identifier */
  name?: string;
  /** Form field value */
  value?: string;
  /** Unique element id */
  id?: string;
  /** Accessible label for assistive technologies */
  ariaLabel?: string;
  /** Additional CSS class names */
  className?: string;
  /** Test identifier */
  dataTestId?: string;
  /** Standard click handler - invoked only when holding completes */
  onClick?: (e?: Event) => void;
  /** Pointer down callback */
  onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
  /** Pointer up callback */
  onPointerUp?: (e: PointerEvent<HTMLElement>) => void;
  /** Pointer leave callback */
  onPointerLeave?: (e: PointerEvent<HTMLElement>) => void;
  /** Pointer cancel callback */
  onPointerCancel?: (e: PointerEvent<HTMLElement>) => void;
  /** Key down callback */
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
  /** Key up callback */
  onKeyUp?: (e: KeyboardEvent<HTMLElement>) => void;
}
