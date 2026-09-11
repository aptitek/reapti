import { describe, it, expect } from 'vitest';
import {
  isExpressiveShape,
  getRoundedRectPath,
  scaleNormalizedPath,
  resolveBorderPath,
  toExpressiveShape,
  SHAPE_PATHS,
} from '../../src/tokens/shapes.ts';

describe('M3 Shapes Token Catalog & Rounded Geometry', () => {
  it('contains all 35 M3 expressive shapes', () => {
    expect(Object.keys(SHAPE_PATHS).length).toBe(35);
    expect(isExpressiveShape('sunny')).toBe(true);
    expect(isExpressiveShape('arch')).toBe(true);
    expect(isExpressiveShape('4-sided-cookie')).toBe(true);
    expect(isExpressiveShape('unknown-shape')).toBe(false);
    expect(isExpressiveShape(undefined)).toBe(false);
  });

  it('normalizes shapes and button shapes to expressive names', () => {
    expect(toExpressiveShape('rounded')).toBe('pill');
    expect(toExpressiveShape('square')).toBe('square');
    expect(toExpressiveShape('sunny')).toBe('sunny');
    expect(toExpressiveShape('unknown')).toBe('pill');
    expect(toExpressiveShape(undefined)).toBe('pill');
  });

  it('generates rounded rectangle SVG paths clockwise', () => {
    const bounds = { x: 0, y: 0, width: 100, height: 50 };
    const path = getRoundedRectPath(bounds, 8);
    expect(path).toContain('M 50 0');
    expect(path).toContain('L 92 0');
    expect(path).toContain('A 8 8 0 0 1 100 8');
    expect(path.endsWith('Z')).toBe(true);
  });

  it('returns an empty string when dimensions are zero or negative', () => {
    expect(getRoundedRectPath({ x: 0, y: 0, width: 0, height: 50 }, 8)).toBe(
      ''
    );
    expect(getRoundedRectPath({ x: 0, y: 0, width: 100, height: -1 }, 8)).toBe(
      ''
    );
  });

  it('generates sharp rectangle when radius is zero', () => {
    const bounds = { x: 0, y: 0, width: 80, height: 40 };
    const path = getRoundedRectPath(bounds, 0);
    expect(path).toBe('M 40 0 L 80 0 L 80 40 L 0 40 L 0 0 Z');
  });
});

describe('M3 Shapes Scaling & Unified Border Path', () => {
  it('scales expressive shape paths to given bounds', () => {
    const raw = 'M0 0 L1 1 Z';
    const bounds = { x: 10, y: 10, width: 100, height: 100 };
    const scaled = scaleNormalizedPath(raw, bounds);
    expect(scaled).toBe('M10 10L110 110Z');
  });

  it('handles edge case coordinates in scaleNormalizedPath', () => {
    const bounds = { x: 0, y: 0, width: 100, height: 100 };
    const withOdd = scaleNormalizedPath('M 0.5 0.5 10 Z', bounds);
    expect(withOdd).toContain('10');
    const withEmpty = scaleNormalizedPath('M Z', bounds);
    expect(withEmpty).toContain('M');
  });

  it('resolves unified border path for expressive shapes without rogue lines', () => {
    const bounds = { x: 0, y: 0, width: 80, height: 80 };
    const sunnyPath = resolveBorderPath({ shape: 'sunny', bounds });
    expect(sunnyPath.startsWith('M')).toBe(true);
    expect(sunnyPath.endsWith('Z')).toBe(true);

    const archPath = resolveBorderPath({ shape: 'arch', bounds });
    expect(archPath.startsWith('M')).toBe(true);
    expect(archPath.endsWith('Z')).toBe(true);
  });

  it('resolves unified border path for classic shapes using normalized paths', () => {
    const bounds = { x: 0, y: 0, width: 80, height: 40 };
    const roundedPath = resolveBorderPath({ shape: 'rounded', bounds });
    expect(roundedPath.startsWith('M')).toBe(true);
    expect(roundedPath.endsWith('Z')).toBe(true);

    const squarePath = resolveBorderPath({ shape: 'square', bounds });
    expect(squarePath.startsWith('M')).toBe(true);
    expect(squarePath.endsWith('Z')).toBe(true);
  });
});
