import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeroTicker } from '../../src/components/molecules/HeroTicker/HeroTicker.tsx';

describe('HeroTicker - Content & Accessibility', () => {
  it('renders with default prefix, suffix, and ticker text', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTicker, {
        prefix: 'We craft ',
        phrases: ['revolutionary ideas'],
        suffix: ' that inspire.',
        dataTestId: 'test-hero-ticker',
      })
    );

    expect(html).toContain('data-testid="test-hero-ticker"');
    expect(html).toContain('hero-ticker_prefix');
    expect(html).toContain('We craft ');
    expect(html).toContain('hero-ticker_suffix');
    expect(html).toContain(' that inspire.');
    expect(html).toContain('hero-ticker_cursive-text');
    expect(html).toContain('revolutionary ideas');
  });

  it('renders screen-reader accessible full coherent slogan in live region', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTicker, {
        prefix: 'Innovating ',
        phrases: ['digital experiences'],
        suffix: ' for everyone.',
      })
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('Innovating digital experiences for everyone.');
  });

  it('renders without prefix or suffix if omitted', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTicker, {
        prefix: '',
        suffix: '',
        phrases: ['Simple Brand'],
      })
    );

    expect(html).not.toContain('hero-ticker_prefix');
    expect(html).not.toContain('hero-ticker_suffix');
    expect(html).toContain('Simple Brand');
  });

  it('renders semantic heading element to the accessibility tree', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTicker, {
        as: 'h1',
        phrases: ['Heading A11y Test'],
      })
    );

    expect(html).toContain('<h1');
  });
});

describe('HeroTicker - Controls & Styling', () => {
  it('renders flourish underline according to flourish prop', () => {
    const swooshHtml = renderToStaticMarkup(
      createElement(HeroTicker, {
        phrases: ['flourish test'],
        flourish: 'swoosh',
      })
    );
    expect(swooshHtml).toContain('hero-ticker_flourish');

    const noneHtml = renderToStaticMarkup(
      createElement(HeroTicker, {
        phrases: ['flourish test'],
        flourish: 'none',
      })
    );
    expect(noneHtml).not.toContain('hero-ticker_flourish');
  });

  it('renders interactive controls when showControls is true', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTicker, {
        phrases: ['first phrase', 'second phrase', 'third phrase'],
        showControls: true,
      })
    );

    expect(html).toContain('hero-ticker_controls');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('m3e-icon-button');
    expect(html).toContain('m3e-icon');
    expect(html).toContain('Pause ticker animation');
  });
});

describe('HeroTicker - Alignment & Accents', () => {
  it('supports alignment variants', () => {
    const centerHtml = renderToStaticMarkup(
      createElement(HeroTicker, { align: 'center' })
    );
    expect(centerHtml).toContain('data-align="center"');

    const leftHtml = renderToStaticMarkup(
      createElement(HeroTicker, { align: 'left' })
    );
    expect(leftHtml).toContain('data-align="left"');
  });

  it('supports theme accents and custom accent variable overrides', () => {
    const secondaryHtml = renderToStaticMarkup(
      createElement(HeroTicker, { accentColor: 'secondary' })
    );
    expect(secondaryHtml).toContain('hero-ticker_root');
    expect(secondaryHtml).toContain('data-accent="secondary"');

    const customHtml = renderToStaticMarkup(
      createElement(HeroTicker, { accentVar: 'var(--custom-accent)' })
    );
    expect(customHtml).toContain('hero-ticker_root');
  });

  it('supports custom className, glow, and ref object forwarding', () => {
    const ref = { current: null };
    const html = renderToStaticMarkup(
      createElement(HeroTicker, {
        ref,
        className: 'my-custom-ticker-class',
        glow: true,
        flourish: 'wave',
      })
    );
    expect(html).toContain('my-custom-ticker-class');
    expect(html).toContain('data-glow="true"');
    expect(html).toContain('hero-ticker_flourish');
  });

  it('supports different animation modes (cursive-type, fade)', () => {
    const typeHtml = renderToStaticMarkup(
      createElement(HeroTicker, {
        animationMode: 'cursive-type',
        phrases: ['Typewriter style'],
      })
    );
    expect(typeHtml).toContain('hero-ticker_root');

    const fadeHtml = renderToStaticMarkup(
      createElement(HeroTicker, {
        animationMode: 'fade',
        phrases: ['Fade style'],
        flourish: 'loop',
      })
    );
    expect(fadeHtml).toContain('hero-ticker_root');
    expect(fadeHtml).toContain('hero-ticker_flourish');
  });
});
