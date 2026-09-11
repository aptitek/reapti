import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Map } from '../../src/components/molecules/Map/Map.tsx';

describe('Map Molecule Unit Tests', () => {
  it('renders map surface with map pin and coordinates badge', () => {
    const html = renderToStaticMarkup(
      createElement(Map, {
        pinLabel: 'Test Campus',
        testId: 'custom-map',
      })
    );
    expect(html).toContain('data-testid="custom-map"');
    expect(html).toContain('map-pin-container');
    expect(html).toContain('Test Campus');
    expect(html).toContain('48.7118');
  });

  it('renders MapSkeleton when isLoading is true', () => {
    const html = renderToStaticMarkup(
      createElement(Map, {
        isLoading: true,
        testId: 'loading-map',
      })
    );
    expect(html).toContain('data-testid="loading-map"');
    expect(html).toContain('m3e-skeleton');
    expect(html).not.toContain('map-pin-container');
  });

  it('hides pin when showPin is false', () => {
    const html = renderToStaticMarkup(
      createElement(Map, {
        showPin: false,
      })
    );
    expect(html).not.toContain('map-pin-container');
  });

  it('handles zoom controls and non-interactive mode', () => {
    const nonInteractiveHtml = renderToStaticMarkup(
      createElement(Map, { interactive: false, testId: 'static-map' })
    );
    expect(nonInteractiveHtml).not.toContain('Zoom in');

    const interactiveHtml = renderToStaticMarkup(
      createElement(Map, { interactive: true, testId: 'interactive-map' })
    );
    expect(interactiveHtml).toContain('Zoom in');
  });
});
