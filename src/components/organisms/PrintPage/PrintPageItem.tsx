import { Box, Flex } from 'styled-system/jsx';
import { M3eCard } from '@m3e/react/card';
import type { PrintPageItemProps } from './PrintPage.types.ts';
import { formatPageIndicator } from './printPageHelpers.ts';

export function PrintPageItem({
  pageNumber,
  totalPages,
  variant = 'elevated',
  header,
  footer,
  children,
  ariaLabel,
  className,
  dataTestId,
}: PrintPageItemProps) {
  const pageLabel =
    pageNumber && totalPages
      ? formatPageIndicator(pageNumber, totalPages)
      : null;

  return (
    <Box
      className={`printpage_card_wrapper ${className ?? ''}`}
      data-testid={dataTestId}
      role="region"
      aria-label={ariaLabel}
    >
      <M3eCard
        variant={variant}
        data-variant={variant}
        className="printpage_card"
      >
        {header ? <Box className="printpage_header_slot">{header}</Box> : null}

        <Box className="printpage_card_content">{children}</Box>

        {footer ? (
          <Box className="printpage_footer_slot">{footer}</Box>
        ) : pageLabel ? (
          <Flex className="printpage_footer_slot" justifyContent="flex-end">
            <Box fontSize="xs">{pageLabel}</Box>
          </Flex>
        ) : null}
      </M3eCard>
    </Box>
  );
}
