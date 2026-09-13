import type {
  HeroTickerProps,
  HeroTickerSize,
  HeroTickerAnimationMode,
  HeroTickerThemeMode,
  ThemeAccentRole,
  FlourishStyle,
} from './HeroTicker.types.ts';

export const DEFAULT_HERO_TICKER_PHRASES: readonly string[] = [
  'revolutionary ideas',
  'limitless experiences',
  'sustainable futures',
  'artistic intelligence',
  'elegant software',
];

export const DEFAULT_HERO_TICKER_PREFIX = 'We craft ';
export const DEFAULT_HERO_TICKER_SUFFIX = ' that inspire.';
export const DEFAULT_HERO_TICKER_ANIMATION_MODE: HeroTickerAnimationMode =
  'cursive-draw';
export const DEFAULT_HERO_TICKER_DRAW_SPEED = 2400;
export const DEFAULT_HERO_TICKER_TYPE_SPEED = 120;
export const DEFAULT_HERO_TICKER_ERASE_SPEED = 50;
export const DEFAULT_HERO_TICKER_PAUSE_DURATION = 2600;

export const THEME_ACCENT_VARS: Record<ThemeAccentRole, string> = {
  primary: 'var(--colors-primary)',
  secondary: 'var(--colors-secondary)',
  tertiary: 'var(--colors-tertiary)',
  error: 'var(--colors-error)',
};

export const DEFAULT_HERO_TICKER_LABELS = {
  previous: 'Previous slogan phrase',
  next: 'Next slogan phrase',
  pause: 'Pause ticker animation',
  resume: 'Resume ticker animation',
  controlsBar: 'Slogan animation controls',
  jumpToPrefix: 'Jump to phrase: ',
};

export function resolveAccentVar(
  color: ThemeAccentRole = 'primary',
  customVar?: string
): string {
  if (customVar) return customVar;
  return THEME_ACCENT_VARS[color] ?? THEME_ACCENT_VARS.primary;
}

export interface PauseConditions {
  isPausedManually: boolean;
  pauseOnHover: boolean;
  isHovered: boolean;
  pauseOnFocus: boolean;
  isFocused: boolean;
}

export function computeIsPaused(params: PauseConditions): boolean {
  if (params.isPausedManually) return true;
  if (params.pauseOnHover && params.isHovered) return true;
  if (params.pauseOnFocus && params.isFocused) return true;
  return false;
}

export function createTickerInteractionHandlers(
  setIsHovered: (v: boolean) => void,
  setIsFocused: (v: boolean) => void
) {
  return {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsFocused(true),
    onBlur: (e: {
      currentTarget?: { contains: (node: Node | null) => boolean };
      relatedTarget?: unknown;
    }) => {
      if (!e.currentTarget?.contains(e.relatedTarget as Node | null)) {
        setIsFocused(false);
      }
    },
  };
}

export const FLOURISH_PATHS: Record<'swoosh' | 'wave' | 'loop', string> = {
  swoosh: 'M 0 12 Q 100 24 200 12',
  wave: 'M 0 14 Q 50 4 100 14 T 200 14',
  loop: 'M 0 16 Q 80 20 120 10 C 140 0 150 20 130 20 Q 80 20 200 14',
};

export function calculateFlourishOffset(
  phase: 'drawing' | 'paused' | 'erasing',
  flourishProgress: number
): number {
  if (phase === 'drawing') return 200 * (1 - flourishProgress / 100);
  if (phase === 'erasing') return 200 * (flourishProgress / 100);
  return 0;
}

export function applyFlourishOffset(
  el: HTMLDivElement | null,
  dashOffset: number
): void {
  el?.style.setProperty('--ticker-flourish-offset', String(dashOffset));
}

export interface CursiveStyleSyncOptions {
  clipProg: number;
  isFade: boolean;
  fadeOpacity: number;
}

export function syncCursiveStyle(
  el: HTMLSpanElement | null,
  options: CursiveStyleSyncOptions
): void {
  if (!el) return;
  el.style.setProperty('--ticker-clip-prog', `${options.clipProg}%`);
  el.style.setProperty(
    '--ticker-fade-opacity',
    String(options.isFade ? options.fadeOpacity : 1)
  );
}

export function syncWrapperWidth(
  wrapperEl: HTMLSpanElement | null,
  width: number
): void {
  if (!wrapperEl || width <= 0) return;
  wrapperEl.style.setProperty('--ticker-word-width', `${width}px`);
  wrapperEl.setAttribute('data-transition-width', 'true');
}

export function getNextIndex(prev: number, len: number): number {
  return (prev + 1) % len;
}

export function getPrevIndex(prev: number, len: number): number {
  return (prev - 1 + len) % len;
}

export function incrementChars(c: number): number {
  return c + 1;
}

export function decrementChars(c: number): number {
  return c - 1;
}

export interface CurrentProgressOptions {
  mode: HeroTickerAnimationMode;
  drawProgress: number;
  typeCharsCount: number;
  phraseLength: number;
}

export function calculateCurrentProgress(opts: CurrentProgressOptions): number {
  if (opts.mode === 'cursive-draw') return opts.drawProgress;
  if (opts.mode === 'cursive-type') {
    return opts.phraseLength > 0
      ? (opts.typeCharsCount / opts.phraseLength) * 100
      : 0;
  }
  return 100;
}

export interface ResolvedHeroTickerConfig {
  prefix: string;
  phrases: string[];
  suffix: string;
  animationMode: HeroTickerAnimationMode;
  accentColor: ThemeAccentRole;
  accentVar: string;
  flourish: FlourishStyle;
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  size: HeroTickerSize;
  drawSpeed: number;
  typeSpeed: number;
  eraseSpeed: number;
  pauseDuration: number;
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
  showControls: boolean;
  showNib: boolean;
  align: 'center' | 'left' | 'right';
  glow: boolean;
  testId: string;
  mode: HeroTickerThemeMode;
}

export function resolveHeroTickerDark(
  mode: HeroTickerThemeMode = 'auto',
  isContextDark = false
): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return isContextDark;
}

export function resolvePhrasesList(phrases?: string[]): string[] {
  if (Array.isArray(phrases) && phrases.length > 0) {
    return [...phrases];
  }
  return [...DEFAULT_HERO_TICKER_PHRASES];
}

export function resolveNibVisibility(
  showNib?: boolean,
  showQuill?: boolean
): boolean {
  if (showQuill !== undefined) return showQuill;
  if (showNib !== undefined) return showNib;
  return true;
}

export function resolveTestId(props: HeroTickerProps): string {
  return props.dataTestId ?? props['data-testid'] ?? 'hero-ticker';
}

function resolveTimingConfig(props: HeroTickerProps) {
  return {
    drawSpeed: props.drawSpeed ?? DEFAULT_HERO_TICKER_DRAW_SPEED,
    typeSpeed: props.typeSpeed ?? DEFAULT_HERO_TICKER_TYPE_SPEED,
    eraseSpeed: props.eraseSpeed ?? DEFAULT_HERO_TICKER_ERASE_SPEED,
    pauseDuration: props.pauseDuration ?? DEFAULT_HERO_TICKER_PAUSE_DURATION,
  };
}

function resolveBehaviorConfig(props: HeroTickerProps) {
  return {
    pauseOnHover: props.pauseOnHover ?? true,
    pauseOnFocus: props.pauseOnFocus ?? true,
    showControls: props.showControls ?? false,
    align: props.align ?? 'center',
    mode: props.mode ?? 'auto',
  };
}

function resolvePresentationConfig(props: HeroTickerProps) {
  return {
    prefix: props.prefix ?? DEFAULT_HERO_TICKER_PREFIX,
    suffix: props.suffix ?? DEFAULT_HERO_TICKER_SUFFIX,
    animationMode: props.animationMode ?? DEFAULT_HERO_TICKER_ANIMATION_MODE,
    flourish: props.flourish ?? 'swoosh',
    as: props.as ?? 'h1',
    size: props.size ?? 'large',
    glow: props.glow ?? false,
  };
}

export function resolveHeroTickerConfig(
  props: HeroTickerProps
): ResolvedHeroTickerConfig {
  const accentColor = props.accentColor ?? 'primary';
  const phrases = resolvePhrasesList(props.phrases);
  const showNib = resolveNibVisibility(props.showNib, props.showQuill);
  const accentVar = resolveAccentVar(accentColor, props.accentVar);

  const timing = resolveTimingConfig(props);
  const behavior = resolveBehaviorConfig(props);
  const presentation = resolvePresentationConfig(props);

  return {
    ...presentation,
    ...timing,
    ...behavior,
    phrases,
    accentColor,
    accentVar,
    showNib,
    testId: resolveTestId(props),
  };
}
