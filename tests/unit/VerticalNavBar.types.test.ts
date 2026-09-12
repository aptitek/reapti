import { describe, it, expect } from 'vitest';
import type {
  NavBarMode,
  VerticalNavBarItemConfig,
  VerticalNavBarProps,
} from '../../src/components/molecules/VerticalNavBar/VerticalNavBar.types.ts';

describe('VerticalNavBar Types Coverage', () => {
  it('validates supported NavBarMode values', () => {
    const compactMode: NavBarMode = 'compact';
    const expandedMode: NavBarMode = 'expanded';
    const autoMode: NavBarMode = 'auto';

    expect(compactMode).toBe('compact');
    expect(expandedMode).toBe('expanded');
    expect(autoMode).toBe('auto');
  });

  it('validates VerticalNavBarItemConfig structure', () => {
    const item: VerticalNavBarItemConfig = {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      selectedIcon: 'dashboard_customize',
      badge: 4,
      disabled: false,
      href: '/dashboard',
      target: '_blank',
    };

    expect(item.id).toBe('dashboard');
    expect(item.label).toBe('Dashboard');
    expect(item.badge).toBe(4);
    expect(item.disabled).toBe(false);
  });

  it('validates VerticalNavBarProps structure', () => {
    const props: VerticalNavBarProps = {
      mode: 'compact',
      isExpanded: false,
      defaultIndex: 1,
      selectedIndex: 0,
      selectedId: 'dashboard',
      ariaLabel: 'Primary Navigation',
      className: 'custom-nav',
      dataTestId: 'test-nav',
    };

    expect(props.mode).toBe('compact');
    expect(props.ariaLabel).toBe('Primary Navigation');
    expect(props.className).toBe('custom-nav');
    expect(props.dataTestId).toBe('test-nav');
  });
});
