import { describe, it, expect, vi } from 'vitest';
import {
  WindBreezeStream,
  createBreezeStreams,
} from '../../src/components/organisms/SeasonBackground/SeasonWindBreezeStream.ts';
import type { WindState } from '../../src/components/organisms/SeasonBackground/SeasonBackground.types.ts';

function createMockContext(): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'round',
    createLinearGradient: vi.fn().mockReturnValue({
      addColorStop: vi.fn(),
    }),
  } as unknown as CanvasRenderingContext2D;
}

describe('SeasonWindBreezeStream - Lifecycle & Updates', () => {
  it('initializes and updates with default and directional wind', () => {
    const stream = new WindBreezeStream(1200, 800);
    expect(stream.length).toBeGreaterThan(70);
    expect(stream.x).toBeGreaterThanOrEqual(0);

    const windRight: WindState = {
      baseSpeedX: 1.0,
      baseSpeedY: 0,
      currentX: 1.5,
      currentY: 0,
      gustBoost: 0.1,
    };
    const startX = stream.x;
    stream.update(windRight, 1200, 800);
    expect(stream.x).not.toBe(startX);

    const windLeft: WindState = {
      baseSpeedX: 1.0,
      baseSpeedY: 0,
      currentX: -1.5,
      currentY: 0,
      gustBoost: 0.1,
    };
    for (let i = 0; i < 40; i++) {
      stream.update(windLeft, 1200, 800);
    }
    expect(stream.angle).toBeGreaterThan(2.5);
  });

  it('resets position when moving out of viewport bounds', () => {
    const stream = new WindBreezeStream(1000, 700);
    const wind: WindState = {
      baseSpeedX: 1.0,
      baseSpeedY: 0,
      currentX: 2.0,
      currentY: 0,
      gustBoost: 0,
    };

    stream.x = 2000;
    stream.update(wind, 1000, 700);
    expect(stream.x).toBeLessThan(1000);

    const nonInitial = new WindBreezeStream(1000, 700, {
      windState: {
        baseSpeedX: 1,
        baseSpeedY: 0,
        currentX: -1,
        currentY: 0,
        gustBoost: 0,
      },
      isInitial: false,
    });
    expect(nonInitial.x).toBeGreaterThan(1000);
  });
});

describe('SeasonWindBreezeStream - Drawing & Factory', () => {
  it('draws breeze stream in day and night modes', () => {
    const ctx = createMockContext();
    const stream = new WindBreezeStream(1000, 700);

    expect(() => stream.draw(ctx, false)).not.toThrow();
    expect(() => stream.draw(ctx, true)).not.toThrow();
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });

  it('creates array of breeze streams via factory', () => {
    const streams = createBreezeStreams(6, { x: 1440, y: 900 });
    expect(streams).toHaveLength(6);
    expect(streams[0]).toBeInstanceOf(WindBreezeStream);
  });
});
