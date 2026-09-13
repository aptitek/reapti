import { useState, forwardRef } from 'react';
import { Box } from 'styled-system/jsx';
import './heroTicker.css';
import type { HeroTickerProps } from './HeroTicker.types.ts';
import {
  resolveHeroTickerConfig,
  computeIsPaused,
  createTickerInteractionHandlers,
  calculateCurrentProgress,
  type ResolvedHeroTickerConfig,
} from './heroTickerHelpers.ts';
import {
  useTickerState,
  usePrefersReducedMotion,
  useDrawAnimation,
  useTypeAnimation,
  useFadeAnimation,
  useVisibleText,
} from './useHeroTickerAnimation.ts';
import { HeroTickerDisplay } from './HeroTickerDisplay.tsx';
import { HeroTickerControls } from './HeroTickerControls.tsx';
import { useHeroTickerTheme } from './useHeroTickerTheme.ts';

interface AnimationProgressParams {
  config: ResolvedHeroTickerConfig;
  phase: 'drawing' | 'paused' | 'erasing';
  currentPhrase: string;
  isPaused: boolean;
  prefersReducedMotion: boolean;
  onDrawComplete: () => void;
  onPauseComplete: () => void;
  onEraseComplete: () => void;
}

function useAnimationProgress(p: AnimationProgressParams) {
  const isDraw =
    p.config.animationMode === 'cursive-draw' && !p.prefersReducedMotion;
  const isType =
    p.config.animationMode === 'cursive-type' && !p.prefersReducedMotion;
  const isFade = p.config.animationMode === 'fade' && !p.prefersReducedMotion;

  const drawProgress = useDrawAnimation({
    enabled: isDraw,
    phase: p.phase,
    drawSpeed: p.config.drawSpeed,
    pauseDuration: p.config.pauseDuration,
    isPaused: p.isPaused,
    onDrawComplete: p.onDrawComplete,
    onPauseComplete: p.onPauseComplete,
    onEraseComplete: p.onEraseComplete,
  });

  const typeCharsCount = useTypeAnimation({
    enabled: isType,
    phase: p.phase,
    phraseLength: p.currentPhrase.length,
    typeSpeed: p.config.typeSpeed,
    eraseSpeed: p.config.eraseSpeed,
    pauseDuration: p.config.pauseDuration,
    isPaused: p.isPaused,
    onTypeComplete: p.onDrawComplete,
    onPauseComplete: p.onPauseComplete,
    onEraseComplete: p.onEraseComplete,
  });

  const fadeOpacity = useFadeAnimation({
    enabled: isFade,
    phase: p.phase,
    pauseDuration: p.config.pauseDuration,
    isPaused: p.isPaused,
    onFadeInComplete: p.onDrawComplete,
    onPauseComplete: p.onPauseComplete,
    onFadeOutComplete: p.onEraseComplete,
  });

  return { drawProgress, typeCharsCount, fadeOpacity };
}

interface HeroTickerDerivedParams {
  config: ResolvedHeroTickerConfig;
  state: ReturnType<typeof useTickerState>;
  isFocused: boolean;
  prefersReducedMotion: boolean;
}

function useHeroTickerDerived(p: HeroTickerDerivedParams) {
  const isPaused = computeIsPaused({
    isPausedManually: p.state.isPausedManually,
    pauseOnHover: p.config.pauseOnHover,
    isHovered: p.state.isHovered,
    pauseOnFocus: p.config.pauseOnFocus,
    isFocused: p.isFocused,
  });

  const currentPhrase = p.config.phrases[p.state.currentIndex] ?? '';
  const anim = useAnimationProgress({
    config: p.config,
    phase: p.state.phase,
    currentPhrase,
    isPaused,
    prefersReducedMotion: p.prefersReducedMotion,
    onDrawComplete: p.state.onDrawComplete,
    onPauseComplete: p.state.onPauseComplete,
    onEraseComplete: p.state.goToNext,
  });

  const visibleText = useVisibleText(
    p.config.animationMode,
    currentPhrase,
    anim.typeCharsCount,
    p.prefersReducedMotion
  );

  const currentProgress = calculateCurrentProgress({
    mode: p.config.animationMode,
    drawProgress: anim.drawProgress,
    typeCharsCount: anim.typeCharsCount,
    phraseLength: currentPhrase.length,
  });

  const fullSlogan = `${p.config.prefix}${currentPhrase}${p.config.suffix}`;
  return { currentPhrase, anim, visibleText, currentProgress, fullSlogan };
}

export const HeroTicker = forwardRef<HTMLDivElement, HeroTickerProps>(
  (props, ref) => {
    const config = resolveHeroTickerConfig(props);
    const state = useTickerState(config.phrases, props.onPhraseChange);
    const prefersReducedMotion = usePrefersReducedMotion();
    const isDark = useHeroTickerTheme(config.mode);
    const [isFocused, setIsFocused] = useState(false);

    const derived = useHeroTickerDerived({
      config,
      state,
      isFocused,
      prefersReducedMotion,
    });
    const handlers = createTickerInteractionHandlers(
      state.setIsHovered,
      setIsFocused
    );

    const themeClass = isDark ? 'dark' : 'light';
    const rootClass =
      `hero-ticker_root ${themeClass} ${props.className ?? ''}`.trim();

    return (
      <Box
        ref={ref}
        data-testid={config.testId}
        data-align={config.align}
        data-accent={config.accentColor}
        data-mode={isDark ? 'dark' : 'light'}
        className={rootClass}
        {...handlers}
      >
        <HeroTickerDisplay
          as={config.as}
          size={config.size}
          prefix={config.prefix}
          suffix={config.suffix}
          visibleText={derived.visibleText}
          fullSloganText={derived.fullSlogan}
          currentPhrase={derived.currentPhrase}
          animationMode={config.animationMode}
          drawProgress={derived.anim.drawProgress}
          currentProgress={derived.currentProgress}
          fadeOpacity={derived.anim.fadeOpacity}
          isDrawing={state.phase === 'drawing'}
          showNib={config.showNib}
          flourish={config.flourish}
          accentVar={config.accentVar}
          glow={config.glow}
        />

        {config.showControls && (
          <HeroTickerControls
            phrases={config.phrases}
            currentIndex={state.currentIndex}
            isPaused={state.isPausedManually}
            onPrev={state.goToPrev}
            onNext={state.goToNext}
            onTogglePause={state.togglePause}
            onSelectIndex={state.goToIndex}
          />
        )}
      </Box>
    );
  }
);

HeroTicker.displayName = 'HeroTicker';
