import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BadgeAccessSwitch } from '../../src/components/molecules/FancySwitch/FancySwitch.tsx';

describe('BadgeAccessSwitch Component Suite', () => {
  it('renders locked mode with closed padlock and open door ghost by default', () => {
    const html = renderToStaticMarkup(
      createElement(BadgeAccessSwitch, {
        status: 'locked',
        dataTestId: 'badge-locked',
      })
    );

    expect(html).toContain('lock-closed-glyph');
    expect(html).toContain('meeting-room-open-icon');
    expect(html).toContain('peeking-badge');
    expect(html).toContain('data-checked="false"');
  });

  it('renders unlocked mode with open padlock and closed door ghost', () => {
    const html = renderToStaticMarkup(
      createElement(BadgeAccessSwitch, {
        status: 'unlocked',
        dataTestId: 'badge-unlocked',
      })
    );

    expect(html).toContain('lock-open-glyph');
    expect(html).toContain('door-front-closed-icon');
    expect(html).toContain('peeking-badge');
    expect(html).toContain('data-checked="true"');
  });

  it('handles disabled attribute', () => {
    const html = renderToStaticMarkup(
      createElement(BadgeAccessSwitch, {
        disabled: true,
        dataTestId: 'badge-disabled',
      })
    );
    expect(html).toContain('data-disabled="true"');
  });
});
