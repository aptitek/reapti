import { useRef, useEffect, type FC, type Ref, type RefObject } from 'react';
import { Box } from 'styled-system/jsx';
import type {
  HeroTickerSize,
  HeroTickerAnimationMode,
  FlourishStyle,
} from './HeroTicker.types.ts';
import { HeroTickerNib } from './HeroTickerNib.tsx';
import { HeroTickerFlourish } from './HeroTickerFlourish.tsx';
import { syncCursiveStyle, syncWrapperWidth } from './heroTickerHelpers.ts';

export interface HeroTickerDisplayProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  size: HeroTickerSize;
  prefix: string;
  suffix: string;
  visibleText: string;
  fullSloganText: string;
  currentPhrase?: string;
  animationMode?: HeroTickerAnimationMode;
  drawProgress: number;
  currentProgress: number;
  fadeOpacity: number;
  isDrawing: boolean;
  showNib: boolean;
  flourish: FlourishStyle;
  accentVar: string;
  glow?: boolean;
  wrapperRef?: RefObject<HTMLSpanElement | null>;
  cursiveRef?: RefObject<HTMLSpanElement | null>;
}

function renderLiveRegion(fullSloganText: string) {
  return (
    <Box
      as="span"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="hero-ticker_sr-only"
    >
      {fullSloganText}
    </Box>
  );
}

interface CursiveEffectParams {
  cursiveRef: RefObject<HTMLSpanElement | null>;
  clipProg: number;
  isFade: boolean;
  fadeOpacity: number;
}

function useCursiveEffect(p: CursiveEffectParams) {
  useEffect(() => {
    syncCursiveStyle(p.cursiveRef.current, {
      clipProg: p.clipProg,
      isFade: p.isFade,
      fadeOpacity: p.fadeOpacity,
    });
  }, [p.clipProg, p.isFade, p.fadeOpacity, p.cursiveRef]);
}

interface WordWrapperWidthParams {
  wrapperRef: RefObject<HTMLSpanElement | null>;
  cursiveRef: RefObject<HTMLSpanElement | null>;
  currentPhrase?: string;
  enabled: boolean;
}

function useWordWrapperWidth(p: WordWrapperWidthParams) {
  const { wrapperRef, cursiveRef, currentPhrase, enabled } = p;

  useEffect(() => {
    const textEl = cursiveRef.current;
    const wrapperEl = wrapperRef.current;
    if (!textEl || !wrapperEl || !enabled) return;

    syncWrapperWidth(wrapperEl, textEl.getBoundingClientRect().width);

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const width =
          entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        syncWrapperWidth(wrapperEl, width);
      }
    });

    observer.observe(textEl);
    return () => observer.disconnect();
  }, [wrapperRef, cursiveRef, currentPhrase, enabled]);
}

interface WordBlockProps {
  wrapperRef: RefObject<HTMLSpanElement | null>;
  cursiveRef: RefObject<HTMLSpanElement | null>;
  isCursiveDraw: boolean;
  visibleText: string;
  currentProgress: number;
  currentPhrase?: string;
  isDrawing: boolean;
  isNibVisible: boolean;
  accentVar: string;
  flourish: FlourishStyle;
  glow: boolean;
}

function renderWordBlock(p: WordBlockProps) {
  return (
    <Box
      as="span"
      ref={p.wrapperRef as unknown as Ref<HTMLDivElement>}
      className="hero-ticker_word-wrapper"
      data-testid="hero-ticker-word-wrapper"
    >
      <Box
        as="span"
        ref={p.cursiveRef as unknown as Ref<HTMLDivElement>}
        className="hero-ticker_cursive-text"
        data-drawing={p.isCursiveDraw ? 'true' : 'false'}
        data-glow={p.glow ? 'true' : 'false'}
        data-testid="hero-ticker-cursive-text"
      >
        {p.visibleText}
      </Box>

      <HeroTickerNib
        progress={p.currentProgress}
        phrase={p.currentPhrase || p.visibleText}
        active={p.isDrawing}
        visible={p.isNibVisible}
        accentVar={p.accentVar}
      />

      <HeroTickerFlourish
        flourishStyle={p.flourish}
        colorVar={p.accentVar}
        progress={p.currentProgress}
        visible={true}
      />
    </Box>
  );
}

function renderAffix(text: string, className: string, testId: string) {
  if (!text) return null;
  return (
    <Box as="span" className={className} data-testid={testId}>
      {text}
    </Box>
  );
}

interface NibVisibilityParams {
  showNib: boolean;
  isFade: boolean;
  isDrawing: boolean;
  progress: number;
}

function resolveNibVisibility(p: NibVisibilityParams): boolean {
  if (!p.showNib || p.isFade) return false;
  return p.isDrawing || p.progress > 0;
}

export const HeroTickerDisplay: FC<HeroTickerDisplayProps> = (props) => {
  const Component = props.as ?? 'h1';
  const animMode = props.animationMode ?? 'cursive-draw';
  const isCursiveDraw = animMode === 'cursive-draw';
  const isFade = animMode === 'fade';
  const clipProg = isCursiveDraw ? props.drawProgress : 100;
  const isNibVisible = resolveNibVisibility({
    showNib: props.showNib,
    isFade,
    isDrawing: props.isDrawing,
    progress: props.currentProgress,
  });

  const internalWrapperRef = useRef<HTMLSpanElement>(null);
  const internalCursiveRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = props.wrapperRef ?? internalWrapperRef;
  const cursiveRef = props.cursiveRef ?? internalCursiveRef;
  useCursiveEffect({
    cursiveRef,
    clipProg,
    isFade,
    fadeOpacity: props.fadeOpacity,
  });
  useWordWrapperWidth({
    wrapperRef,
    cursiveRef,
    currentPhrase: props.currentPhrase,
    enabled: isCursiveDraw || isFade,
  });

  return (
    <Box as={Component} className="hero-ticker_title" data-size={props.size}>
      {renderLiveRegion(props.fullSloganText)}

      <Box as="span" display="contents" aria-hidden="true">
        {renderAffix(props.prefix, 'hero-ticker_prefix', 'hero-ticker-prefix')}

        {renderWordBlock({
          wrapperRef,
          cursiveRef,
          isCursiveDraw,
          visibleText: props.visibleText,
          currentProgress: props.currentProgress,
          currentPhrase: props.currentPhrase,
          isDrawing: props.isDrawing,
          isNibVisible,
          accentVar: props.accentVar,
          flourish: props.flourish,
          glow: props.glow ?? false,
        })}

        {renderAffix(props.suffix, 'hero-ticker_suffix', 'hero-ticker-suffix')}
      </Box>
    </Box>
  );
};
