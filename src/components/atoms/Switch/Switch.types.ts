import type { ReactNode } from 'react';
import type { M3eSwitchElement, SwitchIcons } from '@m3e/web/switch';

export type SwitchSize = 'small' | 'medium' | 'large';
export type { M3eSwitchElement };

export type SwitchRotation = number | { on?: number; off?: number };
export type SwitchSymmetry =
  boolean | 'horizontal' | 'vertical' | { on?: boolean; off?: boolean };

export type SwitchTransitionDirection = 'to-on' | 'to-off';

export interface SwitchStateConfig {
  /** Ghost icon or arbitrary glyph displayed on opposite side */
  ghostIcon?: ReactNode;
  /** Custom ghost icon/glyph color */
  ghostColor?: string;
  /** Primary accent/track color */
  color?: string;
  /** Custom track color override */
  trackColor?: string;
  /** Custom handle color */
  handleColor?: string;
  /** Icon peeking from under handle on hover */
  peekingIcon?: ReactNode;
  /** Custom peeking icon color */
  peekingColor?: string;
  /** Rotation angle in degrees for peeking icon in this state */
  peekingRotation?: number;
  /** Mirroring/symmetry flip for peeking icon in this state */
  peekingSymmetry?: boolean | 'horizontal' | 'vertical';
  /** Resting content/icon on handle */
  handleIcon?: ReactNode;
  /** Background SVG override for this state */
  backgroundSvg?: ReactNode;
}

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

  /** State-specific configurations for the 'on' (checked) state */
  on?: SwitchStateConfig;
  /** State-specific configurations for the 'off' (unchecked) state */
  off?: SwitchStateConfig;

  /** Ghost icon or arbitrary glyph displayed on the opposite side when checked (on the left) */
  ghostIconOn?: ReactNode;
  /** Ghost icon or arbitrary glyph displayed on the opposite side when unchecked (on the right) */
  ghostIconOff?: ReactNode;
  /** Custom ghost icon/glyph color when checked */
  ghostColorOn?: string;
  /** Custom ghost icon/glyph color when unchecked */
  ghostColorOff?: string;

  /** Primary accent/track color when checked */
  colorOn?: string;
  /** Primary accent/track color when unchecked */
  colorOff?: string;
  /** Custom track color override when checked */
  trackColorOn?: string;
  /** Custom track color override when unchecked */
  trackColorOff?: string;
  /** Custom handle color when checked */
  handleColorOn?: string;
  /** Custom handle color when unchecked */
  handleColorOff?: string;

  /** Icon peeking from under handle on hover when checked */
  peekingIconOn?: ReactNode;
  /** Icon peeking from under handle on hover when unchecked */
  peekingIconOff?: ReactNode;
  /** Rotation angle in degrees for peeking icon */
  peekingRotation?: SwitchRotation;
  /** Mirroring/symmetry flip for peeking icon */
  peekingSymmetry?: SwitchSymmetry;
  /** Custom translation offset distance when peeking (default: 6px-10px) */
  peekingOffset?: string | number;
  /** Custom peeking icon color when checked */
  peekingColorOn?: string;
  /** Custom peeking icon color when unchecked */
  peekingColorOff?: string;

  /** Background SVG displayed on top of ghost icons and under peeking icons */
  backgroundSvg?: ReactNode | ((checked: boolean) => ReactNode);
  /** Background SVG override when checked */
  backgroundSvgOn?: ReactNode;
  /** Background SVG override when unchecked */
  backgroundSvgOff?: ReactNode;

  /** Resting content/icon on handle when checked */
  handleIconOn?: ReactNode;
  /** Resting content/icon on handle when unchecked */
  handleIconOff?: ReactNode;
  /** Component/icon replacing handle content during toggle transition */
  handleTransitionComponent?:
    ReactNode | ((direction: SwitchTransitionDirection) => ReactNode);
  /** Transition duration in milliseconds (default: 300) */
  transitionDuration?: number;
}
