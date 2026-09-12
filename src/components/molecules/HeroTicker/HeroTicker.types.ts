export type HeroTickerSize = 'small' | 'medium' | 'large';

export type HeroTickerAnimationMode = 'cursive-draw' | 'cursive-type' | 'fade';

export type ThemeAccentRole = 'primary' | 'secondary' | 'tertiary' | 'error';

export type FlourishStyle = 'swoosh' | 'wave' | 'glow-line' | 'none';

export interface DrawAnimationOptions {
  enabled: boolean;
  phase: 'drawing' | 'paused' | 'erasing';
  drawSpeed: number;
  pauseDuration: number;
  isPaused: boolean;
  onDrawComplete: () => void;
  onPauseComplete: () => void;
  onEraseComplete: () => void;
}

export interface TypeAnimationOptions {
  enabled: boolean;
  phase: 'drawing' | 'paused' | 'erasing';
  phraseLength: number;
  typeSpeed: number;
  eraseSpeed: number;
  pauseDuration: number;
  isPaused: boolean;
  onTypeComplete: () => void;
  onPauseComplete: () => void;
  onEraseComplete: () => void;
}

export interface FadeAnimationOptions {
  enabled: boolean;
  phase: 'drawing' | 'paused' | 'erasing';
  pauseDuration: number;
  isPaused: boolean;
  onFadeInComplete: () => void;
  onPauseComplete: () => void;
  onFadeOutComplete: () => void;
}

export interface HeroTickerProps {
  /** Slogan prefix rendered before the cursive text. */
  prefix?: string;

  /** List of phrases to cycle through, rendered in Milkshake cursive font. */
  phrases?: string[];

  /** Slogan suffix rendered after the cursive text. */
  suffix?: string;

  /** Animation mode: 'cursive-draw', 'cursive-type', or 'fade'. Defaults to 'cursive-draw'. */
  animationMode?: HeroTickerAnimationMode;

  /** Semantic theme accent role used for cursive ink, flourish, and controls. Defaults to 'primary'. */
  accentColor?: ThemeAccentRole;

  /** Custom CSS color string or variable overriding the theme accent. */
  accentVar?: string;

  /** Flourish underline decoration style. Defaults to 'swoosh'. */
  flourish?: FlourishStyle;

  /** HTML semantic heading tag to render. Defaults to 'h1'. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';

  /** Visual scale preset. Defaults to 'large'. */
  size?: HeroTickerSize;

  /** Total duration in ms to complete one draw cycle. Defaults to 2400ms for graceful cursive drawing. */
  drawSpeed?: number;

  /** Character typing delay in ms for typewriter mode. Defaults to 120ms for deliberate keystrokes. */
  typeSpeed?: number;

  /** Character erasing delay in ms for typewriter mode. Defaults to 50ms. */
  eraseSpeed?: number;

  /** Pause duration in ms between phrases. Defaults to 2600ms. */
  pauseDuration?: number;

  /** Whether to pause cycling on hover. Defaults to true. */
  pauseOnHover?: boolean;

  /** Whether to pause cycling when focused (WCAG 2.2.2). Defaults to true. */
  pauseOnFocus?: boolean;

  /** Whether to render manual playback and phrase navigation controls. Defaults to false. */
  showControls?: boolean;

  /** Whether to display the animated calligraphy quill nib. Defaults to true. */
  showNib?: boolean;

  /** Alias for showNib. Defaults to true. */
  showQuill?: boolean;

  /** Whether to display a luminous glow aura around the cursive letters. Defaults to false. */
  glow?: boolean;

  /** Text alignment within container. Defaults to 'center'. */
  align?: 'center' | 'left' | 'right';

  /** Callback fired whenever the active phrase transitions. */
  onPhraseChange?: (index: number, phrase: string) => void;

  /** Optional custom CSS class name applied to container. */
  className?: string;

  /** Data-testid for testing. Defaults to 'hero-ticker'. */
  'data-testid'?: string;
  dataTestId?: string;
}
