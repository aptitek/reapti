import type { ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { useAccordeon } from './useAccordeon.ts';
import './accordeon.css';

export interface AccordeonProps {
  /**
   * The single child view to fold and unfold (e.g. Map component).
   * Rendered exactly once in the DOM — never duplicated across panels.
   */
  children: ReactNode;
  /**
   * Number of 3D accordion folds (each fold has 2 panels, e.g. 2 folds = 4 panels like a W).
   * @default 2
   */
  folds?: number;
  /**
   * Number of accordion panels (always 2 panels per fold).
   * @default 4
   */
  panels?: number;
  /**
   * Controlled folded state.
   */
  isFolded?: boolean;
  /**
   * Initial folded state for uncontrolled usage.
   * @default false
   */
  defaultFolded?: boolean;
  /**
   * Callback fired when fold state toggles.
   */
  onToggle?: (isFolded: boolean) => void;
  /**
   * Maximum fold rotation angle in degrees per crease.
   * @default 0
   */
  maxAngle?: number;
  /**
   * 3D perspective depth in pixels.
   * @default 1200
   */
  perspective?: number;
  /**
   * Accessible label for the accordion folding region.
   */
  ariaLabel?: string;
}

export function Accordeon(props: AccordeonProps) {
  const {
    isFolded,
    panelCount,
    regionId,
    containerRef,
    handleToggle,
    handleKeyDown,
    ariaLabel,
  } = useAccordeon(props);

  return (
    <Box
      ref={containerRef}
      className="accordeon_root"
      data-folded={isFolded ? 'true' : 'false'}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-expanded={!isFolded}
      id={regionId}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <Box className="accordeon_viewport">
        <Box className="accordeon_content">{props.children}</Box>
        <Box className="accordeon_creases" aria-hidden="true">
          {Array.from({ length: panelCount }, (_, index) => (
            <Box
              key={index}
              className="accordeon_crease_panel"
              data-panel-index={index}
              data-crease-even={index % 2 === 0 ? 'true' : 'false'}
            />
          ))}
        </Box>
        <Box className="accordeon_elevation" aria-hidden="true">
          {Array.from({ length: panelCount }, (_, index) => (
            <Box
              key={index}
              className="accordeon_elevation_panel"
              data-panel-index={index}
              data-crease-even={index % 2 === 0 ? 'true' : 'false'}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
