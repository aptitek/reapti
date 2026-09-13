import type { Point2D } from './SeasonBackground.types.ts';

export interface CanopyMetrics {
  center: Point2D;
  radiusX: number;
  radiusY: number;
}

interface MetricRatios {
  rX: number;
  rY: number;
  cX?: number;
  cY?: number;
}

function getElementCanopyMetrics(
  el: Element | null,
  containerRect: DOMRect,
  ratios: MetricRatios
): CanopyMetrics | null {
  if (!el || typeof el.getBoundingClientRect !== 'function') return null;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 10 || rect.height <= 10) return null;
  const cX = ratios.cX ?? 0.5;
  const cY = ratios.cY ?? 0.5;
  return {
    center: {
      x: rect.left - containerRect.left + rect.width * cX,
      y: rect.top - containerRect.top + rect.height * cY,
    },
    radiusX: rect.width * ratios.rX,
    radiusY: rect.height * ratios.rY,
  };
}

export function getDomCanopyMetrics(
  container: HTMLElement
): CanopyMetrics | null {
  if (typeof container.getBoundingClientRect !== 'function') return null;
  const containerRect = container.getBoundingClientRect();

  const canopyMetrics = getElementCanopyMetrics(
    container.querySelector('.tree-swaying-canopy'),
    containerRect,
    { rX: 0.38, rY: 0.32 }
  );
  if (canopyMetrics) return canopyMetrics;

  return getElementCanopyMetrics(
    container.querySelector('#peacefulTreeContainer'),
    containerRect,
    { rX: 0.32, rY: 0.16, cX: 0.49, cY: 0.3 }
  );
}

export function resolveSkySpace(
  skySpace?: string | number
): string | undefined {
  if (skySpace === undefined || skySpace === null || skySpace === '') {
    return undefined;
  }
  if (typeof skySpace === 'number') {
    if (skySpace > 0 && skySpace <= 1) {
      return `${skySpace * 100}%`;
    }
    return `${skySpace}px`;
  }
  return String(skySpace);
}

export interface CanopyMetricOptions {
  container?: HTMLElement | null;
  skySpace?: string | number;
}

function resolveMetricOptions(
  target?: HTMLElement | null | CanopyMetricOptions
): CanopyMetricOptions {
  if (!target) return {};
  if (
    'querySelector' in target ||
    'getBoundingClientRect' in target ||
    'nodeType' in target
  ) {
    return { container: target as HTMLElement };
  }
  return target as CanopyMetricOptions;
}

export function parseSkySpaceToPixels(
  skySpace: string | number | undefined,
  height: number
): number {
  if (typeof skySpace === 'number') {
    return skySpace > 0 && skySpace <= 1 ? height * skySpace : skySpace;
  }
  if (typeof skySpace === 'string') {
    const trimmed = skySpace.trim();
    if (trimmed.endsWith('%')) {
      return height * (parseFloat(trimmed) / 100 || 0.16);
    }
    const val = parseFloat(trimmed);
    return Number.isFinite(val) ? val : height * 0.16;
  }
  return height * 0.16;
}

export function getCssFallbackCanopyMetrics(
  width: number,
  height: number,
  skySpace?: string | number
): CanopyMetrics {
  const isWide = width >= 900;
  const left = isWide ? width * 0.01 : width * 0.02;
  const skyPixels = parseSkySpaceToPixels(skySpace, height);
  const maxAvailableH = Math.max(height - skyPixels, 100);
  const hTree = Math.min(maxAvailableH, 820);
  const wTree = hTree * (5 / 6);
  const wMax = Math.min(width * 0.52, 680);
  const treeH = wTree > wMax ? wMax * (6 / 5) : hTree;
  const treeW = treeH * (5 / 6);
  return {
    center: {
      x: left + treeW * 0.49,
      y: height - treeH + treeH * 0.3,
    },
    radiusX: treeW * 0.32,
    radiusY: treeH * 0.16,
  };
}

export function getCanopyMetrics(
  width: number,
  height: number,
  target?: HTMLElement | null | CanopyMetricOptions
): CanopyMetrics {
  const options = resolveMetricOptions(target);
  if (options.container) {
    const dom = getDomCanopyMetrics(options.container);
    if (dom) return dom;
  }
  return getCssFallbackCanopyMetrics(width, height, options.skySpace);
}

export function calculateCanopyOrigin(
  width: number,
  height: number,
  target?: HTMLElement | null | CanopyMetricOptions
): Point2D {
  const metrics = getCanopyMetrics(width, height, target);
  const angle = Math.random() * Math.PI * 2;
  const radialRatio = Math.sqrt(Math.random()) * 0.72;
  return {
    x: metrics.center.x + Math.cos(angle) * metrics.radiusX * radialRatio,
    y: metrics.center.y + Math.sin(angle) * metrics.radiusY * radialRatio,
  };
}

export function getCanopyCenter(
  width: number,
  height: number,
  target?: HTMLElement | null | CanopyMetricOptions
): Point2D {
  return getCanopyMetrics(width, height, target).center;
}
