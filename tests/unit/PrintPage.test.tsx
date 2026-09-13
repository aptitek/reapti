import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContentProvider } from '../../src/i18n/ContentProvider.tsx';
import {
  PrintPage,
  FlipView,
} from '../../src/components/organisms/PrintPage/PrintPage.tsx';

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

describe('PrintPage View Modes', () => {
  it('renders default vertical scroll layout with controls and pages', () => {
    const html = renderWithContent(
      createElement(PrintPage, {
        pages: samplePages,
        defaultMode: 'vertical',
        dataTestId: 'main-print-page',
      })
    );

    expect(html).toContain('printpage_root');
    expect(html).toContain('printpage_viewport_vertical');
    expect(html).toContain('printpage_controls_bar');
    expect(html).toContain('Page 1 Content');
    expect(html).toContain('Page 2 Content');
    expect(html).toContain('Page 3 Content');
    expect(html).toContain('printpage_fab_wrapper');
    expect(html).toContain('data-testid="main-print-page"');
  });

  it('renders horizontal scroll layout when mode is horizontal', () => {
    const html = renderWithContent(
      createElement(PrintPage, {
        pages: samplePages,
        mode: 'horizontal',
      })
    );

    expect(html).toContain('printpage_viewport_horizontal');
    expect(html).toContain('printpage_horizontal_item');
    expect(html).toContain('Page 1 Content');
  });

  it('renders 3D flip stage when mode is flip', () => {
    const html = renderWithContent(
      createElement(PrintPage, {
        pages: samplePages,
        mode: 'flip',
      })
    );

    expect(html).toContain('printpage_viewport_flip');
    expect(html).toContain('printpage_flip_stage');
    expect(html).toContain('printpage_flip_base_sheet');
    expect(html).toContain('Page 1 Content');
  });
});

describe('PrintPage 3D Flip View States', () => {
  it('renders turning leaf and shadows when flipDirection is next', () => {
    const onEnd = vi.fn();
    const html = renderWithContent(
      createElement(FlipView, {
        currentPage: 1,
        targetPage: 2,
        totalPages: 3,
        cardVariant: 'elevated',
        flipDirection: 'next',
        pageItems: samplePages,
        onAnimationEnd: onEnd,
      })
    );
    expect(html).toContain('printpage_flip_next');
    expect(html).toContain('printpage_cast_shadow');
    expect(html).toContain('printpage_curl_lighting');
    expect(html).toContain('printpage_spine_crease');
    expect(html).toContain('printpage_book_edge_stack');
    expect(html).toContain('printpage_leaf_front');
    expect(html).toContain('printpage_leaf_back');
    expect(html).toContain('printpage_side_nav_prev');
    expect(html).toContain('printpage_side_nav_next');
  });

  it('renders turning leaf and shadows when flipDirection is prev', () => {
    const html = renderWithContent(
      createElement(FlipView, {
        currentPage: 2,
        targetPage: 1,
        totalPages: 3,
        cardVariant: 'elevated',
        flipDirection: 'prev',
        pageItems: samplePages,
      })
    );
    expect(html).toContain('printpage_flip_prev');
    expect(html).toContain('printpage_cast_shadow');
    expect(html).toContain('printpage_spine_crease');
    expect(html).toContain('printpage_leaf_back_shadow');
  });
});

describe('PrintPage Configuration and PDF Mode', () => {
  it('renders children when pages prop is omitted', () => {
    const html = renderWithContent(
      createElement(
        PrintPage,
        null,
        createElement('div', { key: 'a' }, 'Child Page Alpha'),
        createElement('div', { key: 'b' }, 'Child Page Beta')
      )
    );

    expect(html).toContain('Child Page Alpha');
    expect(html).toContain('Child Page Beta');
    expect(html).toContain('1 / 2');
  });

  it('hides controls when totalPages is 1 or showControls is false', () => {
    const htmlSingle = renderWithContent(
      createElement(PrintPage, {
        pages: [createElement('div', { key: '1' }, 'Single Page')],
      })
    );
    expect(htmlSingle).not.toContain('printpage_controls_bar');

    const htmlHiddenControls = renderWithContent(
      createElement(PrintPage, {
        pages: samplePages,
        showControls: false,
      })
    );
    expect(htmlHiddenControls).not.toContain('printpage_controls_bar');
  });

  it('hides FAB when showFab is false', () => {
    const html = renderWithContent(
      createElement(PrintPage, {
        pages: samplePages,
        showFab: false,
      })
    );
    expect(html).not.toContain('printpage_fab_wrapper');
  });

  it('strictly enforces PDF mode: hides controls, omits FAB, renders vertical', () => {
    const html = renderWithContent(
      createElement(PrintPage, {
        pages: samplePages,
        isPdf: true,
        mode: 'flip',
      })
    );

    expect(html).toContain('printpage_viewport_vertical');
    expect(html).not.toContain('printpage_viewport_flip');
    expect(html).not.toContain('printpage_controls_bar');
    expect(html).not.toContain('printpage_fab_wrapper');
    expect(html).toContain('Page 1 Content');
  });

  it('applies custom className and custom ariaLabel', () => {
    const html = renderWithContent(
      createElement(PrintPage, {
        pages: samplePages,
        className: 'custom-dossier-class',
        ariaLabel: 'Official System Dossier',
      })
    );

    expect(html).toContain('custom-dossier-class');
    expect(html).toContain('aria-label="Official System Dossier"');
  });
});
