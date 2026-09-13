import type {
  MouseState,
  Point2D,
  WindState,
} from './SeasonBackground.types.ts';
import { getSeasonalLeafPalette } from './seasonUtils.ts';
import {
  renderCherryPetal,
  renderLeftSegments,
  renderRightSegments,
  renderSnowflake,
  renderVeinsAndStem,
} from './seasonParticleDrawers.ts';
export { WindBreezeStream } from './SeasonWindBreezeStream.ts';

export type SeasonalParticleType = 'petal' | 'snowflake' | 'leaf';

export interface LeafPhysicsState {
  windState: WindState;
  mouseState: MouseState;
}

export function getWinterSpringParticle(
  p: number,
  particleHash: number
): SeasonalParticleType {
  if (p <= 3.3) return 'snowflake';
  const petalRatio = (p - 3.3) / 0.7;
  return particleHash < petalRatio ? 'petal' : 'snowflake';
}

export function getSeasonalParticleType(
  seasonProgress: number,
  particleHash: number
): SeasonalParticleType {
  const p = ((seasonProgress % 4) + 4) % 4;

  if (p >= 3.0) {
    return getWinterSpringParticle(p, particleHash);
  }
  if (p <= 0.85) {
    const petalRatio = 1 - p / 0.85;
    return particleHash < petalRatio ? 'petal' : 'leaf';
  }
  if (p >= 2.4) {
    const snowRatio = (p - 2.4) / 0.6;
    return particleHash < snowRatio ? 'snowflake' : 'leaf';
  }
  return 'leaf';
}

function resolveOriginPoint(
  screenWidth: number,
  screenHeight: number,
  canopyPoint?: Point2D
): Point2D {
  if (canopyPoint) return canopyPoint;
  const isWide = screenWidth >= 900;
  const left = isWide ? screenWidth * 0.01 : screenWidth * -0.06;
  const treeW = Math.max(480, Math.min(840, screenWidth * 0.5));
  const treeH = Math.max(640, Math.min(1080, screenWidth * 0.68));
  return {
    x: left + treeW * 0.49,
    y: screenHeight - treeH + treeH * 0.3,
  };
}

export class LeafParticle {
  public x = 0;
  public y = 0;
  public size = 12;
  public aspect = 0.65;
  public depth = 1.0;
  public opacity = 0.9;
  public speedFactor = 1.0;
  public driftAngleOffset = 0;
  public angle = 0;
  public angularVelocity = 0.01;
  public flutterPhase = 0;
  public flutterSpeed = 0.025;

  public constructor(
    isInitial: boolean,
    viewport: Point2D,
    canopyPoint?: Point2D
  ) {
    this.reset(isInitial, viewport, canopyPoint);
  }

  public reset(
    isInitial: boolean,
    viewport: Point2D,
    canopyPoint?: Point2D
  ): void {
    const origin = resolveOriginPoint(viewport.x, viewport.y, canopyPoint);
    if (isInitial) {
      const spread = Math.random();
      this.x = origin.x + spread * (viewport.x - origin.x);
      const descent = spread * (viewport.y * 0.36) + (Math.random() - 0.5) * 80;
      this.y = Math.min(
        viewport.y - 60,
        Math.max(origin.y - 30, origin.y + descent)
      );
    } else {
      this.x = origin.x + (Math.random() - 0.5) * 60;
      this.y = origin.y + (Math.random() - 0.5) * 45;
    }
    this.size = 10 + Math.random() * 8;
    this.aspect = 0.6 + Math.random() * 0.15;
    this.depth = 0.7 + Math.random() * 0.5;
    this.opacity = 0.78 + Math.random() * 0.2;
    this.speedFactor = 0.82 + Math.random() * 0.4;
    this.driftAngleOffset = (Math.random() - 0.5) * 0.35;
    this.angle = Math.random() * Math.PI * 2;
    this.angularVelocity = (Math.random() - 0.5) * 0.022;
    this.flutterPhase = Math.random() * Math.PI * 2;
    this.flutterSpeed = 0.02 + Math.random() * 0.025;
  }

  public update(
    physics: LeafPhysicsState,
    dims: Point2D,
    canopyPoint?: Point2D
  ): void {
    const { windState, mouseState } = physics;
    this.flutterPhase += this.flutterSpeed;
    const windSpeedX =
      windState.currentX *
      this.depth *
      this.speedFactor *
      (1 + windState.gustBoost);
    const flutterOffset = Math.sin(this.flutterPhase) * 0.45;
    const flutterLift = Math.cos(this.flutterPhase * 0.85) * 0.28;
    const fallSpeed = 0.38 * this.depth;

    const deltaX = this.x - mouseState.x;
    const deltaY = this.y - mouseState.y;
    const dist = Math.hypot(deltaX, deltaY);
    const deflectX =
      dist < 65 && dist > 2 ? (deltaX / dist) * (1 - dist / 65) * 0.8 : 0;

    this.x += windSpeedX + flutterOffset + deflectX;
    this.y += fallSpeed + flutterLift;
    this.angle += this.angularVelocity;

    const pad = 60;
    if (this.x > dims.x + pad || this.x < -pad || this.y > dims.y - 20) {
      this.reset(false, dims, canopyPoint);
    }
  }

  public draw(
    context: CanvasRenderingContext2D,
    isDarkMode: boolean,
    seasonProgress = 1.0
  ): void {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.scale(
      Math.cos(this.flutterPhase) * (this.size * this.depth),
      this.size * this.aspect * this.depth
    );
    context.globalAlpha = this.opacity;

    const hash = Math.max(
      0,
      Math.min(1, (this.driftAngleOffset + 0.175) / 0.35)
    );
    const pType = getSeasonalParticleType(seasonProgress, hash);

    if (pType === 'petal') {
      renderCherryPetal(context, isDarkMode);
    } else if (pType === 'snowflake') {
      renderSnowflake(context, isDarkMode);
    } else {
      const pal = getSeasonalLeafPalette(seasonProgress, isDarkMode);
      renderLeftSegments(context, pal);
      renderRightSegments(context, pal);
      renderVeinsAndStem(context, pal);
    }
    context.restore();
  }
}
