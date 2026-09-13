import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContentProvider } from '../../src/i18n/ContentProvider.tsx';
import { PrintPageControls } from '../../src/components/organisms/PrintPage/PrintPageControls.tsx';

function renderWithContent(element: React.ReactElement): string {
  return renderToStaticMarkup(
    createElement(ContentProvider, { initialLocale: 'en' }, element)
  );
}

describe('PrintPageControls Rendering and Structure', () => {
  it('renders view mode switcher and page indicator', () => {
    const html = renderWithContent(
      createElement(PrintPageControls, {
        viewMode: 'vertical',
        onViewModeChange: vi.fn(),
        currentPage: 1,
        totalPages: 4,
        onPrevPage: vi.fn(),
        onNextPage: vi.fn(),
        dataTestId: 'controls-test',
      })
    );
    expect(html).toContain('printpage_controls_bar');
    expect(html).toContain('1 / 4');
    expect(html).toContain('aria-label="Vertical scrolling mode"');
    expect(html).toContain('aria-label="Horizontal scrolling mode"');
    expect(html).toContain('aria-label="Page flip mode"');
    expect(html).toContain('aria-pressed');
    expect(html).toContain('m3e-icon-button');
    expect(html).toContain('m3e-icon');
  });

  it('applies custom aria-label when provided', () => {
    const html = renderWithContent(
      createElement(PrintPageControls, {
        viewMode: 'vertical',
        onViewModeChange: vi.fn(),
        currentPage: 2,
        totalPages: 5,
        onPrevPage: vi.fn(),
        onNextPage: vi.fn(),
        ariaLabel: 'Custom Dossier Navigation',
      })
    );
    expect(html).toContain('aria-label="Custom Dossier Navigation"');
  });
});

describe('PrintPageControls Pagination Boundaries', () => {
  it('marks previous button as disabled on first page', () => {
    const html = renderWithContent(
      createElement(PrintPageControls, {
        viewMode: 'horizontal',
        onViewModeChange: vi.fn(),
        currentPage: 1,
        totalPages: 3,
        onPrevPage: vi.fn(),
        onNextPage: vi.fn(),
      })
    );
    expect(html).toContain('aria-label="Previous page"');
    expect(html).toContain('aria-disabled');
    expect(html).toContain('1 / 3');
  });

  it('marks next button as disabled on last page', () => {
    const html = renderWithContent(
      createElement(PrintPageControls, {
        viewMode: 'flip',
        onViewModeChange: vi.fn(),
        currentPage: 3,
        totalPages: 3,
        onPrevPage: vi.fn(),
        onNextPage: vi.fn(),
      })
    );
    expect(html).toContain('aria-label="Next page"');
    expect(html).toContain('aria-disabled');
    expect(html).toContain('3 / 3');
  });
});

describe('PrintPageControls Interactions', () => {
  it('triggers all mode changes and pagination callbacks', () => {
    const onViewModeChange = vi.fn();
    const onPrevPage = vi.fn();
    const onNextPage = vi.fn();
    let controlsTree: React.ReactElement | null = null;

    function Probe() {
      controlsTree = PrintPageControls({
        viewMode: 'vertical',
        onViewModeChange,
        currentPage: 2,
        totalPages: 4,
        onPrevPage,
        onNextPage,
      });
      return null;
    }

    renderWithContent(createElement(Probe));
    expect(controlsTree).not.toBeNull();
    if (!controlsTree) return;

    const [modeGroup, navGroup] = (
      controlsTree as {
        props: {
          children: [
            {
              props: {
                children: [
                  { props: { onClick: () => void } },
                  { props: { onClick: () => void } },
                  { props: { onClick: () => void } },
                ];
              };
            },
            {
              props: {
                children: [
                  { props: { onClick: () => void } },
                  unknown,
                  { props: { onClick: () => void } },
                ];
              };
            },
          ];
        };
      }
    ).props.children;

    modeGroup.props.children[0].props.onClick();
    expect(onViewModeChange).toHaveBeenCalledWith('vertical');

    modeGroup.props.children[1].props.onClick();
    expect(onViewModeChange).toHaveBeenCalledWith('horizontal');

    modeGroup.props.children[2].props.onClick();
    expect(onViewModeChange).toHaveBeenCalledWith('flip');

    navGroup.props.children[0].props.onClick();
    expect(onPrevPage).toHaveBeenCalledTimes(1);

    navGroup.props.children[2].props.onClick();
    expect(onNextPage).toHaveBeenCalledTimes(1);
  });
});
