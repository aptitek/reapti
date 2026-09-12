import type { ReactNode } from 'react';

export type MapPinChipVariant = 'outlined' | 'elevated';

export type MapPinIconVariant = 'outlined' | 'rounded' | 'sharp';

export type MapPinAlignment = 'map' | 'viewport' | 'auto';

export type MapPinAnchor =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface MapPinProps {
  /** Label rendered inside the MD3 Chip above the pin */
  label?: ReactNode;
  /** Primary accent color for the MDI pin icon and radar */
  color?: string;
  /** Name of the Material Design Icon (default: 'location_on') */
  icon?: string;
  /** Icon visual style variant */
  iconVariant?: MapPinIconVariant;
  /** Variant for the MD3 Chip label ('outlined' | 'elevated') */
  chipVariant?: MapPinChipVariant;
  /** Optional longitude coordinate (when supplied, wraps in a Marker) */
  longitude?: number;
  /** Optional latitude coordinate (when supplied, wraps in a Marker) */
  latitude?: number;
  /** Whether the pin renders as a billboard element always facing the screen (default: true) */
  billboard?: boolean;
  /** Marker pitch alignment for 3D map projection (default: 'viewport') */
  pitchAlignment?: MapPinAlignment;
  /** Marker rotation alignment for 3D map rotation (default: 'viewport') */
  rotationAlignment?: MapPinAlignment;
  /** Anchor point relative to the coordinate (default: 'bottom') */
  anchor?: MapPinAnchor;
  /** Callback fired when the entire pin container is clicked */
  onClick?: () => void;
  /** Callback fired when the label chip specifically is clicked */
  onChipClick?: () => void;
  /** Whether to render the pulsing 3D radar ring */
  showRadar?: boolean;
  /** Whether to render the grounded contact shadow */
  showShadow?: boolean;
  /** Whether interactive hover and pointer animations are enabled */
  interactive?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Test identifier attribute */
  dataTestId?: string;
  /** Accessible label for the pin */
  ariaLabel?: string;
  /** Additional children rendered inside the pin container */
  children?: ReactNode;
}
