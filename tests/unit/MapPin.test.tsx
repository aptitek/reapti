import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from '../../src/components/atoms/MapPin/MapPin.tsx';

describe('MapPin Component Unit Tests', () => {
  it('renders pin container with role img and vector paths', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, { ariaLabel: 'Selected Location' })
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Selected Location"');
    expect(html).toContain('map-radar-pulse');
    expect(html).toContain('map-pin-bounce');
  });

  it('renders label badge when label is supplied', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, { label: 'Paris Campus', ariaLabel: 'Campus Pin' })
    );
    expect(html).toContain('data-testid="map-pin-label"');
    expect(html).toContain('Paris Campus');
  });

  it('does not render label badge when label is omitted', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, { ariaLabel: 'Anonymous Pin' })
    );
    expect(html).not.toContain('data-testid="map-pin-label"');
  });
});
