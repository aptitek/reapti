import { Box, Flex } from 'styled-system/jsx';
import { M3eIconButton } from '@m3e/react/icon-button';
import { M3eIcon } from '@m3e/react/icon';
import { useA11yString } from '../../../i18n/context.tsx';
import type {
  PrintPageControlsProps,
  PrintPageViewMode,
} from './PrintPage.types.ts';
import { formatPageIndicator } from './printPageHelpers.ts';

import '@m3e/icons/rounded/view_day';
import '@m3e/icons/rounded/view_column';
import '@m3e/icons/rounded/auto_stories';
import '@m3e/icons/rounded/arrow_back';
import '@m3e/icons/rounded/arrow_forward';

interface ModeLabels {
  readonly vertical: string;
  readonly horizontal: string;
  readonly flip: string;
}

function renderModeGroup(
  viewMode: PrintPageViewMode,
  onChange: (mode: PrintPageViewMode) => void,
  labels: ModeLabels
) {
  return (
    <Flex gap="2" alignItems="center">
      <M3eIconButton
        aria-label={labels.vertical}
        aria-pressed={viewMode === 'vertical'}
        selected={viewMode === 'vertical'}
        onClick={() => onChange('vertical')}
      >
        <M3eIcon name="view_day" />
      </M3eIconButton>

      <M3eIconButton
        aria-label={labels.horizontal}
        aria-pressed={viewMode === 'horizontal'}
        selected={viewMode === 'horizontal'}
        onClick={() => onChange('horizontal')}
      >
        <M3eIcon name="view_column" />
      </M3eIconButton>

      <M3eIconButton
        aria-label={labels.flip}
        aria-pressed={viewMode === 'flip'}
        selected={viewMode === 'flip'}
        onClick={() => onChange('flip')}
      >
        <M3eIcon name="auto_stories" />
      </M3eIconButton>
    </Flex>
  );
}

interface NavLabels {
  readonly prev: string;
  readonly next: string;
}

interface NavGroupProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly labels: NavLabels;
}

function renderNavGroup({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  labels,
}: NavGroupProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;
  const text = formatPageIndicator(currentPage, totalPages);

  return (
    <Flex gap="3" alignItems="center">
      <M3eIconButton
        aria-label={labels.prev}
        aria-disabled={isFirst}
        disabled={isFirst}
        onClick={onPrev}
      >
        <M3eIcon name="arrow_back" />
      </M3eIconButton>

      <Box fontSize="sm" fontWeight="medium" userSelect="none">
        {text}
      </Box>

      <M3eIconButton
        aria-label={labels.next}
        aria-disabled={isLast}
        disabled={isLast}
        onClick={onNext}
      >
        <M3eIcon name="arrow_forward" />
      </M3eIconButton>
    </Flex>
  );
}

export function PrintPageControls(props: PrintPageControlsProps) {
  const indicatorRoleLabel = useA11yString('pageIndicator');
  const modeLabels = {
    vertical: useA11yString('viewModeVertical'),
    horizontal: useA11yString('viewModeHorizontal'),
    flip: useA11yString('viewModeFlip'),
  };
  const navLabels = {
    prev: useA11yString('previousPage'),
    next: useA11yString('nextPage'),
  };

  return (
    <Flex
      className="printpage_controls_bar printpage_noprint"
      data-testid={props.dataTestId}
      role="toolbar"
      aria-label={props.ariaLabel ?? indicatorRoleLabel}
      alignItems="center"
      justifyContent="space-between"
      gap="4"
    >
      {renderModeGroup(props.viewMode, props.onViewModeChange, modeLabels)}
      {renderNavGroup({
        currentPage: props.currentPage,
        totalPages: props.totalPages,
        onPrev: props.onPrevPage,
        onNext: props.onNextPage,
        labels: navLabels,
      })}
    </Flex>
  );
}
