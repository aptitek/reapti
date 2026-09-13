import type { Point2D, WindState } from './SeasonBackground.types.ts';

export interface BreezeStreamResetOptions {
  windState?: WindState;
  isInitial?: boolean;
}

export class WindBreezeStream {
  public x = 0;
  public y = 0;
  public length = 120;
  public speed = 1.0;
  public thickness = 1.0;
  public opacity = 0.12;
  public waveFrequency = 0.02;
  public waveAmplitude = 6;
  public wavePhase = 0;
  public angle = 0;

  public constructor(
    width: number,
    height: number,
    options: BreezeStreamResetOptions = { isInitial: true }
  ) {
    this.reset(width, height, options);
  }

  public reset(
    width: number,
    height: number,
    options: BreezeStreamResetOptions = {}
  ): void {
    const { windState, isInitial = false } = options;
    this.length = 80 + Math.random() * 100;
    this.speed = 0.85 + Math.random() * 0.5;
    this.thickness = 0.8 + Math.random() * 1.0;
    this.opacity = 0.07 + Math.random() * 0.11;
    this.waveFrequency = 0.015 + Math.random() * 0.015;
    this.waveAmplitude = 4 + Math.random() * 6;
    this.wavePhase = Math.random() * Math.PI * 2;
    const blowingLeft = Boolean(windState && windState.currentX < 0);
    this.angle = blowingLeft ? Math.PI : 0;

    if (isInitial) {
      this.x = Math.random() * width;
    } else {
      this.x = blowingLeft
        ? width + 20 + Math.random() * 40
        : -this.length - 20 - Math.random() * 40;
    }
    this.y = 50 + Math.random() * (height * 0.7);
  }

  public update(windState: WindState, width: number, height: number): void {
    const targetAngle = windState.currentX < 0 ? Math.PI : 0;
    let diff = targetAngle - this.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.angle += diff * 0.05;

    const rate =
      this.speed *
      Math.max(0.6, Math.abs(windState.currentX)) *
      (1 + windState.gustBoost * 1.2);
    this.x += Math.cos(this.angle) * rate;
    this.wavePhase += 0.022;

    const pad = this.length + 60;
    if (
      this.x < -pad ||
      this.x > width + pad ||
      this.y < -pad ||
      this.y > height + pad
    ) {
      this.reset(width, height, { windState, isInitial: false });
    }
  }

  public draw(context: CanvasRenderingContext2D, isDarkMode: boolean): void {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);

    const grad = context.createLinearGradient(0, 0, this.length, 0);
    const [r, g, b] = isDarkMode ? [42, 161, 152] : [255, 255, 255];
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    grad.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
    grad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    context.strokeStyle = grad;
    context.lineWidth = this.thickness;
    context.lineCap = 'round';
    context.beginPath();

    for (let step = 0; step < this.length; step += 12) {
      const px = step;
      const py =
        Math.sin(this.wavePhase + step * this.waveFrequency) *
        this.waveAmplitude;
      if (step === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.stroke();
    context.restore();
  }
}

export function createBreezeStreams(
  count: number,
  viewport: Point2D,
  windState?: WindState
): WindBreezeStream[] {
  return Array.from(
    { length: count },
    () =>
      new WindBreezeStream(viewport.x, viewport.y, {
        windState,
        isInitial: true,
      })
  );
}
