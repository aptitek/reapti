import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapSkeleton } from '../../src/components/atoms/MapSkeleton/MapSkeleton.tsx';

describe('MapSkeleton Component Unit Tests', () => {
  it('renders skeleton root with progressbar role and aria-busy', () => {
    const html = renderToStaticMarkup(
      createElement(MapSkeleton, { testId: 'custom-skeleton' })
    );
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('data-testid="custom-skeleton"');
  });

  it('renders m3e-skeleton elements for cartographic features', () => {
    const html = renderToStaticMarkup(createElement(MapSkeleton));
    expect(html).toContain('m3e-skeleton');
  });
});
