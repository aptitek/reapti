import { useEffect, type RefObject } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';
import { DEFAULT_3D_CONFIG } from './mapHelpers.ts';

export interface UseMap3DTransitionOptions {
  autoTransitionTo3D?: boolean;
  transitionDelayMs?: number;
  transitionDurationMs?: number;
  targetPitch?: number;
  targetBearing?: number;
}

export interface TransitionMapTarget {
  getMap?: () => {
    easeTo?: (options: {
      pitch: number;
      bearing: number;
      duration: number;
    }) => void;
    getPitch?: () => number;
    getContainer?: () => HTMLElement;
    on?: (event: string, cb: () => void) => void;
    off?: (event: string, cb: () => void) => void;
  } | null;
  getPitch?: () => number;
  getContainer?: () => HTMLElement;
  on?: (event: string, cb: () => void) => void;
  off?: (event: string, cb: () => void) => void;
}

export function calculatePitchFactor(pitch = 0): number {
  return Math.min(Math.max(pitch / 50, 0), 1);
}

function resolveTargetMap(target?: TransitionMapTarget | null) {
  if (!target) return undefined;
  if (typeof target.getMap === 'function') {
    return target.getMap();
  }
  return target;
}

function applyPitchVariable(
  element: HTMLElement | null | undefined,
  factorStr: string
): void {
  if (!element) return;
  element.style.setProperty('--map-pitch-factor', factorStr);
  element.parentElement?.style.setProperty('--map-pitch-factor', factorStr);
}

export function syncMapPitchFactor(
  mapTarget?: TransitionMapTarget | null,
  containerElement?: HTMLElement | null
): void {
  const map = resolveTargetMap(mapTarget);
  if (!map?.getPitch) return;
  const factorStr = calculatePitchFactor(map.getPitch()).toFixed(3);
  const container = containerElement ?? map.getContainer?.();
  applyPitchVariable(container, factorStr);
}

export function execute3DTransition(
  mapRef: { current: TransitionMapTarget | null },
  options: UseMap3DTransitionOptions = {}
): (() => void) | undefined {
  const autoTransition = options.autoTransitionTo3D ?? true;
  if (!autoTransition) return undefined;

  const delay =
    options.transitionDelayMs ?? DEFAULT_3D_CONFIG.transitionDelayMs;
  const duration =
    options.transitionDurationMs ?? DEFAULT_3D_CONFIG.transitionDurationMs;
  const pitch = options.targetPitch ?? DEFAULT_3D_CONFIG.targetPitch;
  const bearing = options.targetBearing ?? DEFAULT_3D_CONFIG.targetBearing;

  const timer = setTimeout(() => {
    const map = mapRef.current?.getMap?.();
    if (!map || typeof map.easeTo !== 'function') return;

    map.easeTo({
      pitch,
      bearing,
      duration,
    });
  }, delay);

  return () => {
    clearTimeout(timer);
  };
}

export function attachMap3DTransition(
  mapRef: { current: TransitionMapTarget | null },
  options: UseMap3DTransitionOptions = {}
): (() => void) | undefined {
  const unbind = execute3DTransition(mapRef, options);
  const target = mapRef.current;
  const map = resolveTargetMap(target);

  if (map?.on && map?.off) {
    const onPitch = () => syncMapPitchFactor(map);
    map.on('pitch', onPitch);
    map.on('render', onPitch);
    onPitch();
    return () => {
      unbind?.();
      map.off?.('pitch', onPitch);
      map.off?.('render', onPitch);
    };
  }

  return unbind;
}

export function useMap3DTransition(
  mapRef: RefObject<MapRef | null>,
  options: UseMap3DTransitionOptions = {}
): void {
  const {
    autoTransitionTo3D,
    transitionDelayMs,
    transitionDurationMs,
    targetPitch,
    targetBearing,
  } = options;

  useEffect(
    () =>
      attachMap3DTransition(mapRef, {
        autoTransitionTo3D,
        transitionDelayMs,
        transitionDurationMs,
        targetPitch,
        targetBearing,
      }),
    [
      autoTransitionTo3D,
      transitionDelayMs,
      transitionDurationMs,
      targetPitch,
      targetBearing,
      mapRef,
    ]
  );
}
