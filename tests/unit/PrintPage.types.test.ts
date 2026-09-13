import { describe, it, expect } from 'vitest';
import type {
  PrintPageViewMode,
  PrintPageProps,
  PrintPageItemProps,
  PrintPageControlsProps,
  PrintPageFabProps,
} from '../../src/components/organisms/PrintPage/PrintPage.types.ts';

describe('PrintPage Core Type Contracts', () => {
  it('supports all valid PrintPageViewModes', () => {
    const modes: PrintPageViewMode[] = ['vertical', 'horizontal', 'flip'];
    expect(modes).toHaveLength(3);
  });

  it('constructs a valid PrintPageProps object', () => {
    const props: PrintPageProps = {
      pages: ['Page 1', 'Page 2'],
      defaultMode: 'vertical',
      mode: 'flip',
      pdfUrl: '/documents/document.pdf',
      pdfFileName: 'document.pdf',
      isPdf: false,
      cardVariant: 'elevated',
      showFab: true,
      showControls: true,
      ariaLabel: 'A4 Dossier',
      className: 'custom-print',
      dataTestId: 'print-page-dossier',
    };
    expect(props.defaultMode).toBe('vertical');
    expect(props.mode).toBe('flip');
    expect(props.cardVariant).toBe('elevated');
  });
});

describe('PrintPage Sub-Component Type Contracts', () => {
  it('constructs a valid PrintPageItemProps object', () => {
    const itemProps: PrintPageItemProps = {
      pageNumber: 1,
      totalPages: 3,
      variant: 'outlined',
      header: 'Header Content',
      footer: 'Footer Content',
      children: 'Body Content',
      ariaLabel: 'Page 1',
      className: 'page-one',
      dataTestId: 'page-1-card',
    };
    expect(itemProps.pageNumber).toBe(1);
    expect(itemProps.totalPages).toBe(3);
    expect(itemProps.variant).toBe('outlined');
  });

  it('constructs a valid PrintPageControlsProps object', () => {
    const controlsProps: PrintPageControlsProps = {
      viewMode: 'horizontal',
      onViewModeChange: () => {},
      currentPage: 2,
      totalPages: 4,
      onPrevPage: () => {},
      onNextPage: () => {},
      ariaLabel: 'Page Navigator',
      dataTestId: 'print-controls',
    };
    expect(controlsProps.viewMode).toBe('horizontal');
    expect(controlsProps.currentPage).toBe(2);
    expect(controlsProps.totalPages).toBe(4);
  });

  it('constructs a valid PrintPageFabProps object', () => {
    const fabProps: PrintPageFabProps = {
      pdfUrl: '/documents/spec.pdf',
      pdfFileName: 'spec.pdf',
      ariaLabel: 'Download PDF document',
      isPdfMode: false,
      onDownload: () => {},
      dataTestId: 'download-fab',
    };
    expect(fabProps.pdfUrl).toBe('/documents/spec.pdf');
    expect(fabProps.isPdfMode).toBe(false);
  });
});
