import type {
  MouseState,
  Point2D,
  WindState,
} from './SeasonBackground.types.ts';
import type { LeafParticle } from './SeasonLeafRenderer.ts';
import type { WindBreezeStream } from './SeasonWindBreezeStream.ts';

export interface ComputeWindVectorOptions {
  mouseState: MouseState;
  origin: Point2D;
  windIntensity: number;
}

export function computeTargetWindVector(
  options: ComputeWindVectorOptions
): Point2D {
  const { mouseState, origin, windIntensity } = options;
  const deltaX = mouseState.x - origin.x;
  const baseSpeed = 0.85 * (windIntensity || 1.0);
  const directionX = deltaX >= 0 ? 1 : -1;
  const distanceRatio = Math.min(
    1.25,
    Math.max(0.6, Math.abs(deltaX) / (origin.x || 200))
  );
  return {
    x: directionX * distanceRatio * baseSpeed,
    y: 0,
  };
}

export interface UpdateCanvasStreamsOptions {
  renderContext: CanvasRenderingContext2D;
  streams: WindBreezeStream[];
  windState: WindState;
  viewport: Point2D;
  isDarkMode: boolean;
  reducedMotion: boolean;
}

export function updateCanvasStreams(options: UpdateCanvasStreamsOptions): void {
  const {
    renderContext,
    streams,
    windState,
    viewport,
    isDarkMode,
    reducedMotion,
  } = options;
  for (const stream of streams) {
    if (!reducedMotion) stream.update(windState, viewport.x, viewport.y);
    stream.draw(renderContext, isDarkMode);
  }
}

export interface UpdateCanvasLeavesOptions {
  renderContext: CanvasRenderingContext2D;
  leaves: LeafParticle[];
  windState: WindState;
  mouseState: MouseState;
  viewport: Point2D;
  canopyOrigin: Point2D;
  isDarkMode: boolean;
  reducedMotion: boolean;
  seasonProgress: number;
}

export function updateCanvasLeaves(options: UpdateCanvasLeavesOptions): void {
  const {
    renderContext,
    leaves,
    windState,
    mouseState,
    viewport,
    canopyOrigin,
    isDarkMode,
    reducedMotion,
    seasonProgress,
  } = options;
  for (const leaf of leaves) {
    if (!reducedMotion) {
      leaf.update({ windState, mouseState }, viewport, canopyOrigin);
    }
    leaf.draw(renderContext, isDarkMode, seasonProgress);
  }
}

export interface StepCanvasPhysicsOptions {
  mouseState: MouseState;
  windState: WindState;
  canopyCenter: Point2D;
  windIntensity: number;
}

export function stepCanvasPhysics(options: StepCanvasPhysicsOptions): void {
  const { mouseState, windState, canopyCenter, windIntensity } = options;
  const prevX = mouseState.x;
  const prevY = mouseState.y;
  mouseState.x += (mouseState.targetX - mouseState.x) * 0.08;
  mouseState.y += (mouseState.targetY - mouseState.y) * 0.08;

  const movement = Math.hypot(mouseState.x - prevX, mouseState.y - prevY);
  if (movement > 1.2) {
    windState.gustBoost = Math.min(
      0.35,
      windState.gustBoost + movement * 0.012
    );
  }
  if (windState.gustBoost > 0) {
    windState.gustBoost =
      windState.gustBoost * 0.96 < 0.01 ? 0 : windState.gustBoost * 0.96;
  }

  const targetWind = computeTargetWindVector({
    mouseState,
    origin: canopyCenter,
    windIntensity,
  });
  windState.currentX += (targetWind.x - windState.currentX) * 0.035;
  windState.currentY = 0;
}

export interface RenderSeasonCanvasFrameOptions {
  ctx: CanvasRenderingContext2D;
  viewport: Point2D;
  leaves: LeafParticle[];
  streams: WindBreezeStream[];
  mouseState: MouseState;
  windState: WindState;
  canopyOrigin: Point2D;
  isDarkMode: boolean;
  reducedMotion: boolean;
  seasonProgress: number;
}

export function renderSeasonCanvasFrame(
  options: RenderSeasonCanvasFrameOptions
): void {
  const {
    ctx,
    viewport,
    leaves,
    streams,
    mouseState,
    windState,
    canopyOrigin,
    isDarkMode,
    reducedMotion,
    seasonProgress,
  } = options;

  ctx.clearRect(0, 0, viewport.x, viewport.y);

  updateCanvasStreams({
    renderContext: ctx,
    streams,
    windState,
    viewport,
    isDarkMode,
    reducedMotion,
  });

  updateCanvasLeaves({
    renderContext: ctx,
    leaves,
    windState,
    mouseState,
    viewport,
    canopyOrigin,
    isDarkMode,
    reducedMotion,
    seasonProgress,
  });
}
