import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type {
  HeroTickerAnimationMode,
  DrawAnimationOptions,
  TypeAnimationOptions,
  FadeAnimationOptions,
} from './HeroTicker.types.ts';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return reduced;
}

import {
  getNextIndex,
  getPrevIndex,
  incrementChars,
  decrementChars,
} from './heroTickerHelpers.ts';

export function useTickerState(
  phrases: string[],
  onPhraseChange?: (index: number, phrase: string) => void
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'drawing' | 'paused' | 'erasing'>(
    'drawing'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);

  useEffect(() => {
    onPhraseChange?.(currentIndex, phrases[currentIndex] || '');
  }, [currentIndex, phrases, onPhraseChange]);

  const goToNext = useCallback(() => {
    setCurrentIndex(getNextIndex(currentIndex, phrases.length));
    setPhase('drawing');
  }, [currentIndex, phrases.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(getPrevIndex(currentIndex, phrases.length));
    setPhase('drawing');
  }, [currentIndex, phrases.length]);

  const goToIndex = useCallback(
    (idx: number) => {
      setCurrentIndex(idx % phrases.length);
      setPhase('drawing');
    },
    [phrases.length]
  );

  const onPauseComplete = useCallback(() => setPhase('erasing'), []);
  const onDrawComplete = useCallback(() => setPhase('paused'), []);
  const togglePause = useCallback(
    () => setIsPausedManually((prev) => !prev),
    []
  );

  return {
    currentIndex,
    phase,
    isHovered,
    isPausedManually,
    setIsHovered,
    setIsPausedManually,
    togglePause,
    goToNext,
    goToPrev,
    goToIndex,
    onPauseComplete,
    onDrawComplete,
  };
}

function scheduleFrame(cb: FrameRequestCallback): number {
  if (typeof requestAnimationFrame !== 'undefined') {
    return requestAnimationFrame(cb);
  }
  return setTimeout(() => cb(Date.now()), 16) as unknown as number;
}

function cancelFrame(id: number) {
  if (typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(id);
    return;
  }
  clearTimeout(id);
}

export function useDrawAnimation(opts: DrawAnimationOptions): number {
  const {
    enabled,
    phase,
    drawSpeed,
    pauseDuration,
    isPaused,
    onDrawComplete,
    onPauseComplete,
    onEraseComplete,
  } = opts;

  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || isPaused) return;

    if (phase === 'paused') {
      const timer = setTimeout(onPauseComplete, pauseDuration);
      return () => clearTimeout(timer);
    }

    let cancelled = false;
    startTimeRef.current = null;
    const isDrawing = phase === 'drawing';
    const duration = isDrawing ? drawSpeed : Math.max(240, drawSpeed * 0.35);

    const step = (ts: number) => {
      if (cancelled) return;
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const current = isDrawing
        ? Math.min(100, (elapsed / duration) * 100)
        : Math.max(0, 100 - (elapsed / duration) * 100);

      setProgress(current);

      const hasMore = isDrawing ? current < 100 : current > 0;
      if (hasMore) {
        animFrameRef.current = scheduleFrame(step);
      } else if (isDrawing) {
        onDrawComplete();
      } else {
        onEraseComplete();
      }
    };

    animFrameRef.current = scheduleFrame(step);
    return () => {
      cancelled = true;
      if (animFrameRef.current) cancelFrame(animFrameRef.current);
    };
  }, [
    enabled,
    phase,
    drawSpeed,
    pauseDuration,
    isPaused,
    onDrawComplete,
    onPauseComplete,
    onEraseComplete,
  ]);

  return progress;
}

export function useTypeAnimation(
  opts: TypeAnimationOptions,
  initialCharsCount = 0
): number {
  const {
    enabled,
    phase,
    phraseLength,
    typeSpeed,
    eraseSpeed,
    pauseDuration,
    isPaused,
    onTypeComplete,
    onPauseComplete,
    onEraseComplete,
  } = opts;

  const [charsCount, setCharsCount] = useState(initialCharsCount);

  useEffect(() => {
    if (!enabled || isPaused) return;

    if (phase === 'paused') {
      const timer = setTimeout(onPauseComplete, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (phase === 'drawing') {
      if (charsCount < phraseLength) {
        const timer = setTimeout(
          () => setCharsCount(incrementChars),
          typeSpeed
        );
        return () => clearTimeout(timer);
      }
      onTypeComplete();
      return;
    }

    if (charsCount > 0) {
      const timer = setTimeout(() => setCharsCount(decrementChars), eraseSpeed);
      return () => clearTimeout(timer);
    }
    onEraseComplete();
  }, [
    enabled,
    phase,
    charsCount,
    phraseLength,
    typeSpeed,
    eraseSpeed,
    pauseDuration,
    isPaused,
    onTypeComplete,
    onPauseComplete,
    onEraseComplete,
  ]);

  return charsCount;
}

export function useFadeAnimation(opts: FadeAnimationOptions): number {
  const {
    enabled,
    phase,
    pauseDuration,
    isPaused,
    onFadeInComplete,
    onPauseComplete,
    onFadeOutComplete,
  } = opts;

  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!enabled || isPaused) return;

    if (phase === 'drawing') {
      const timer = setTimeout(() => {
        setOpacity(1);
        onFadeInComplete();
      }, 350);
      return () => clearTimeout(timer);
    }

    if (phase === 'paused') {
      const timer = setTimeout(onPauseComplete, pauseDuration);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setOpacity(0);
      onFadeOutComplete();
    }, 300);
    return () => clearTimeout(timer);
  }, [
    enabled,
    phase,
    pauseDuration,
    isPaused,
    onFadeInComplete,
    onPauseComplete,
    onFadeOutComplete,
  ]);

  return opacity;
}

export function useVisibleText(
  ...args: [HeroTickerAnimationMode, string, number, boolean]
): string {
  const [mode, phrase, typedChars, reducedMotion] = args;
  return useMemo(() => {
    if (mode === 'cursive-type' && !reducedMotion) {
      return phrase.slice(0, typedChars);
    }
    return phrase;
  }, [mode, phrase, typedChars, reducedMotion]);
}
