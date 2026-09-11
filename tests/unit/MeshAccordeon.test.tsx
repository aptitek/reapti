import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import * as rendererModule from '../../src/components/atoms/MeshAccordeon/meshAccordeonRenderer.ts';
import { MeshAccordeon } from '../../src/components/atoms/MeshAccordeon/MeshAccordeon.tsx';

describe('MeshAccordeon Fallback Modes', () => {
  it('renders fallback component when forceFallback is true', () => {
    const html = renderToStaticMarkup(
      createElement(
        MeshAccordeon,
        {
          forceFallback: true,
          folds: 2,
          defaultFolded: true,
          ariaLabel: 'Fallback Map',
        },
        createElement(Box, { 'data-testid': 'map-view' }, 'Live Map View')
      )
    );

    expect(html).toContain('mesh_accordeon_fallback');
    expect(html).toContain('accordeon_root');
    expect(html).toContain('Live Map View');
    expect(html).toContain('data-folded="true"');
  });

  it('renders fallback when WebGL is not supported in test environment', () => {
    const html = renderToStaticMarkup(
      createElement(
        MeshAccordeon,
        {
          folds: 2,
          ariaLabel: 'Mesh View',
        },
        createElement(Box, null, 'Fallback Child')
      )
    );

    expect(html).toContain('Fallback Child');
  });
});

describe('MeshAccordeon WebGL Render States', () => {
  it('renders WebGL canvas structure when WebGL is supported', () => {
    const spy = vi
      .spyOn(rendererModule, 'isWebGLSupported')
      .mockReturnValue(true);

    try {
      const html = renderToStaticMarkup(
        createElement(
          MeshAccordeon,
          {
            folds: 2,
            isFolded: false,
            ariaLabel: '3D WebGL Canvas Accordion',
          },
          createElement(Box, null, 'Child View')
        )
      );

      expect(html).toContain('mesh_accordeon_root');
      expect(html).toContain('mesh_accordeon_canvas_wrap');
      expect(html).toContain('mesh_accordeon_canvas');
      expect(html).toContain('mesh_accordeon_elevation');
      expect(html).toContain('aria-expanded="true"');
      expect(html).toContain('data-folded="false"');

      // Test folded state
      const foldedHtml = renderToStaticMarkup(
        createElement(MeshAccordeon, {
          folds: 2,
          isFolded: true,
        })
      );
      expect(foldedHtml).toContain('data-folded="true"');
      expect(foldedHtml).toContain('aria-expanded="false"');
    } finally {
      spy.mockRestore();
    }
  });
});
