import { describe, it, expect } from 'vitest';
import {
  resolveEffectiveMode,
  getNextIndex,
  resolveRootClassName,
  findItemById,
  resolveAriaProps,
  resolveItemIcon,
  resolveActiveIndex,
} from '../../src/components/molecules/VerticalNavBar/verticalNavBarHelpers.ts';
import type { VerticalNavBarItemConfig } from '../../src/components/molecules/VerticalNavBar/VerticalNavBar.types.ts';

describe('verticalNavBar Mode & Index Helpers', () => {
  it('resolves mode defaulting to expanded', () => {
    expect(resolveEffectiveMode(undefined, undefined)).toBe('expanded');
    expect(resolveEffectiveMode('expanded', undefined)).toBe('expanded');
    expect(resolveEffectiveMode('compact', undefined)).toBe('compact');
  });

  it('honors isExpanded flag over mode', () => {
    expect(resolveEffectiveMode('compact', true)).toBe('expanded');
    expect(resolveEffectiveMode('expanded', false)).toBe('compact');
  });

  it('calculates next index with wrap around', () => {
    expect(getNextIndex(0, 3, 'next')).toBe(1);
    expect(getNextIndex(2, 3, 'next')).toBe(0);
  });

  it('calculates previous index with wrap around', () => {
    expect(getNextIndex(2, 3, 'prev')).toBe(1);
    expect(getNextIndex(0, 3, 'prev')).toBe(2);
    expect(getNextIndex(0, 0, 'prev')).toBe(0);
  });
});

describe('verticalNavBar Class & Aria Helpers', () => {
  const items: VerticalNavBarItemConfig[] = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Search' },
  ];

  it('resolves root class names for compact, expanded, and default', () => {
    expect(resolveRootClassName()).toContain('vertical-nav-bar_expanded');

    const compactCls = resolveRootClassName(undefined, 'compact');
    expect(compactCls).toContain('vertical-nav-bar_compact');

    const expandedCls = resolveRootClassName('custom-cls', 'expanded');
    expect(expandedCls).toContain('vertical-nav-bar_expanded');
    expect(expandedCls).toContain('custom-cls');
  });

  it('finds items by id and handles missing cases', () => {
    expect(findItemById(items, 'search')?.label).toBe('Search');
    expect(findItemById(items, 'missing')).toBeUndefined();
    expect(findItemById(undefined, 'home')).toBeUndefined();
  });

  it('resolves aria props with role and optional label', () => {
    expect(resolveAriaProps().role).toBe('navigation');
    expect(resolveAriaProps('Nav')['aria-label']).toBe('Nav');
  });

  it('resolves item icon taking into account selection state', () => {
    const item: VerticalNavBarItemConfig = {
      id: 'home',
      label: 'Home',
      icon: 'home',
      selectedIcon: 'home_filled',
    };
    expect(resolveItemIcon(item, true)).toBe('home_filled');
    expect(resolveItemIcon(item, false)).toBe('home');
    expect(
      resolveItemIcon({ id: 'plain', label: 'Plain' }, true)
    ).toBeUndefined();
  });
});

describe('verticalNavBar resolveActiveIndex Helper', () => {
  const items: VerticalNavBarItemConfig[] = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Search' },
  ];

  it('prioritizes selectedIndex when defined', () => {
    expect(
      resolveActiveIndex({ selectedIndex: 2, selectedId: 'home', items }, 0)
    ).toBe(2);
    expect(resolveActiveIndex({ selectedIndex: 0 }, 1)).toBe(0);
  });

  it('resolves matching selectedId when selectedIndex is omitted', () => {
    expect(resolveActiveIndex({ selectedId: 'search', items }, 0)).toBe(1);
  });

  it('falls back to fallbackIndex when neither matches', () => {
    expect(resolveActiveIndex({ selectedId: 'unknown', items }, 3)).toBe(3);
    expect(resolveActiveIndex({}, 2)).toBe(2);
  });
});
