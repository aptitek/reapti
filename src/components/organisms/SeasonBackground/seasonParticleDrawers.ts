import {
  SEASON_COLORS,
  SEASON_NIGHT_COLORS,
} from '../../../tokens/solarized.ts';
import type { LeafColors } from './SeasonBackground.types.ts';

export function renderLeftSegments(
  context: CanvasRenderingContext2D,
  palette: LeafColors
): void {
  context.fillStyle = palette.leftBottom;
  context.beginPath();
  context.moveTo(0, 0.7);
  context.bezierCurveTo(-0.35, 0.55, -0.55, 0.35, -0.58, 0.15);
  context.lineTo(0, 0.3);
  context.closePath();
  context.fill();

  context.fillStyle = palette.leftMid;
  context.beginPath();
  context.moveTo(0, 0.3);
  context.lineTo(-0.58, 0.15);
  context.bezierCurveTo(-0.62, -0.15, -0.55, -0.35, -0.48, -0.5);
  context.lineTo(0, -0.2);
  context.closePath();
  context.fill();

  context.fillStyle = palette.leftTop;
  context.beginPath();
  context.moveTo(0, -0.2);
  context.lineTo(-0.48, -0.5);
  context.bezierCurveTo(-0.4, -0.85, -0.22, -1.15, 0, -1.35);
  context.closePath();
  context.fill();
}

export function renderRightSegments(
  context: CanvasRenderingContext2D,
  palette: LeafColors
): void {
  context.fillStyle = palette.rightBottom;
  context.beginPath();
  context.moveTo(0, 0.7);
  context.bezierCurveTo(0.35, 0.55, 0.55, 0.35, 0.58, 0.18);
  context.lineTo(0, 0.35);
  context.closePath();
  context.fill();

  context.fillStyle = palette.rightMid;
  context.beginPath();
  context.moveTo(0, 0.35);
  context.lineTo(0.58, 0.18);
  context.bezierCurveTo(0.62, -0.12, 0.52, -0.35, 0.44, -0.48);
  context.lineTo(0, -0.15);
  context.closePath();
  context.fill();

  context.fillStyle = palette.rightTop;
  context.beginPath();
  context.moveTo(0, -0.15);
  context.lineTo(0.44, -0.48);
  context.bezierCurveTo(0.38, -0.85, 0.22, -1.15, 0, -1.35);
  context.closePath();
  context.fill();
}

export function renderVeinsAndStem(
  context: CanvasRenderingContext2D,
  palette: LeafColors
): void {
  context.strokeStyle = palette.vein;
  context.lineWidth = 0.11;
  context.lineCap = 'round';
  context.lineJoin = 'round';

  context.beginPath();
  context.moveTo(-0.14, 1.15);
  context.quadraticCurveTo(-0.06, 0.85, 0, 0.7);
  context.lineTo(0, -1.35);

  context.moveTo(0, 0.3);
  context.lineTo(-0.55, 0.15);
  context.moveTo(0, -0.2);
  context.lineTo(-0.46, -0.48);

  context.moveTo(0, 0.35);
  context.lineTo(0.55, 0.18);
  context.moveTo(0, -0.15);
  context.lineTo(0.42, -0.46);

  context.stroke();
}

export function renderCherryPetal(
  context: CanvasRenderingContext2D,
  isDarkMode: boolean
): void {
  context.fillStyle = isDarkMode
    ? SEASON_NIGHT_COLORS.spring.blossom
    : SEASON_COLORS.spring.blossom;
  context.beginPath();
  context.moveTo(0, 0.9);
  context.bezierCurveTo(-0.6, 0.6, -0.7, -0.4, -0.3, -0.9);
  context.quadraticCurveTo(-0.1, -0.75, 0, -0.6);
  context.quadraticCurveTo(0.1, -0.75, 0.3, -0.9);
  context.bezierCurveTo(0.7, -0.4, 0.6, 0.6, 0, 0.9);
  context.closePath();
  context.fill();

  context.strokeStyle = isDarkMode
    ? SEASON_NIGHT_COLORS.spring.blossomPetal
    : SEASON_COLORS.spring.blossomPetal;
  context.lineWidth = 0.08;
  context.beginPath();
  context.moveTo(0, 0.8);
  context.lineTo(0, -0.35);
  context.stroke();
}

export function renderSnowflake(
  context: CanvasRenderingContext2D,
  isDarkMode: boolean
): void {
  const color = isDarkMode
    ? SEASON_NIGHT_COLORS.winter.snowWhite
    : SEASON_COLORS.winter.snowWhite;
  context.strokeStyle = color;
  context.lineWidth = 0.12;
  context.lineCap = 'round';

  for (let armIndex = 0; armIndex < 3; armIndex++) {
    context.beginPath();
    context.moveTo(0, -1.0);
    context.lineTo(0, 1.0);

    context.moveTo(-0.25, -0.65);
    context.lineTo(0, -0.45);
    context.lineTo(0.25, -0.65);

    context.moveTo(-0.25, 0.65);
    context.lineTo(0, 0.45);
    context.lineTo(0.25, 0.65);
    context.stroke();

    context.rotate(Math.PI / 3);
  }

  context.fillStyle = isDarkMode
    ? SEASON_NIGHT_COLORS.winter.frostSlate
    : SEASON_COLORS.winter.snowWhite;
  context.beginPath();
  context.arc(0, 0, 0.18, 0, Math.PI * 2);
  context.fill();
}
