import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { Accordeon } from '../../src/components/atoms/Accordeon/Accordeon.tsx';

describe('Accordeon Single Instance Guarantee', () => {
  it('renders single instance of child without duplicating the view', () => {
    let mountCount = 0;
    function SingleInstanceView() {
      mountCount += 1;
      return <Box data-testid="unique-child-instance">Single Map Instance</Box>;
    }

    const html = renderToStaticMarkup(
      createElement(
        Accordeon,
        { folds: 2, ariaLabel: 'Interactive Folded Map' },
        createElement(SingleInstanceView)
      )
    );

    expect(mountCount).toBe(1);
    expect(html).toContain('data-testid="unique-child-instance"');
    const matches = html.match(/Single Map Instance/g);
    expect(matches).toHaveLength(1);
  });
});

describe('Accordeon Component Render States', () => {
  it('renders default unfolded state with correct ARIA attributes', () => {
    const html = renderToStaticMarkup(
      createElement(Accordeon, {
        ariaLabel: 'Test Map',
        children: createElement(Box, null, 'Child'),
      })
    );

    expect(html).toContain('data-folded="false"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-label="Test Map"');
    expect(html).toContain('role="button"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('accordeon_root');
    expect(html).toContain('accordeon_viewport');
    expect(html).toContain('accordeon_content');
    expect(html).toContain('accordeon_creases');
    expect(html).toContain('accordeon_elevation');
  });

  it('renders folded state with custom folds and attributes', () => {
    const html = renderToStaticMarkup(
      createElement(
        Accordeon,
        {
          defaultFolded: true,
          folds: 1,
          maxAngle: 30,
          perspective: 1500,
        },
        createElement(Box, null, 'Child')
      )
    );

    expect(html).toContain('data-folded="true"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('data-panel-index="0"');
    expect(html).toContain('data-panel-index="1"');
    expect(html).not.toContain('data-panel-index="2"');
    expect(html).toContain('accordeon_elevation_panel');
  });

  it('renders controlled folded state when isFolded is provided', () => {
    const html = renderToStaticMarkup(
      createElement(
        Accordeon,
        { isFolded: true },
        createElement(Box, null, 'Child')
      )
    );

    expect(html).toContain('data-folded="true"');
    expect(html).toContain('aria-expanded="false"');
  });
});
