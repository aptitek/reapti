import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContentProvider } from '../../src/i18n/ContentProvider.tsx';
import { FlipView } from '../../src/components/organisms/PrintPage/PrintPageFlipView.tsx';

function renderWithContent(element: React.ReactElement): string {
  return renderToStaticMarkup(
    createElement(ContentProvider, { initialLocale: 'en' }, element)
  );
}

const samplePages = [
  createElement('div', { key: '1' }, 'Page 1 Content'),
  createElement('div', { key: '2' }, 'Page 2 Content'),
  createElement('div', { key: '3' }, 'Page 3 Content'),
];

describe('PrintPageFlipView Layout and States', () => {
  it('renders resting 3D flip stage with spine crease and edge stack', () => {
    const html = renderWithContent(
      createElement(FlipView, {
        currentPage: 1,
        targetPage: 1,
        totalPages: 3,
        cardVariant: 'elevated',
        flipDirection: 'idle',
        pageItems: samplePages,
      })
    );

    expect(html).toContain('printpage_viewport_flip');
    expect(html).toContain('printpage_flip_stage');
    expect(html).toContain('printpage_spine_crease');
    expect(html).toContain('printpage_book_edge_stack');
    expect(html).toContain('printpage_side_nav_prev');
    expect(html).toContain('printpage_side_nav_next');
    expect(html).toContain('Page 1 Content');
    expect(html).not.toContain('printpage_flip_leaf');
  });

  it('renders double-sided turning leaf and shadows when turning next', () => {
    const onEnd = vi.fn();
    const onNext = vi.fn();
    const html = renderWithContent(
      createElement(FlipView, {
        currentPage: 1,
        targetPage: 2,
        totalPages: 3,
        cardVariant: 'elevated',
        flipDirection: 'next',
        pageItems: samplePages,
        onAnimationEnd: onEnd,
        onNextPage: onNext,
      })
    );

    expect(html).toContain('printpage_flip_next');
    expect(html).toContain('printpage_cast_shadow');
    expect(html).toContain('printpage_curl_lighting');
    expect(html).toContain('printpage_leaf_front');
    expect(html).toContain('printpage_leaf_back');
    expect(html).toContain('printpage_leaf_back_sheet');
  });
});

describe('PrintPageFlipView Reverse and Navigation Limits', () => {
  it('renders turning leaf and shadows when turning prev', () => {
    const onPrev = vi.fn();
    const html = renderWithContent(
      createElement(FlipView, {
        currentPage: 2,
        targetPage: 1,
        totalPages: 3,
        cardVariant: 'elevated',
        flipDirection: 'prev',
        pageItems: samplePages,
        onPrevPage: onPrev,
      })
    );

    expect(html).toContain('printpage_flip_prev');
    expect(html).toContain('printpage_cast_shadow');
    expect(html).toContain('printpage_leaf_back_shadow');
  });

  it('disables side chevrons at page limits', () => {
    const htmlFirst = renderWithContent(
      createElement(FlipView, {
        currentPage: 1,
        targetPage: 1,
        totalPages: 3,
        cardVariant: 'elevated',
        flipDirection: 'idle',
        pageItems: samplePages,
      })
    );

    expect(htmlFirst).toContain('aria-disabled');

    const htmlLast = renderWithContent(
      createElement(FlipView, {
        currentPage: 3,
        targetPage: 3,
        totalPages: 3,
        cardVariant: 'elevated',
        flipDirection: 'idle',
        pageItems: samplePages,
      })
    );

    expect(htmlLast).toContain('aria-disabled');
  });
});
