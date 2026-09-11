import type { ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { Accordeon } from '../Accordeon/Accordeon.tsx';
import { useMeshAccordeon } from './useMeshAccordeon.ts';
import './meshAccordeon.css';

export interface MeshAccordeonProps {
  /**
   * Child view used during fallback or texture capture.
   */
  children?: ReactNode;
  /**
   * Number of 3D accordion folds (e.g. 2 folds = 4 panels like a W).
   * @default 2
   */
  folds?: number;
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
   * Accessible label for the mesh accordion.
   */
  ariaLabel?: string;
  /**
   * Z-depth amplitude for the soft folds.
   * @default 0.28
   */
  depth?: number;
  /**
   * Normalized corner radius token matching MD3 radii-medium.
   * @default 0.05
   */
  radius?: number;
  /**
   * Horizontal quad mesh subdivisions across fold axis.
   * @default 64
   */
  segments?: number;
  /**
   * Force fallback to standard Accordeon (useful for testing or non-WebGL environments).
   * @default false
   */
  forceFallback?: boolean;
}

function MeshAccordeonElevation({ count }: { count: number }) {
  return (
    <Box className="mesh_accordeon_elevation" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <Box
          key={index}
          className="mesh_accordeon_elevation_panel"
          data-panel-index={index}
          data-crease-even={index % 2 === 0 ? 'true' : 'false'}
        />
      ))}
    </Box>
  );
}

export function MeshAccordeon(props: MeshAccordeonProps) {
  const {
    isFolded,
    isSupported,
    canvasRef,
    handleToggle,
    handleKeyDown,
    ariaLabel,
  } = useMeshAccordeon(props);

  const panelCount = (props.folds ?? 2) * 2;

  if (!isSupported || props.forceFallback) {
    return (
      <Box className="mesh_accordeon_fallback">
        <Accordeon
          folds={props.folds}
          isFolded={props.isFolded}
          defaultFolded={props.defaultFolded}
          onToggle={props.onToggle}
          ariaLabel={props.ariaLabel}
        >
          {props.children}
        </Accordeon>
      </Box>
    );
  }

  return (
    <Box
      className="mesh_accordeon_root"
      data-folded={isFolded ? 'true' : 'false'}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-expanded={!isFolded}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <Box className="mesh_accordeon_canvas_wrap">
        <Box
          as="canvas"
          ref={canvasRef as never}
          className="mesh_accordeon_canvas"
        />
        <MeshAccordeonElevation count={panelCount} />
      </Box>
    </Box>
  );
}
