import type { ReactNode } from 'react';
import type { CardVariant } from '@m3e/web/card';

export type PrintPageViewMode = 'vertical' | 'horizontal' | 'flip';
export type PrintPageCardVariant = CardVariant;

export interface PrintPageProps {
  /** Array of React elements or MDX content, one per A4 page */
  readonly pages?: readonly ReactNode[];
  /** React children, either multiple PrintPageItem components or MDX content */
  readonly children?: ReactNode;
  /** Initial view mode for uncontrolled mode */
  readonly defaultMode?: PrintPageViewMode;
  /** Active view mode for controlled mode */
  readonly mode?: PrintPageViewMode;
  /** Callback fired when view mode changes */
  readonly onModeChange?: (mode: PrintPageViewMode) => void;
  /** URL of the statically pre-rendered PDF */
  readonly pdfUrl?: string;
  /** Filename suggested when downloading PDF */
  readonly pdfFileName?: string;
  /** Whether currently rendering inside Playwright / PDF generation */
  readonly isPdf?: boolean;
  /** Card appearance variant */
  readonly cardVariant?: CardVariant;
  /** Whether to show the PDF download floating action button */
  readonly showFab?: boolean;
  /** Whether to show the view mode and navigation toolbar */
  readonly showControls?: boolean;
  /** Accessible label for the main print page container */
  readonly ariaLabel?: string;
  /** Optional custom CSS class */
  readonly className?: string;
  /** Test identifier */
  readonly dataTestId?: string;
}

export interface PrintPageItemProps {
  /** Current page index (1-based) */
  readonly pageNumber?: number;
  /** Total count of pages in document */
  readonly totalPages?: number;
  /** M3e Card appearance variant */
  readonly variant?: CardVariant;
  /** Optional custom page header */
  readonly header?: ReactNode;
  /** Optional custom page footer */
  readonly footer?: ReactNode;
  /** Page content */
  readonly children: ReactNode;
  /** Accessible label for the page card */
  readonly ariaLabel?: string;
  /** Optional custom CSS class */
  readonly className?: string;
  /** Test identifier */
  readonly dataTestId?: string;
}

export interface PrintPageControlsProps {
  /** Active view mode */
  readonly viewMode: PrintPageViewMode;
  /** Callback fired when view mode changes */
  readonly onViewModeChange: (mode: PrintPageViewMode) => void;
  /** Active page number (1-based) */
  readonly currentPage: number;
  /** Total pages in document */
  readonly totalPages: number;
  /** Callback to navigate to previous page */
  readonly onPrevPage: () => void;
  /** Callback to navigate to next page */
  readonly onNextPage: () => void;
  /** Accessible label for controls */
  readonly ariaLabel?: string;
  /** Test identifier */
  readonly dataTestId?: string;
}

export interface PrintPageFabProps {
  /** Target static PDF URL to download */
  readonly pdfUrl: string;
  /** Download file name */
  readonly pdfFileName?: string;
  /** Accessible label for the button */
  readonly ariaLabel?: string;
  /** Whether in PDF mode (when true, button is unmounted) */
  readonly isPdfMode?: boolean;
  /** Optional callback fired when button is triggered */
  readonly onDownload?: () => void;
  /** Test identifier */
  readonly dataTestId?: string;
}
