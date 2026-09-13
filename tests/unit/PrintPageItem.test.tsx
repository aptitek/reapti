import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PrintPageItem } from '../../src/components/organisms/PrintPage/PrintPageItem.tsx';

describe('PrintPageItem Variants and Structure', () => {
  it('renders children within an elevated M3eCard by default', () => {
    const html = renderToStaticMarkup(
      createElement(
        PrintPageItem,
        { dataTestId: 'test-page' },
        createElement('span', null, 'Page Body')
      )
    );
    expect(html).toContain('printpage_card_wrapper');
    expect(html).toContain('m3e-card');
    expect(html).toContain('data-variant="elevated"');
    expect(html).toContain('Page Body');
  });

  it('supports alternative card variants such as outlined and filled', () => {
    const htmlOutlined = renderToStaticMarkup(
      createElement(
        PrintPageItem,
        { variant: 'outlined' },
        createElement('span', null, 'Outlined Body')
      )
    );
    expect(htmlOutlined).toContain('data-variant="outlined"');

    const htmlFilled = renderToStaticMarkup(
      createElement(
        PrintPageItem,
        { variant: 'filled' },
        createElement('span', null, 'Filled Body')
      )
    );
    expect(htmlFilled).toContain('data-variant="filled"');
  });
});

describe('PrintPageItem Headers, Footers, and Attributes', () => {
  it('renders page number indicator in footer when provided', () => {
    const html = renderToStaticMarkup(
      createElement(
        PrintPageItem,
        { pageNumber: 2, totalPages: 5 },
        createElement('span', null, 'Content')
      )
    );
    expect(html).toContain('2 / 5');
    expect(html).toContain('printpage_footer_slot');
  });

  it('renders custom header and custom footer when provided', () => {
    const html = renderToStaticMarkup(
      createElement(
        PrintPageItem,
        {
          header: createElement('span', null, 'Custom Header'),
          footer: createElement('span', null, 'Custom Footer'),
        },
        createElement('span', null, 'Body')
      )
    );
    expect(html).toContain('Custom Header');
    expect(html).toContain('Custom Footer');
    expect(html).toContain('printpage_header_slot');
  });

  it('applies aria-label and custom className to card wrapper', () => {
    const html = renderToStaticMarkup(
      createElement(
        PrintPageItem,
        { ariaLabel: 'Confidential Page', className: 'extra-class' },
        createElement('span', null, 'Body')
      )
    );
    expect(html).toContain('aria-label="Confidential Page"');
    expect(html).toContain('extra-class');
  });
});
