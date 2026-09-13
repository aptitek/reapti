import { describe, it, expect, vi } from 'vitest';
import {
  renderCherryPetal,
  renderLeftSegments,
  renderRightSegments,
  renderSnowflake,
  renderVeinsAndStem,
} from '../../src/components/organisms/SeasonBackground/seasonParticleDrawers.ts';
import { LIGHT_LEAF_PALETTE } from '../../src/components/organisms/SeasonBackground/seasonPalettes.ts';

function createMockContext(): CanvasRenderingContext2D {
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'round',
    lineJoin: 'round',
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

describe('seasonParticleDrawers Module', () => {
  it('renders left, right segments and veins without errors', () => {
    const ctx = createMockContext();
    expect(() => renderLeftSegments(ctx, LIGHT_LEAF_PALETTE)).not.toThrow();
    expect(() => renderRightSegments(ctx, LIGHT_LEAF_PALETTE)).not.toThrow();
    expect(() => renderVeinsAndStem(ctx, LIGHT_LEAF_PALETTE)).not.toThrow();
  });

  it('renders cherry petal in light and dark mode', () => {
    const ctx = createMockContext();
    expect(() => renderCherryPetal(ctx, false)).not.toThrow();
    expect(() => renderCherryPetal(ctx, true)).not.toThrow();
  });

  it('renders snowflake in light and dark mode', () => {
    const ctx = createMockContext();
    expect(() => renderSnowflake(ctx, false)).not.toThrow();
    expect(() => renderSnowflake(ctx, true)).not.toThrow();
  });
});
