import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { VerticalAppBar } from '../../src/components/molecules/VerticalAppBar/VerticalAppBar.tsx';
import type { VerticalNavBarItemConfig } from '../../src/components/molecules/VerticalNavBar/VerticalNavBar.types.ts';

const sampleNavItems: VerticalNavBarItemConfig[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'classes', label: 'Classes', icon: 'school' },
  { id: 'space', label: 'Aptispace', icon: 'terminal' },
  { id: 'about', label: 'About', icon: 'person' },
];

describe('VerticalAppBar: Basics and Structural Slots', () => {
  it('exports VerticalAppBar component with displayName', () => {
    expect(VerticalAppBar).toBeDefined();
    expect(VerticalAppBar.displayName).toBe('VerticalAppBar');
  });

  it('renders root custom element with left side and banner role by default', () => {
    const html = renderToStaticMarkup(
      createElement(VerticalAppBar, {
        dataTestId: 'main-appbar',
        ariaLabel: 'Site AppBar',
      })
    );

    expect(html).toContain('vertical-app-bar');
    expect(html).toContain('role="banner"');
    expect(html).toContain('aria-label="Site AppBar"');
    expect(html).toContain('data-side="left"');
    expect(html).toContain('vertical-app-bar_root');
    expect(html).toContain('vertical-app-bar_left');
  });

  it('renders right side docking when specified', () => {
    const html = renderToStaticMarkup(
      createElement(VerticalAppBar, {
        side: 'right',
        dataTestId: 'right-appbar',
      })
    );

    expect(html).toContain('data-side="right"');
    expect(html).toContain('vertical-app-bar_right');
  });

  it('renders header, content, and footer slots', () => {
    const html = renderToStaticMarkup(
      createElement(
        VerticalAppBar,
        {
          dataTestId: 'slotted-appbar',
          header: createElement(Box, null, 'Header Content'),
          footer: createElement(Box, null, 'Footer Content'),
        },
        createElement(Box, null, 'Main Body Content')
      )
    );

    expect(html).toContain('data-testid="slotted-appbar-header"');
    expect(html).toContain('Header Content');
    expect(html).toContain('data-testid="slotted-appbar-content"');
    expect(html).toContain('Main Body Content');
    expect(html).toContain('data-testid="slotted-appbar-footer"');
    expect(html).toContain('Footer Content');
  });
});

describe('VerticalAppBar: State and Dynamic Features', () => {
  it('renders embedded VerticalNavBar when items prop is provided without children', () => {
    const html = renderToStaticMarkup(
      createElement(VerticalAppBar, {
        dataTestId: 'nav-appbar',
        items: sampleNavItems,
        selectedIndex: 1,
      })
    );

    expect(html).toContain('vertical-nav-bar');
    expect(html).toContain('data-testid="nav-appbar-nav"');
  });

  it('reflects elevated state when elevated prop is passed', () => {
    const html = renderToStaticMarkup(
      createElement(VerticalAppBar, {
        elevated: true,
      })
    );

    expect(html).toContain('data-elevated="true"');
    expect(html).toContain('vertical-app-bar_elevated');
  });

  it('renders mode compact by default and allows expanded mode', () => {
    const compactHtml = renderToStaticMarkup(
      createElement(VerticalAppBar, {
        dataTestId: 'compact-appbar',
      })
    );
    expect(compactHtml).toContain('data-mode="compact"');
    expect(compactHtml).toContain('vertical-app-bar_compact');

    const expandedHtml = renderToStaticMarkup(
      createElement(VerticalAppBar, {
        mode: 'expanded',
        dataTestId: 'expanded-appbar',
      })
    );
    expect(expandedHtml).toContain('data-mode="expanded"');
    expect(expandedHtml).toContain('vertical-app-bar_expanded');
  });
});
