import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { M3eNavItem } from '@m3e/react/nav-bar';
import {
  VerticalNavBar,
  NavItemsList,
} from '../../src/components/molecules/VerticalNavBar/VerticalNavBar.tsx';
import type { VerticalNavBarItemConfig } from '../../src/components/molecules/VerticalNavBar/VerticalNavBar.types.ts';

const sampleItems: VerticalNavBarItemConfig[] = [
  { id: 'home', label: 'Home', icon: 'home', selectedIcon: 'home_filled' },
  { id: 'search', label: 'Search' },
  { id: 'alerts', label: 'Alerts', icon: 'notifications', badge: '3' },
];

describe('VerticalNavBar Molecule Rendering', () => {
  it('exports VerticalNavBar component with displayName', () => {
    expect(VerticalNavBar).toBeDefined();
    expect(VerticalNavBar.displayName).toBe('VerticalNavBar');
  });

  it('renders root custom element with expanded default mode and horizontal alignment', () => {
    const html = renderToStaticMarkup(
      createElement(VerticalNavBar, {
        dataTestId: 'my-nav',
        ariaLabel: 'Main Nav',
        items: sampleItems,
      })
    );

    expect(html).toContain('vertical-nav-bar');
    expect(html).toContain('role="navigation"');
    expect(html).toContain('aria-label="Main Nav"');
    expect(html).toContain('data-mode="expanded"');
    expect(html).toContain('vertical-nav-bar_root');
    expect(html).toContain('vertical-nav-bar_expanded');
    expect(html).toContain('data-orientation="horizontal"');
    expect(html).toContain('vertical-nav-bar_entry');
    expect(html).toContain('vertical-nav-bar_label');
    expect(html).not.toContain('vertical-nav-bar_chip');
  });

  it('renders with compact mode and hover chip elements', () => {
    const html = renderToStaticMarkup(
      createElement(VerticalNavBar, {
        dataTestId: 'compact-nav',
        mode: 'compact',
        items: sampleItems,
      })
    );

    expect(html).toContain('data-mode="compact"');
    expect(html).toContain('vertical-nav-bar_compact');
    expect(html).toContain('data-orientation="vertical"');
    expect(html).toContain('data-testid="compact-nav-chip-home"');
    expect(html).toContain('vertical-nav-bar_chip');
    expect(html).toContain('vertical-nav-bar_caption');
  });

  it('renders with custom class in expanded mode', () => {
    const html = renderToStaticMarkup(
      createElement(VerticalNavBar, {
        dataTestId: 'expanded-nav',
        mode: 'expanded',
        className: 'custom-rail',
        items: sampleItems,
      })
    );

    expect(html).toContain('data-mode="expanded"');
    expect(html).toContain('vertical-nav-bar_expanded');
    expect(html).toContain('custom-rail');
  });
});

describe('VerticalNavBar Slots and Children', () => {
  it('renders header, action, and footer slots', () => {
    const html = renderToStaticMarkup(
      createElement(VerticalNavBar, {
        dataTestId: 'slotted-nav',
        header: createElement(Box, { 'data-testid': 'header-content' }),
        action: createElement(Box, { 'data-testid': 'action-content' }),
        footer: createElement(Box, { 'data-testid': 'footer-content' }),
        items: sampleItems,
      })
    );

    expect(html).toContain('data-testid="slotted-nav-header"');
    expect(html).toContain('data-testid="header-content"');
    expect(html).toContain('data-testid="slotted-nav-action"');
    expect(html).toContain('data-testid="slotted-nav-footer"');
  });

  it('renders navigation items and invokes onClick handler', () => {
    const onSelect = vi.fn();
    const rendered = NavItemsList({
      items: sampleItems,
      activeIndex: 0,
      effectiveMode: 'expanded',
      onSelect,
      dataTestId: 'test-nav',
    });
    expect(rendered).not.toBeNull();

    const children = (rendered as ReactElement<{ children: ReactElement[] }>)
      .props.children;
    children[0]?.props.onSelect();
    expect(onSelect).toHaveBeenCalledWith(0, sampleItems[0]);

    expect(
      NavItemsList({
        items: undefined,
        activeIndex: 0,
        effectiveMode: 'expanded',
        onSelect,
        dataTestId: 'test-nav',
      })
    ).toBeNull();
    expect(
      NavItemsList({
        items: [],
        activeIndex: 0,
        effectiveMode: 'expanded',
        onSelect,
        dataTestId: 'test-nav',
      })
    ).toBeNull();
  });

  it('renders compositional children correctly', () => {
    const html = renderToStaticMarkup(
      createElement(
        VerticalNavBar,
        { dataTestId: 'children-nav' },
        createElement(M3eNavItem, { 'data-testid': 'custom-child' })
      )
    );

    expect(html).toContain('data-testid="children-nav"');
    expect(html).toContain('data-testid="custom-child"');
  });
});

describe('VerticalNavBar Compact Selection', () => {
  it('renders navigation items in compact mode and invokes onSelect', () => {
    const onSelect = vi.fn();
    const rendered = NavItemsList({
      items: sampleItems,
      activeIndex: 1,
      effectiveMode: 'compact',
      onSelect,
      dataTestId: 'test-nav-compact',
    });
    expect(rendered).not.toBeNull();

    const children = (rendered as ReactElement<{ children: ReactElement[] }>)
      .props.children;
    children[1]?.props.onSelect();
    expect(onSelect).toHaveBeenCalledWith(1, sampleItems[1]);
  });
});

describe('VerticalNavBar Item Props and Accessibility Branches', () => {
  it('handles customIcon, badge, default testId, and ariaLabel variants', () => {
    const customItems: VerticalNavBarItemConfig[] = [
      {
        id: 'brand',
        label: createElement('span', null, 'Brand Label'),
        ariaLabel: 'Brand Aria',
        customIcon: createElement(Box, { 'data-testid': 'custom-svg-icon' }),
        disabled: true,
        href: '/custom-url',
        target: '_blank',
      },
      {
        id: 'no-icon',
        label: createElement('span', null, 'No Icon Node'),
      },
      {
        id: 'number-badge',
        label: 'Badge Item',
        icon: 'star',
        badge: 42,
      },
    ];

    const html = renderToStaticMarkup(
      createElement(VerticalNavBar, {
        items: customItems,
      })
    );

    expect(html).toContain('aria-label="Brand Aria"');
    expect(html).toContain('data-testid="custom-svg-icon"');
    expect(html).toContain('data-testid="vertical-nav-bar"');
    expect(html).toContain('42');
  });
});
