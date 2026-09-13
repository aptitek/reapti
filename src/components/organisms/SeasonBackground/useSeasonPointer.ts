import { useCallback, useEffect, useState, type RefObject } from 'react';
import type { MouseState, Point2D } from './SeasonBackground.types.ts';
import { calculateParallaxOffset } from './seasonBackgroundHelpers.ts';

export interface UseSeasonPointerOptions {
  interactive: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  mouseStateRef: RefObject<MouseState>;
}

export function useSeasonPointer({
  interactive,
  containerRef,
  mouseStateRef,
}: UseSeasonPointerOptions): Point2D {
  const [parallaxOffset, setParallaxOffset] = useState<Point2D>({ x: 0, y: 0 });

  const updatePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const box = containerRef.current.getBoundingClientRect();
      mouseStateRef.current.targetX = clientX - box.left;
      mouseStateRef.current.targetY = clientY - box.top;
      setParallaxOffset(calculateParallaxOffset(clientX, clientY, box));
    },
    [containerRef, mouseStateRef]
  );

  useEffect(() => {
    if (!interactive || typeof window === 'undefined') return;
    const handleMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [interactive, updatePointer]);

  return parallaxOffset;
}
