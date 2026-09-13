import { Box } from 'styled-system/jsx';
import { M3eFab } from '@m3e/react/fab';
import { M3eIcon } from '@m3e/react/icon';
import { useA11yString } from '../../../i18n/context.tsx';
import type { PrintPageFabProps } from './PrintPage.types.ts';

import '@m3e/icons/rounded/picture_as_pdf';

export function PrintPageFab({
  pdfUrl,
  ariaLabel,
  isPdfMode = false,
  onDownload,
  dataTestId,
}: PrintPageFabProps) {
  const defaultLabel = useA11yString('downloadPdfAriaLabel');
  const computedLabel = ariaLabel ?? defaultLabel;

  if (isPdfMode) {
    return null;
  }

  const handleClick = () => {
    onDownload?.();
    if (typeof window !== 'undefined' && pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <Box
      className="printpage_fab_wrapper printpage_noprint"
      data-testid={dataTestId}
    >
      <M3eFab
        variant="primary-container"
        size="medium"
        aria-label={computedLabel}
        onClick={handleClick}
      >
        <M3eIcon name="picture_as_pdf" />
      </M3eFab>
    </Box>
  );
}
