import type { ReactNode } from 'react';
import type { NavBarMode } from '@m3e/web/nav-bar';
import type { VerticalNavBarElement } from './VerticalNavBarElement.ts';

export type { NavBarMode, VerticalNavBarElement };

export interface VerticalNavBarItemConfig {
  /** Unique identifier for the navigation item */
  id: string;
  /** Primary label text */
  label: string;
  /** Material 3 icon name */
  icon?: string;
  /** Material 3 icon name when selected */
  selectedIcon?: string;
  /** Optional badge text or count */
  badge?: string | number;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Optional hyperlink destination */
  href?: string;
  /** Hyperlink target */
  target?: string;
}

export interface VerticalNavBarProps {
  /**
   * Mode for presentation: 'compact' (slim column) or 'expanded' (wide rail).
   * @default 'expanded'
   */
  mode?: NavBarMode;
  /**
   * Controlled expanded boolean convenience flag.
   */
  isExpanded?: boolean;
  /**
   * Callback fired when mode or expansion state changes.
   */
  onModeChange?: (mode: 'compact' | 'expanded') => void;
  /**
   * Header slot content (e.g. logo or menu button).
   */
  header?: ReactNode;
  /**
   * Action slot content (e.g. FAB or quick action button).
   */
  action?: ReactNode;
  /**
   * Footer slot content (e.g. user profile or settings).
   */
  footer?: ReactNode;
  /**
   * Declarative array of navigation items.
   */
  items?: readonly VerticalNavBarItemConfig[];
  /**
   * Initial selected index for uncontrolled usage.
   * @default 0
   */
  defaultIndex?: number;
  /**
   * Index of the currently selected item.
   */
  selectedIndex?: number;
  /**
   * ID of the currently selected item.
   */
  selectedId?: string;
  /**
   * Callback fired when an item is selected.
   */
  onSelect?: (index: number, item?: VerticalNavBarItemConfig) => void;
  /**
   * Accessible label for the navigation element.
   */
  ariaLabel?: string;
  /**
   * Custom CSS class name for the wrapper.
   */
  className?: string;
  /**
   * Test identifier for testing queries.
   */
  dataTestId?: string;
  /**
   * Compositional children (e.g. `<M3eNavItem>` elements).
   */
  children?: ReactNode;
}
