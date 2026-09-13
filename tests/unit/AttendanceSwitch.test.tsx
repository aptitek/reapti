import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AttendanceSwitch } from '../../src/components/molecules/FancySwitch/FancySwitch.tsx';

describe('AttendanceSwitch Component Suite', () => {
  it('renders in-person mode with map pin and school silhouette', () => {
    const html = renderToStaticMarkup(
      createElement(AttendanceSwitch, {
        mode: 'in-person',
        dataTestId: 'attendance-in-person',
      })
    );

    expect(html).toContain('map-pin-glyph');
    expect(html).toContain('holo-school-icon');
    expect(html).toContain('holo-house-icon');
    expect(html).toContain('peeking-pedestrian');
    expect(html).toContain('data-checked="true"');
  });

  it('renders remote mode with laptop glyph', () => {
    const html = renderToStaticMarkup(
      createElement(AttendanceSwitch, {
        mode: 'remote',
        dataTestId: 'attendance-remote',
      })
    );

    expect(html).toContain('remote-laptop-glyph');
    expect(html).toContain('peeking-pedestrian');
    expect(html).toContain('data-checked="false"');
  });

  it('handles disabled attribute', () => {
    const html = renderToStaticMarkup(
      createElement(AttendanceSwitch, {
        disabled: true,
        dataTestId: 'attendance-disabled',
      })
    );
    expect(html).toContain('data-disabled="true"');
  });
});
