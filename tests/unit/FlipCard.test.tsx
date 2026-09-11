import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { FlipCard } from '../../src/components/molecules/FlipCard/FlipCard.tsx';

describe('FlipCard Structure and Face Rendering', () => {
  it('renders front content and backward-compatible class names', () => {
    const html = renderToStaticMarkup(
      createElement(FlipCard, {
        frontContent: createElement(Box, null, 'Front View'),
      })
    );

    expect(html).toContain('Front View');
    expect(html).toContain('flip_card_root');
    expect(html).toContain('physics-card');
    expect(html).toContain('physic-card');
    expect(html).toContain('flip_card_front');
  });

  it('renders back content and ARIA attributes when flippable', () => {
    const html = renderToStaticMarkup(
      createElement(FlipCard, {
        frontContent: createElement(Box, null, 'Front View'),
        backContent: createElement(Box, null, 'Back View'),
        ariaLabel: 'Student Card',
        defaultFlipped: false,
      })
    );

    expect(html).toContain('Back View');
    expect(html).toContain('role="button"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-label="Student Card"');
    expect(html).toContain('data-flipped="false"');
    expect(html).toContain('flip_card_back is-facing-away');
  });

  it('applies is-facing-away to front face when flipped', () => {
    const html = renderToStaticMarkup(
      createElement(FlipCard, {
        frontContent: createElement(Box, null, 'Front View'),
        backContent: createElement(Box, null, 'Back View'),
        isFlipped: true,
      })
    );

    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('data-flipped="true"');
    expect(html).toContain('flip_card_front is-facing-away');
  });
});

describe('FlipCard Visual Layers and Interactivity', () => {
  it('renders sheen and holographic layers when enabled', () => {
    const html = renderToStaticMarkup(
      createElement(FlipCard, {
        frontContent: createElement(Box, null, 'Front View'),
        showHolo: true,
        showSheen: true,
        holoMaskImage: 'dragon.svg',
      })
    );

    expect(html).toContain('flip_card_sheen');
    expect(html).toContain('flip_card_holo');
    expect(html).toContain('data-has-mask="true"');
  });

  it('renders transparent glass mode attributes', () => {
    const html = renderToStaticMarkup(
      createElement(FlipCard, {
        frontContent: createElement(Box, null, 'Front View'),
        isTransparent: true,
      })
    );

    expect(html).toContain('data-transparent="true"');
  });

  it('omits tabIndex when card cannot flip', () => {
    const html = renderToStaticMarkup(
      createElement(FlipCard, {
        frontContent: createElement(Box, null, 'Front View'),
        interactive: false,
      })
    );

    expect(html).not.toContain('tabindex="0"');
  });
});
