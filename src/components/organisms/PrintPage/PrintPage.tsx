import { Box, Flex } from 'styled-system/jsx';
import { useA11yString } from '../../../i18n/context.tsx';
import type {
  PrintPageProps,
  PrintPageCardVariant,
  PrintPageViewMode,
} from './PrintPage.types.ts';
import { extractPagesFromChildren } from './printPageHelpers.ts';
import { usePrintPage } from './usePrintPage.ts';
import { PrintPageItem } from './PrintPageItem.tsx';
import { PrintPageControls } from './PrintPageControls.tsx';
import { PrintPageFab } from './PrintPageFab.tsx';
import { FlipView } from './PrintPageFlipView.tsx';
import './printPage.css';

export { FlipView } from './PrintPageFlipView.tsx';

interface ViewportProps {
  readonly pageItems: readonly React.ReactNode[];
  readonly totalPages: number;
  readonly cardVariant: PrintPageCardVariant;
}

function VerticalView({ pageItems, totalPages, cardVariant }: ViewportProps) {
  return (
    <Flex className="printpage_viewport_vertical">
      {pageItems.map((page, index) => (
        <PrintPageItem
          key={index}
          pageNumber={index + 1}
          totalPages={totalPages}
          variant={cardVariant}
        >
          {page}
        </PrintPageItem>
      ))}
    </Flex>
  );
}

function HorizontalView({ pageItems, totalPages, cardVariant }: ViewportProps) {
  return (
    <Flex className="printpage_viewport_horizontal">
      {pageItems.map((page, index) => (
        <Box key={index} className="printpage_horizontal_item">
          <PrintPageItem
            pageNumber={index + 1}
            totalPages={totalPages}
            variant={cardVariant}
          >
            {page}
          </PrintPageItem>
        </Box>
      ))}
    </Flex>
  );
}

interface ActiveViewportProps {
  readonly viewMode: PrintPageViewMode;
  readonly pageItems: readonly React.ReactNode[];
  readonly totalPages: number;
  readonly cardVariant: PrintPageCardVariant;
  readonly currentPage: number;
  readonly targetPage: number;
  readonly flipDirection: 'next' | 'prev' | 'idle';
  readonly onAnimationEnd?: () => void;
  readonly onPrevPage?: () => void;
  readonly onNextPage?: () => void;
}

function ActiveViewport({
  viewMode,
  pageItems,
  totalPages,
  cardVariant,
  currentPage,
  targetPage,
  flipDirection,
  onAnimationEnd,
  onPrevPage,
  onNextPage,
}: ActiveViewportProps) {
  if (viewMode === 'horizontal') {
    return (
      <HorizontalView
        pageItems={pageItems}
        totalPages={totalPages}
        cardVariant={cardVariant}
      />
    );
  }
  if (viewMode === 'flip') {
    return (
      <FlipView
        currentPage={currentPage}
        targetPage={targetPage}
        totalPages={totalPages}
        cardVariant={cardVariant}
        flipDirection={flipDirection}
        pageItems={pageItems}
        onAnimationEnd={onAnimationEnd}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    );
  }
  return (
    <VerticalView
      pageItems={pageItems}
      totalPages={totalPages}
      cardVariant={cardVariant}
    />
  );
}

function resolvePrintDefaults(props: PrintPageProps) {
  return {
    defaultMode: props.defaultMode ?? 'vertical',
    pdfUrl: props.pdfUrl ?? '/documents/document.pdf',
    pdfFileName: props.pdfFileName ?? 'document.pdf',
    cardVariant: props.cardVariant ?? 'elevated',
    showFab: props.showFab ?? true,
    showControls: props.showControls ?? true,
  };
}

function canShowControls(
  showControls: boolean,
  isPdfMode: boolean,
  totalPages: number
): boolean {
  if (!showControls || isPdfMode) return false;
  return totalPages > 1;
}

export function PrintPage(props: PrintPageProps) {
  const defaultAriaLabel = useA11yString('printPageMain');
  const config = resolvePrintDefaults(props);
  const pageItems = props.pages ?? extractPagesFromChildren(props.children);
  const totalPages = Math.max(1, pageItems.length);

  const hook = usePrintPage({
    totalPages,
    defaultMode: config.defaultMode,
    controlledMode: props.mode,
    onModeChange: props.onModeChange,
    isPdf: props.isPdf,
  });

  const showControls = canShowControls(
    config.showControls,
    hook.isPdfMode,
    totalPages
  );

  return (
    <Box
      className={`printpage_root ${props.className ?? ''}`}
      data-testid={props.dataTestId}
      role="region"
      aria-label={props.ariaLabel ?? defaultAriaLabel}
    >
      {showControls && (
        <PrintPageControls
          viewMode={hook.viewMode}
          onViewModeChange={hook.setViewMode}
          currentPage={hook.currentPage}
          totalPages={totalPages}
          onPrevPage={hook.prevPage}
          onNextPage={hook.nextPage}
        />
      )}

      <ActiveViewport
        viewMode={hook.viewMode}
        pageItems={pageItems}
        totalPages={totalPages}
        cardVariant={config.cardVariant}
        currentPage={hook.currentPage}
        targetPage={hook.targetPage}
        flipDirection={hook.flipDirection}
        onAnimationEnd={hook.completeFlip}
        onPrevPage={hook.prevPage}
        onNextPage={hook.nextPage}
      />

      {config.showFab && (
        <PrintPageFab
          pdfUrl={config.pdfUrl}
          pdfFileName={config.pdfFileName}
          isPdfMode={hook.isPdfMode}
        />
      )}
    </Box>
  );
}
