import { useEffect, useRef, type RefObject } from 'react';
import type {
  MouseState,
  Point2D,
  WindState,
} from './SeasonBackground.types.ts';
import { LeafParticle } from './SeasonLeafRenderer.ts';
import {
  createBreezeStreams,
  type WindBreezeStream,
} from './SeasonWindBreezeStream.ts';
import {
  calculateCanopyOrigin,
  getCanopyMetrics,
} from './seasonCanopyMetrics.ts';
import {
  renderSeasonCanvasFrame,
  stepCanvasPhysics,
} from './seasonCanvasPhysics.ts';

export { computeTargetWindVector } from './seasonCanvasPhysics.ts';

const DEFAULT_STREAM_COUNT = 12;

export interface UseSeasonCanvasOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  leafCount: number;
  windIntensity: number;
  isDarkMode: boolean;
  mouseStateRef: RefObject<MouseState>;
  windStateRef: RefObject<WindState>;
  seasonProgress?: number;
  skySpace?: string | number;
}

interface CanvasAnimationContext {
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  ctx: CanvasRenderingContext2D;
  options: UseSeasonCanvasOptions;
  leaves: LeafParticle[];
  streams: WindBreezeStream[];
}

function startCanvasAnimation(context: CanvasAnimationContext): () => void {
  const { canvas, container, ctx, options, leaves, streams } = context;
  let w = (canvas.width = container.clientWidth || 800);
  let h = (canvas.height = container.clientHeight || 600);
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canopyOpts = { container, skySpace: options.skySpace };
  let cachedCanopy = getCanopyMetrics(w, h, canopyOpts);

  const observer = new ResizeObserver(([entry]) => {
    if (!entry) return;
    w = canvas.width = entry.contentRect.width;
    h = canvas.height = entry.contentRect.height;
    cachedCanopy = getCanopyMetrics(w, h, canopyOpts);
  });
  observer.observe(container);

  let frame = 0;
  let animId = 0;
  function tick() {
    if (options.mouseStateRef.current && options.windStateRef.current) {
      if (++frame % 60 === 0) {
        cachedCanopy = getCanopyMetrics(w, h, canopyOpts);
      }
      stepCanvasPhysics({
        mouseState: options.mouseStateRef.current,
        windState: options.windStateRef.current,
        canopyCenter: cachedCanopy.center,
        windIntensity: options.windIntensity,
      });
      renderSeasonCanvasFrame({
        ctx,
        viewport: { x: w, y: h },
        leaves,
        streams,
        mouseState: options.mouseStateRef.current,
        windState: options.windStateRef.current,
        canopyOrigin: cachedCanopy.center,
        isDarkMode: options.isDarkMode,
        reducedMotion,
        seasonProgress: options.seasonProgress ?? 1.0,
      });
    }
    animId = requestAnimationFrame(tick);
  }
  animId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(animId);
    observer.disconnect();
  };
}

function initLeafParticles(
  count: number,
  viewport: { x: number; y: number },
  canopyOrigin: Point2D
): LeafParticle[] {
  return Array.from(
    { length: count },
    () => new LeafParticle(true, viewport, canopyOrigin)
  );
}

export function useSeasonCanvas(options: UseSeasonCanvasOptions): void {
  const {
    canvasRef,
    containerRef,
    leafCount,
    windIntensity,
    isDarkMode,
    mouseStateRef,
    windStateRef,
    seasonProgress,
    skySpace,
  } = options;
  const leavesRef = useRef<LeafParticle[]>([]);
  const streamsRef = useRef<WindBreezeStream[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;
    const canopyOrigin = calculateCanopyOrigin(w, h, { container, skySpace });
    leavesRef.current = initLeafParticles(
      leafCount,
      { x: w, y: h },
      canopyOrigin
    );
    streamsRef.current = createBreezeStreams(
      DEFAULT_STREAM_COUNT,
      { x: w, y: h },
      windStateRef.current ?? undefined
    );

    return startCanvasAnimation({
      canvas,
      container,
      ctx,
      options,
      leaves: leavesRef.current,
      streams: streamsRef.current,
    });
  }, [
    canvasRef,
    containerRef,
    leafCount,
    windIntensity,
    isDarkMode,
    mouseStateRef,
    windStateRef,
    seasonProgress,
    skySpace,
    options,
  ]);
}
