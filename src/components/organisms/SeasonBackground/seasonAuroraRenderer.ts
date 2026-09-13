import { Renderer, Program, Mesh, Triangle } from 'ogl';
import {
  AURORA_VERTEX_SHADER,
  AURORA_FRAGMENT_SHADER,
} from './seasonAuroraShaders.ts';

export const REALISTIC_AURORA_COLORS = {
  cyan: [0.04, 0.65, 0.72] as [number, number, number],
  green: [0.08, 0.92, 0.36] as [number, number, number],
  red: [0.85, 0.12, 0.18] as [number, number, number],
};

export const SOLARIZED_AURORA_COLORS: [number, number, number][] = [
  REALISTIC_AURORA_COLORS.cyan,
  REALISTIC_AURORA_COLORS.green,
  REALISTIC_AURORA_COLORS.green,
  REALISTIC_AURORA_COLORS.red,
];

interface AuroraColorConfig {
  cyan: [number, number, number];
  green: [number, number, number];
  red: [number, number, number];
}

export interface AuroraRendererOptions {
  canvas: HTMLCanvasElement;
  amplitude?: number;
  speed?: number;
  colors?: Partial<AuroraColorConfig>;
}

export interface AuroraRendererHandle {
  resize: (width: number, height: number) => void;
  destroy: () => void;
}

export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.WebGLRenderingContext ||
    (window as unknown as { WebGL2RenderingContext?: unknown })
      .WebGL2RenderingContext
  );
}

function initAuroraProgram(
  gl: Renderer['gl'],
  options: AuroraRendererOptions
): Program {
  const { amplitude = 1.0, colors, canvas } = options;
  const palette = { ...REALISTIC_AURORA_COLORS, ...colors };
  const w = canvas.width > 0 ? canvas.width : 300;
  const h = canvas.height > 0 ? canvas.height : 150;

  return new Program(gl, {
    vertex: AURORA_VERTEX_SHADER,
    fragment: AURORA_FRAGMENT_SHADER,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: amplitude },
      uColorCyan: { value: palette.cyan },
      uColorGreen: { value: palette.green },
      uColorRed: { value: palette.red },
      uResolution: { value: [w, h] },
    },
    transparent: true,
  });
}

export function createAuroraRenderer(
  options: AuroraRendererOptions
): AuroraRendererHandle | null {
  const { canvas, speed = 1.0 } = options;
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas,
      dpr: 1,
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
  } catch {
    return null;
  }

  const gl = renderer.gl;
  if (!gl) return null;

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) {
    delete geometry.attributes.uv;
  }

  const program = initAuroraProgram(gl, options);
  const mesh = new Mesh(gl, { geometry, program });
  let animId = 0;
  let startTime = 0;

  const update = (t: number) => {
    animId = requestAnimationFrame(update);
    if (!startTime) startTime = t;
    const elapsed = (t - startTime) * 0.001 * speed;
    program.uniforms.uTime.value = elapsed;
    renderer.render({ scene: mesh });
  };
  animId = requestAnimationFrame(update);

  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    renderer.setSize(width, height);
    program.uniforms.uResolution.value = [width, height];
  };

  const destroy = () => {
    cancelAnimationFrame(animId);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };

  return {
    resize,
    destroy,
  };
}

export function attachAuroraLifecycle(canvas: HTMLCanvasElement): () => void {
  const handle = createAuroraRenderer({ canvas });
  if (!handle) return () => {};

  const onResize = () => {
    const parent = canvas.parentElement;
    if (parent && parent.clientWidth > 0 && parent.clientHeight > 0) {
      handle.resize(parent.clientWidth, parent.clientHeight);
    }
  };
  onResize();
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onResize);
  }

  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
    ro = new ResizeObserver(() => onResize());
    ro.observe(canvas.parentElement);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', onResize);
    }
    ro?.disconnect();
    handle.destroy();
  };
}
