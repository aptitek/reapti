import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContentProvider } from '../../src/i18n/ContentProvider.tsx';
import { PrintPageFab } from '../../src/components/organisms/PrintPage/PrintPageFab.tsx';

function renderWithContent(element: React.ReactElement): string {
  return renderToStaticMarkup(
    createElement(ContentProvider, { initialLocale: 'en' }, element)
  );
}

describe('PrintPageFab Rendering and Suppression', () => {
  it('renders M3eFab with accessible aria-label and PDF icon', () => {
    const html = renderWithContent(
      createElement(PrintPageFab, {
        pdfUrl: '/documents/spec.pdf',
        pdfFileName: 'spec.pdf',
        dataTestId: 'fab-test',
      })
    );
    expect(html).toContain('printpage_fab_wrapper');
    expect(html).toContain('m3e-fab');
    expect(html).toContain('m3e-icon');
    expect(html).toContain('aria-label="Download PDF document"');
    expect(html).toContain('data-testid="fab-test"');
  });

  it('completely suppresses FAB rendering when isPdfMode is true', () => {
    const html = renderWithContent(
      createElement(PrintPageFab, {
        pdfUrl: '/documents/spec.pdf',
        isPdfMode: true,
      })
    );
    expect(html).toBe('');
    expect(html).not.toContain('m3e-fab');
  });

  it('applies custom ariaLabel when provided', () => {
    const html = renderWithContent(
      createElement(PrintPageFab, {
        pdfUrl: '/documents/spec.pdf',
        ariaLabel: 'Download Architecture Dossier PDF',
      })
    );
    expect(html).toContain('aria-label="Download Architecture Dossier PDF"');
  });
});

describe('PrintPageFab Interaction Handling', () => {
  it('triggers onDownload callback and window.open when clicked', () => {
    const onDownload = vi.fn();
    const openMock = vi.fn();
    vi.stubGlobal('window', { open: openMock });

    let capturedProps: { onClick: () => void } | null = null;
    function Probe() {
      const v = PrintPageFab({
        pdfUrl: '/documents/spec.pdf',
        onDownload,
      });
      if (v) {
        const m3eFab = (v.props as { children: React.ReactElement }).children;
        capturedProps = m3eFab.props as { onClick: () => void };
      }
      return null;
    }

    renderWithContent(createElement(Probe));
    expect(capturedProps).not.toBeNull();
    capturedProps?.onClick();

    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(openMock).toHaveBeenCalledWith('/documents/spec.pdf', '_blank');
    vi.unstubAllGlobals();
  });

  it('handles click gracefully when onDownload is omitted', () => {
    const openMock = vi.fn();
    vi.stubGlobal('window', { open: openMock });

    let capturedProps: { onClick: () => void } | null = null;
    function Probe() {
      const v = PrintPageFab({ pdfUrl: '' });
      if (v) {
        const m3eFab = (v.props as { children: React.ReactElement }).children;
        capturedProps = m3eFab.props as { onClick: () => void };
      }
      return null;
    }

    renderWithContent(createElement(Probe));
    expect(capturedProps).not.toBeNull();
    capturedProps?.onClick();
    expect(openMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
