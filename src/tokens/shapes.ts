import shapePathsData from './shape-paths.json' with { type: 'json' };

export interface RectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ExpressiveShapeName =
  | '4-leaf-clover'
  | '4-sided-cookie'
  | '6-sided-cookie'
  | '7-sided-cookie'
  | '8-leaf-clover'
  | '9-sided-cookie'
  | '12-sided-cookie'
  | 'arch'
  | 'arrow'
  | 'boom'
  | 'bun'
  | 'burst'
  | 'circle'
  | 'diamond'
  | 'fan'
  | 'flower'
  | 'gem'
  | 'ghost-ish'
  | 'heart'
  | 'hexagon'
  | 'oval'
  | 'pentagon'
  | 'pill'
  | 'pixel-circle'
  | 'pixel-triangle'
  | 'puffy'
  | 'puffy-diamond'
  | 'semicircle'
  | 'slanted'
  | 'soft-boom'
  | 'soft-burst'
  | 'square'
  | 'sunny'
  | 'triangle'
  | 'very-sunny';

export const SHAPE_PATHS: Record<string, string> = shapePathsData;

const BASE_VIEWPORT = 380;

/**
 * Checks whether a given shape name is a recognized M3 expressive shape.
 */
export function isExpressiveShape(
  shape: string | undefined
): shape is ExpressiveShapeName {
  if (!shape) return false;
  return Object.prototype.hasOwnProperty.call(SHAPE_PATHS, shape);
}

/**
 * Normalizes a shape or button shape to an expressive shape name.
 */
export function toExpressiveShape(
  shape: string | undefined
): ExpressiveShapeName {
  if (!shape || shape === 'rounded') return 'pill';
  if (shape === 'square') return 'square';
  return isExpressiveShape(shape) ? shape : 'pill';
}

/**
 * Computes a rounded rectangle SVG path starting from top center and moving clockwise.
 */
export function getRoundedRectPath(bounds: RectBounds, radius: number): string {
  const { x, y, width: w, height: h } = bounds;
  if (w <= 0 || h <= 0) return '';

  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  if (r <= 0) {
    return `M ${x + w / 2} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} L ${x} ${y} Z`;
  }

  const right = x + w;
  const bottom = y + h;

  return [
    `M ${x + w / 2} ${y}`,
    `L ${right - r} ${y}`,
    `A ${r} ${r} 0 0 1 ${right} ${y + r}`,
    `L ${right} ${bottom - r}`,
    `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `L ${x + r} ${bottom}`,
    `A ${r} ${r} 0 0 1 ${x} ${bottom - r}`,
    `L ${x} ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    'Z',
  ].join(' ');
}

function scaleSegment(coordsStr: string, bounds: RectBounds): string {
  const nums = coordsStr
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  const scaled: string[] = [];

  for (let i = 0; i < nums.length; i += 2) {
    if (i + 1 < nums.length) {
      const px = Number(
        ((nums[i]! / BASE_VIEWPORT) * bounds.width + bounds.x).toFixed(2)
      );
      const py = Number(
        ((nums[i + 1]! / BASE_VIEWPORT) * bounds.height + bounds.y).toFixed(2)
      );
      scaled.push(`${px} ${py}`);
    } else {
      scaled.push(String(nums[i]!));
    }
  }

  return scaled.join(' ');
}

/**
 * Scales an M3 Expressive shape path (normalized to 380x380) to target bounds.
 */
export function scaleNormalizedPath(
  pathStr: string,
  bounds: RectBounds
): string {
  return pathStr.replace(
    /([A-DF-Za-df-z])([^A-DF-Za-df-z]*)/g,
    (_, cmd: string, coordsStr: string) => {
      const trimmed = coordsStr.trim();
      if (!trimmed) return cmd;
      return `${cmd}${scaleSegment(trimmed, bounds)}`;
    }
  );
}

export interface ResolveBorderPathOptions {
  shape?: string;
  bounds: RectBounds;
  radius?: number;
}

/**
 * Resolves the perimeter SVG path for a button given its shape, bounds, and corner radius.
 */
export function resolveBorderPath({
  shape,
  bounds,
  radius = 8,
}: ResolveBorderPathOptions): string {
  if (isExpressiveShape(shape)) {
    const rawPath = SHAPE_PATHS[shape];
    if (rawPath) {
      return scaleNormalizedPath(rawPath, bounds);
    }
  }
  return getRoundedRectPath(bounds, radius);
}
