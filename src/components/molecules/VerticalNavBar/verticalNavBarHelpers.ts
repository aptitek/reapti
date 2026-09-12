import type {
  NavBarMode,
  VerticalNavBarItemConfig,
} from './VerticalNavBar.types.ts';

export function resolveEffectiveMode(
  mode?: NavBarMode,
  isExpanded?: boolean
): 'compact' | 'expanded' {
  if (isExpanded !== undefined) {
    return isExpanded ? 'expanded' : 'compact';
  }
  if (mode !== undefined) {
    return mode === 'compact' ? 'compact' : 'expanded';
  }
  return 'expanded';
}

export function getNextIndex(
  currentIndex: number,
  total: number,
  direction: 'next' | 'prev'
): number {
  if (total <= 0) return 0;
  if (direction === 'next') {
    return (currentIndex + 1) % total;
  }
  return (currentIndex - 1 + total) % total;
}

export function resolveRootClassName(
  customClassName?: string,
  mode: 'compact' | 'expanded' = 'expanded'
): string {
  const base = `vertical-nav-bar_root override-vertical-nav-bar vertical-nav-bar_${mode}`;
  return customClassName ? `${base} ${customClassName}` : base;
}

export function findItemById(
  items: readonly VerticalNavBarItemConfig[] | undefined,
  id: string
): VerticalNavBarItemConfig | undefined {
  if (!items) return undefined;
  return items.find((item) => item.id === id);
}

export function resolveAriaProps(ariaLabel?: string): Record<string, string> {
  const props: Record<string, string> = {
    role: 'navigation',
  };
  if (ariaLabel) {
    props['aria-label'] = ariaLabel;
  }
  return props;
}

export function resolveItemIcon(
  item: VerticalNavBarItemConfig,
  isSelected: boolean
): string | undefined {
  if (isSelected && item.selectedIcon) {
    return item.selectedIcon;
  }
  return item.icon;
}

export function resolveActiveIndex(
  props: {
    selectedIndex?: number;
    selectedId?: string;
    items?: readonly VerticalNavBarItemConfig[];
  },
  fallbackIndex = 0
): number {
  if (props.selectedIndex !== undefined) {
    return props.selectedIndex;
  }
  if (props.selectedId !== undefined && props.items) {
    const foundIndex = props.items.findIndex(
      (item) => item.id === props.selectedId
    );
    if (foundIndex !== -1) return foundIndex;
  }
  return fallbackIndex;
}
