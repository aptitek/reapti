import type { CSSProperties, ReactNode } from 'react';
import type {
  NavBarMode,
  VerticalNavBarItemConfig,
} from '../VerticalNavBar/VerticalNavBar.types.ts';
import type { VerticalAppBarElement } from './VerticalAppBarElement.ts';

export type VerticalAppBarSide = 'left' | 'right';

export type { VerticalAppBarElement };

export interface VerticalAppBarProps {
  /**
   * Docking side for the vertical app bar.
   * @default 'left'
   */
  side?: VerticalAppBarSide;

  /**
   * The identifier of the scroll container to which this element is attached.
   * When scrolled, the app bar automatically transitions to an elevated state.
   */
  for?: string;

  /**
   * Content positioned at the top of the vertical app bar (e.g. brand avatar, logo).
   */
  header?: ReactNode;

  /**
   * Content positioned at the bottom of the vertical app bar (e.g. social links, switches).
   */
  footer?: ReactNode;

  /**
   * Custom main content (typically a VerticalNavBar or custom nav destinations).
   */
  children?: ReactNode;

  /**
   * Optional navigation items config. If provided and children is not given,
   * a VerticalNavBar is automatically rendered within the app bar.
   */
  items?: readonly VerticalNavBarItemConfig[];

  /**
   * Active navigation item index when items config is used.
   */
  selectedIndex?: number;

  /**
   * Selection callback when items config is used.
   */
  onSelect?: (index: number, item?: VerticalNavBarItemConfig) => void;

  /**
   * Navigation mode (compact rail vs expanded navigation bar).
   */
  mode?: NavBarMode;

  /**
   * Whether to force the elevated / scrolled state.
   */
  elevated?: boolean;

  /**
   * Additional CSS classes.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: CSSProperties;

  /**
   * Test identifier.
   * @default 'vertical-app-bar'
   */
  dataTestId?: string;

  /**
   * Accessible landmark label.
   * @default 'Application bar'
   */
  ariaLabel?: string;
}
