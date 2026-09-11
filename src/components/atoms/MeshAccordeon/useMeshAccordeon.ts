import { useState, useRef, useEffect, useCallback } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import {
  MeshAccordeonRenderer,
  isWebGLSupported,
} from './meshAccordeonRenderer.ts';
import { md3Tokens } from '../../../tokens/md3.ts';

export interface UseMeshAccordeonProps {
  folds?: number;
  isFolded?: boolean;
  defaultFolded?: boolean;
  onToggle?: (isFolded: boolean) => void;
  ariaLabel?: string;
  depth?: number;
  radius?: number;
  segments?: number;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export interface AnimationState {
  currentProgress: number;
  targetProgress: number;
  startProgress: number;
  startTime: number;
  duration: number;
}

export function stepMeshAnimation(
  anim: AnimationState,
  now: number,
  renderer: MeshAccordeonRenderer | null
): boolean {
  const elapsed = Math.min(
    1,
    (now - anim.startTime) / Math.max(1, anim.duration)
  );
  const eased = easeOutCubic(elapsed);
  anim.currentProgress =
    anim.startProgress + (anim.targetProgress - anim.startProgress) * eased;

  if (renderer) {
    renderer.setFoldProgress(anim.currentProgress);
    renderer.render();
  }

  return elapsed >= 1;
}

export function handleMeshResize(
  renderer: MeshAccordeonRenderer | null,
  width: number,
  height: number
): void {
  if (!renderer || width <= 0 || height <= 0) return;
  renderer.resize(width, height);
  renderer.render();
}

export function createMeshLifecycle(
  canvas: HTMLCanvasElement | null,
  rendererRef: RefObject<MeshAccordeonRenderer | null>,
  options: {
    folds?: number;
    depth?: number;
    radius?: number;
    segments?: number;
  }
): () => void {
  if (!canvas) return () => {};

  const renderer = new MeshAccordeonRenderer({
    canvas,
    folds: options.folds,
    depth: options.depth,
    radius: options.radius,
    segments: options.segments,
  });
  rendererRef.current = renderer;

  const target = canvas.parentElement ?? canvas;
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      handleMeshResize(renderer, width, height);
    }
  });
  ro.observe(target);

  return () => {
    ro.disconnect();
    renderer.destroy();
    rendererRef.current = null;
  };
}

export function scheduleMeshRaf(cb: FrameRequestCallback): number {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(cb);
  }
  return setTimeout(cb, 16) as unknown as number;
}

export function cancelMeshRaf(id: number): void {
  if (typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(id);
    return;
  }
  clearTimeout(id);
}

export function createMeshAnimation(
  animRef: RefObject<AnimationState>,
  rendererRef: RefObject<MeshAccordeonRenderer | null>,
  target: number
): () => void {
  const anim = animRef.current;
  if (!anim) return () => {};

  anim.startProgress = anim.currentProgress;
  anim.targetProgress = target;
  anim.startTime = performance.now();

  let rafId = 0;
  const tick = (now: number) => {
    const isFinished = stepMeshAnimation(anim, now, rendererRef.current);
    if (!isFinished) {
      rafId = scheduleMeshRaf(tick);
    }
  };

  rafId = scheduleMeshRaf(tick);
  return () => cancelMeshRaf(rafId);
}

export function useMeshAccordeon(props: UseMeshAccordeonProps) {
  const isControlled = props.isFolded !== undefined;
  const [internalFolded, setInternalFolded] = useState(
    props.defaultFolded ?? false
  );
  const isFolded = isControlled ? props.isFolded! : internalFolded;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<MeshAccordeonRenderer | null>(null);
  const [isSupported] = useState(() => isWebGLSupported());

  const animRef = useRef<AnimationState>({
    currentProgress: isFolded ? 1.0 : 0.0,
    targetProgress: isFolded ? 1.0 : 0.0,
    startProgress: isFolded ? 1.0 : 0.0,
    startTime: 0,
    duration: Number.parseInt(md3Tokens.durations.long4.value, 10),
  });

  const initLifecycle = useCallback(() => {
    return createMeshLifecycle(canvasRef.current, rendererRef, {
      folds: props.folds,
      depth: props.depth,
      radius: props.radius,
      segments: props.segments,
    });
  }, [
    canvasRef,
    rendererRef,
    props.folds,
    props.depth,
    props.radius,
    props.segments,
  ]);

  const startAnimation = useCallback(() => {
    return createMeshAnimation(animRef, rendererRef, isFolded ? 1.0 : 0.0);
  }, [animRef, rendererRef, isFolded]);

  useEffect(initLifecycle, [initLifecycle]);
  useEffect(startAnimation, [startAnimation]);

  const handleToggle = useCallback(() => {
    const next = !isFolded;
    if (!isControlled) {
      setInternalFolded(next);
    }
    props.onToggle?.(next);
  }, [isFolded, isControlled, props]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  return {
    isFolded,
    isSupported,
    canvasRef,
    rendererRef,
    handleToggle,
    handleKeyDown,
    initLifecycle,
    startAnimation,
    ariaLabel: props.ariaLabel ?? '3D Foldable Mesh Accordion',
  };
}
