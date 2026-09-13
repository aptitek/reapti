import type { NavBarMode } from '../VerticalNavBar/VerticalNavBar.types.ts';
import type { VerticalAppBarSide } from './VerticalAppBar.types.ts';

export function resolveSide(side?: VerticalAppBarSide): VerticalAppBarSide {
  return side === 'right' ? 'right' : 'left';
}

export function resolveMode(mode?: NavBarMode): NavBarMode {
  return mode === 'expanded' ? 'expanded' : 'compact';
}

export interface AppBarClassNameOptions {
  elevated?: boolean;
  mode?: NavBarMode;
}

export function resolveAppBarClassName(
  className?: string,
  side: VerticalAppBarSide = 'left',
  options: AppBarClassNameOptions = {}
): string {
  const { elevated = false, mode = 'compact' } = options;
  const classes = [
    'vertical-app-bar_root',
    `vertical-app-bar_${side}`,
    `vertical-app-bar_${mode}`,
  ];
  if (elevated) {
    classes.push('vertical-app-bar_elevated');
  }
  if (className) {
    classes.push(className);
  }
  return classes.join(' ');
}

const DEFAULT_APP_BAR_LABEL = 'Application bar';

export function resolveAriaProps(ariaLabel?: string): Record<string, string> {
  return {
    'aria-label': ariaLabel ?? DEFAULT_APP_BAR_LABEL,
    role: 'banner',
  };
}

export function resolveScrollTop(): number {
  if (typeof window === 'undefined') return 0;
  if (window.scrollY > 0) return window.scrollY;
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.scrollTop;
  }
  return 0;
}
