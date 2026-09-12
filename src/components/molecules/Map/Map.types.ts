import type { ReactNode } from 'react';
import type {
  MapProps as ReactMapGLProps,
  MapRef,
} from 'react-map-gl/maplibre';
import type {
  MapPinChipVariant,
  MapPinIconVariant,
  MapPinAlignment,
  MapPinAnchor,
} from '../../atoms/MapPin/MapPin.types.ts';

export type { MapRef };

export interface MapPinItem {
  id?: string;
  longitude: number;
  latitude: number;
  label?: ReactNode;
  color?: string;
  icon?: string;
  iconVariant?: MapPinIconVariant;
  chipVariant?: MapPinChipVariant;
  billboard?: boolean;
  pitchAlignment?: MapPinAlignment;
  rotationAlignment?: MapPinAlignment;
  anchor?: MapPinAnchor;
  showRadar?: boolean;
  showShadow?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onChipClick?: () => void;
  ariaLabel?: string;
  dataTestId?: string;
}

export interface MapProps extends ReactMapGLProps {
  /** Additional CSS class names */
  className?: string;
  /** Single pin configuration */
  pin?: MapPinItem;
  /** List of pin markers to render on the map */
  pins?: readonly MapPinItem[];
  /** Convenience label for default center pin */
  pinLabel?: ReactNode;
  /** Convenience color for default center pin */
  pinColor?: string;
  /** Convenience icon for default center pin */
  pinIcon?: string;
  /** Convenience accessible label for default center pin */
  pinAriaLabel?: string;
  /** Whether the center pin is shown (default: true if pin or pinLabel is supplied) */
  showPin?: boolean;
  /** Whether 3D extruded buildings are enabled (default: true) */
  enable3DBuildings?: boolean;
  /** Whether to automatically animate the map from 2D to an angled 3D view after a delay (default: true) */
  autoTransitionTo3D?: boolean;
  /** Delay in milliseconds before initiating the 3D transition (default: 2000) */
  transitionDelayMs?: number;
  /** Duration in milliseconds of the 3D tilt animation (default: 2500) */
  transitionDurationMs?: number;
  /** Target pitch angle in degrees for the 3D view (default: 55) */
  targetPitch?: number;
  /** Target bearing angle in degrees for the 3D view (default: -20) */
  targetBearing?: number;
  /** Test identifier attribute */
  dataTestId?: string;
  /** Loading state displaying MD3 skeleton */
  isLoading?: boolean;
}
