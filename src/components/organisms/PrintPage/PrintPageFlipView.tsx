import { Box, Flex } from 'styled-system/jsx';
import { M3eIconButton } from '@m3e/react/icon-button';
import { M3eIcon } from '@m3e/react/icon';
import { useA11yString } from '../../../i18n/context.tsx';
import type { PrintPageCardVariant } from './PrintPage.types.ts';
import { PrintPageItem } from './PrintPageItem.tsx';

import '@m3e/icons/rounded/arrow_back';
import '@m3e/icons/rounded/arrow_forward';

interface FlipBaseSheetProps {
  readonly pageItem: React.ReactNode;
  readonly pageNumber: number;
  readonly totalPages: number;
  readonly cardVariant: PrintPageCardVariant;
  readonly isFlipping: boolean;
}

function FlipBaseSheet({
  pageItem,
  pageNumber,
  totalPages,
  cardVariant,
  isFlipping,
}: FlipBaseSheetProps) {
  return (
    <Box className="printpage_flip_base_sheet">
      <PrintPageItem
        pageNumber={pageNumber}
        totalPages={totalPages}
        variant={cardVariant}
      >
        {pageItem}
      </PrintPageItem>
      <Box className="printpage_spine_crease" />
      {isFlipping && <Box className="printpage_cast_shadow" />}
    </Box>
  );
}

interface FlipLeafProps {
  readonly pageItem: React.ReactNode;
  readonly pageNumber: number;
  readonly totalPages: number;
  readonly cardVariant: PrintPageCardVariant;
  readonly flipDirection: 'next' | 'prev';
  readonly onAnimationEnd?: () => void;
}

function FlipLeaf({
  pageItem,
  pageNumber,
  totalPages,
  cardVariant,
  flipDirection,
  onAnimationEnd,
}: FlipLeafProps) {
  return (
    <Box
      className={`printpage_flip_leaf printpage_flip_${flipDirection}`}
      onAnimationEnd={onAnimationEnd}
    >
      <Box className="printpage_flip_leaf_inner">
        <Box className="printpage_leaf_front">
          <PrintPageItem
            pageNumber={pageNumber}
            totalPages={totalPages}
            variant={cardVariant}
          >
            {pageItem}
          </PrintPageItem>
          <Box className="printpage_spine_crease" />
          <Box className="printpage_curl_lighting" />
        </Box>
        <Box className="printpage_leaf_back">
          <Box className="printpage_leaf_back_sheet" />
          <Box className="printpage_leaf_back_shadow" />
        </Box>
      </Box>
    </Box>
  );
}

interface FlipSideNavProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPrevPage?: () => void;
  readonly onNextPage?: () => void;
  readonly prevLabel: string;
  readonly nextLabel: string;
}

function FlipSideNav({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  prevLabel,
  nextLabel,
}: FlipSideNavProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <>
      <Box
        className="printpage_side_nav printpage_side_nav_prev"
        data-disabled={isFirst}
      >
        <M3eIconButton
          aria-label={prevLabel}
          aria-disabled={isFirst}
          disabled={isFirst}
          onClick={onPrevPage}
        >
          <M3eIcon name="arrow_back" />
        </M3eIconButton>
      </Box>
      <Box
        className="printpage_side_nav printpage_side_nav_next"
        data-disabled={isLast}
      >
        <M3eIconButton
          aria-label={nextLabel}
          aria-disabled={isLast}
          disabled={isLast}
          onClick={onNextPage}
        >
          <M3eIcon name="arrow_forward" />
        </M3eIconButton>
      </Box>
    </>
  );
}

export interface FlipViewProps {
  readonly currentPage: number;
  readonly targetPage: number;
  readonly totalPages: number;
  readonly cardVariant: PrintPageCardVariant;
  readonly flipDirection: 'next' | 'prev' | 'idle';
  readonly pageItems: readonly React.ReactNode[];
  readonly onAnimationEnd?: () => void;
  readonly onPrevPage?: () => void;
  readonly onNextPage?: () => void;
}

export function FlipView({
  currentPage,
  targetPage,
  totalPages,
  cardVariant,
  flipDirection,
  pageItems,
  onAnimationEnd,
  onPrevPage,
  onNextPage,
}: FlipViewProps) {
  const isTurningNext = flipDirection === 'next';
  const isFlipping = flipDirection !== 'idle';
  const basePageIndex = isTurningNext ? targetPage - 1 : currentPage - 1;
  const turningPageIndex = isTurningNext ? currentPage - 1 : targetPage - 1;
  const prevLabel = useA11yString('previousPage');
  const nextLabel = useA11yString('nextPage');

  return (
    <Flex className="printpage_viewport_flip">
      <Box className="printpage_flip_stage">
        <FlipSideNav
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
        />
        <FlipBaseSheet
          pageItem={pageItems[basePageIndex]}
          pageNumber={basePageIndex + 1}
          totalPages={totalPages}
          cardVariant={cardVariant}
          isFlipping={isFlipping}
        />
        <Box className="printpage_book_edge_stack" />
        {isFlipping && (
          <FlipLeaf
            pageItem={pageItems[turningPageIndex]}
            pageNumber={turningPageIndex + 1}
            totalPages={totalPages}
            cardVariant={cardVariant}
            flipDirection={flipDirection}
            onAnimationEnd={onAnimationEnd}
          />
        )}
      </Box>
    </Flex>
  );
}
