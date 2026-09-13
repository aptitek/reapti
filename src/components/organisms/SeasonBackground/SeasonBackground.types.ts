import type { ReactNode, RefObject } from 'react';

export type SeasonThemeMode = 'light' | 'sunset' | 'dark' | 'auto';
export type SeasonVariant = 'spring' | 'summer' | 'fall' | 'autumn' | 'winter';

// Backward compatibility aliases
export type SolarizedThemeMode = SeasonThemeMode;
export type SolarizedSeason = SeasonVariant;

export interface SeasonBackgroundProps {
  /**
   * Optional custom container ref (useful for measurement and testing).
   */
  containerRef?: RefObject<HTMLDivElement | null>;
  /**
   * Visual theme mode: 'light' / 'sunset' (Golden hour with pink sunset gradient & yellow sun),
   * 'dark' (Crescent Night with Aurora), or 'auto' (reads from document/CSS data-theme).
   * @default 'auto'
   */
  mode?: SeasonThemeMode;

  /**
   * Visual season variant:
   * - 'spring': Cherry blossom flowers on the canopy, pink sakura petals in the breeze.
   * - 'summer': Lush green botanical meadow and leaves with golden sun.
   * - 'fall' / 'autumn': Rich fiery orange, amber, and russet foliage and leaves.
   * - 'winter': Snow-capped canopy and hills with drifting snowflakes.
   * @default 'summer'
   */
  season?: SeasonVariant;

  /**
   * Continuous seasonal slider / progress (0.0 to 4.0):
   * - 0.0: Spring (Cherry blossoms)
   * - 1.0: Summer (Lush meadow)
   * - 2.0: Fall / Autumn (Peak vibrant orange)
   * - 3.0: Winter (Pure snow)
   * - (wraps cyclically back to 0.0 Spring)
   * If provided, smoothly blends colors and particle types between seasons.
   */
  seasonProgress?: number;

  /**
   * Whether mouse cursor movement dynamically influences the breeze vector and subtle parallax.
   * @default true
   */
  interactive?: boolean;

  /**
   * Whether to display the peaceful vector tree anchored on the left landscape.
   * @default true
   */
  showTree?: boolean;

  /**
   * Custom clearance/space between the top of the container and the tree canopy.
   * Allows setting extra sky headroom above the tree.
   * Can be specified as a CSS length/percentage string ('24%', '160px', '12vh')
   * or a number (e.g. 140 for 140px, or 0.25 for 25%).
   * @default '16%'
   */
  skySpace?: string | number;

  /**
   * Alias for `skySpace`. Sets the clearance between the container top and the tree canopy.
   */
  treeTopSpacing?: string | number;

  /**
   * Alias for `skySpace`. Sets the clearance between the container top and the tree canopy.
   */
  treeTopSpace?: string | number;

  /**
   * Whether to display the layered rolling hills in the background.
   * @default true
   */
  showHills?: boolean;

  /**
   * Whether to display the celestial body (Sun with pulsating corona in light mode, Crescent Moon with starfield in dark mode).
   * @default true
   */
  showCelestial?: boolean;

  /**
   * Whether to display soft drifting rounded cloud layers.
   * @default true
   */
  showClouds?: boolean;

  /**
   * Whether to display radiant crepuscular sunbeams (godrays) in day/sunset mode.
   * @default true
   */
  showGodrays?: boolean;

  /**
   * Whether to display the luminous undulating northern lights (aurora borealis) in dark mode.
   * @default true
   */
  showAurora?: boolean;

  /**
   * Whether to display foreground grass blades styled for smooth page background transitions.
   * @default true
   */
  showGrass?: boolean;

  /**
   * Number of drifting leaves simulated simultaneously.
   * @default 44
   */
  leafCount?: number;

  /**
   * Multiplier applied to ambient breeze velocity.
   * @default 1.0
   */
  windIntensity?: number;

  /**
   * Foreground content rendered over the peaceful background.
   */
  children?: ReactNode;

  /**
   * Custom CSS class name for the root container.
   */
  className?: string;

  /**
   * Test identifier.
   */
  'data-testid'?: string;
  dataTestId?: string;
}

export type SolarizedBackgroundProps = SeasonBackgroundProps;

export interface LeafColors {
  readonly vein: string;
  readonly leftTop: string;
  readonly leftMid: string;
  readonly leftBottom: string;
  readonly rightTop: string;
  readonly rightMid: string;
  readonly rightBottom: string;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speedX: number;
  speedY: number;
}

export interface WindState {
  baseSpeedX: number;
  baseSpeedY: number;
  currentX: number;
  currentY: number;
  gustBoost: number;
}

export interface SeasonTransitionState {
  fromIndex: number;
  toIndex: number;
  blendFactor: number;
}
