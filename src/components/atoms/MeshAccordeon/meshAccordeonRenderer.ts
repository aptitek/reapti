import {
  Renderer,
  Camera,
  Transform,
  Program,
  Mesh,
  Plane,
  Texture,
} from 'ogl';
import { vertexShader, fragmentShader } from './meshAccordeonShaders.ts';

export interface MeshRendererOptions {
  canvas: HTMLCanvasElement;
  folds?: number;
  depth?: number;
  radius?: number;
  segments?: number;
}

export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return Boolean(window.WebGLRenderingContext);
}

function createMeshProgram(
  gl: Renderer['gl'],
  texture: Texture,
  options: {
    folds: number;
    depth: number;
    radius: number;
    aspect: number;
    unfoldedAspect: number;
  }
) {
  return new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uFoldProgress: { value: 0 },
      uFolds: { value: options.folds },
      uDepth: { value: options.depth },
      uRadius: { value: options.radius },
      uAspect: { value: options.aspect },
      uUnfoldedAspect: { value: options.unfoldedAspect },
      uLightDir: { value: [0.35, 0.45, 0.82] },
      uHasTexture: { value: 0 },
      uTexture: { value: texture },
    },
    transparent: true,
    cullFace: false,
  });
}

function initMeshCamera(gl: Renderer['gl'], aspect: number): Camera {
  const camera = new Camera(gl, { fov: 40 });
  camera.position.set(0, 0, 2.75);
  camera.perspective({ aspect });
  return camera;
}

function initMeshScene(
  gl: Renderer['gl'],
  params: { aspect: number; options: MeshRendererOptions; program: Program }
): { scene: Transform; mesh: Mesh } {
  const scene = new Transform();
  const segments = params.options.segments ?? 64;
  const geometry = new Plane(gl, {
    width: 2.0,
    height: 2.0,
    widthSegments: segments,
    heightSegments: 2,
  });
  const mesh = new Mesh(gl, { geometry, program: params.program });
  mesh.scale.set(params.aspect, 1, 1);
  mesh.setParent(scene);
  return { scene, mesh };
}

export function resolveCanvasDimensions(canvas: HTMLCanvasElement): {
  width: number;
  height: number;
  dpr: number;
} {
  const width = canvas.clientWidth || 400;
  const height = canvas.clientHeight || 400;
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  return { width, height, dpr: Math.min(dpr, 2) };
}

export function resolveAspectRatios(
  width: number,
  height: number
): {
  aspect: number;
  unfoldedAspect: number;
} {
  const aspect = width / height;
  const unfoldedAspect = width < height ? aspect * 2.5 : aspect;
  return { aspect, unfoldedAspect };
}

export class MeshAccordeonRenderer {
  private renderer: Renderer;
  private gl: Renderer['gl'];
  private camera: Camera;
  private scene: Transform;
  private program: Program;
  private mesh: Mesh;
  private texture: Texture;

  constructor(options: MeshRendererOptions) {
    const dims = resolveCanvasDimensions(options.canvas);
    this.renderer = new Renderer({
      canvas: options.canvas,
      width: dims.width,
      height: dims.height,
      alpha: true,
      antialias: true,
      dpr: dims.dpr,
    });
    this.gl = this.renderer.gl;
    this.gl.canvas?.style?.removeProperty('width');
    this.gl.canvas?.style?.removeProperty('height');

    const ratios = resolveAspectRatios(dims.width, dims.height);
    this.camera = initMeshCamera(this.gl, ratios.aspect);
    this.texture = new Texture(this.gl);

    this.program = createMeshProgram(this.gl, this.texture, {
      folds: options.folds ?? 2.0,
      depth: options.depth ?? 0.28,
      radius: options.radius ?? 0.05,
      aspect: ratios.aspect,
      unfoldedAspect: ratios.unfoldedAspect,
    });

    const { scene, mesh } = initMeshScene(this.gl, {
      aspect: ratios.aspect,
      options,
      program: this.program,
    });
    this.scene = scene;
    this.mesh = mesh;
  }

  public setFoldProgress(progress: number): void {
    const uniform = this.program.uniforms.uFoldProgress;
    if (uniform) {
      uniform.value = Math.max(0, Math.min(1, progress));
    }
  }

  public setTextureSource(source: HTMLImageElement | HTMLCanvasElement): void {
    this.texture.image = source;
    const hasTexUniform = this.program.uniforms.uHasTexture;
    if (hasTexUniform) {
      hasTexUniform.value = 1;
    }
  }

  public resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    this.renderer.setSize(width, height);
    this.gl.canvas?.style?.removeProperty('width');
    this.gl.canvas?.style?.removeProperty('height');
    const aspect = width / height;
    this.camera.perspective({ aspect });
    this.mesh.scale.set(aspect, 1, 1);
    const aspectUniform = this.program.uniforms.uAspect;
    if (aspectUniform) {
      aspectUniform.value = aspect;
    }
  }

  public render(): void {
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  public destroy(): void {
    const ext = this.gl.getExtension('WEBGL_lose_context');
    if (ext) {
      ext.loseContext();
    }
  }
}
