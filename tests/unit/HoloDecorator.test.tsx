import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { HoloDecorator } from '../../src/components/atoms/HoloDecorator/HoloDecorator.tsx';

describe('HoloDecorator Atom Component', () => {
  it('renders child component unmodified when active is false', () => {
    const html = renderToStaticMarkup(
      createElement(
        HoloDecorator,
        { active: false },
        createElement(Box, null, 'Plain Content')
      )
    );

    expect(html).toContain('Plain Content');
    expect(html).not.toContain('holo-decorator_text');
    expect(html).not.toContain('holo-decorator_image');
  });

  it('renders text mode wrapper with holo-decorator_text class when active', () => {
    const html = renderToStaticMarkup(
      createElement(
        HoloDecorator,
        { active: true, type: 'text' },
        createElement(Box, null, 'Shimmering Text')
      )
    );

    expect(html).toContain('holo-decorator_text');
    expect(html).toContain('Shimmering Text');
  });

  it('renders image mode wrapper with holo-decorator_image class', () => {
    const html = renderToStaticMarkup(
      createElement(
        HoloDecorator,
        { active: true, type: 'image', maskUrl: 'logo.svg' },
        createElement(Box, null, 'Image Child')
      )
    );

    expect(html).toContain('holo-decorator_image');
    expect(html).toContain('Image Child');
  });

  it('merges custom className when provided', () => {
    const html = renderToStaticMarkup(
      createElement(
        HoloDecorator,
        { active: true, type: 'text', className: 'custom-shine' },
        createElement(Box, null, 'Custom Shine')
      )
    );

    expect(html).toContain('holo-decorator_text custom-shine');
  });
});
