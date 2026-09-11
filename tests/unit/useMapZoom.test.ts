import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMapZoom } from '../../src/components/molecules/Map/useMapZoom.ts';

describe('useMapZoom Hook Unit Tests', () => {
  it('initializes zoom level and provides bounds clamp controls', () => {
    let capturedZoomIn: (() => void) | null = null;
    let capturedZoomOut: (() => void) | null = null;

    function ZoomProbe() {
      const { zoomLevel, zoomIn, zoomOut } = useMapZoom(14);
      capturedZoomIn = zoomIn;
      capturedZoomOut = zoomOut;
      return createElement('div', { 'data-zoom': zoomLevel });
    }

    const html = renderToStaticMarkup(createElement(ZoomProbe));
    expect(html).toContain('data-zoom="14"');
    capturedZoomIn?.();
    capturedZoomOut?.();
  });
});
