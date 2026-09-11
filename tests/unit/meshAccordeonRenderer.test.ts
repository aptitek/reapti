import { describe, it, expect, vi } from 'vitest';

const mockLose = vi.fn();
let returnExtension = true;

const mockGl = {
  getExtension: vi.fn().mockImplementation((ext: string) => {
    if (ext === 'WEBGL_lose_context' && returnExtension) {
      return { loseContext: mockLose };
    }
    return null;
  }),
};

vi.mock('ogl', () => {
  class MockRenderer {
    gl = mockGl;
    setSize = vi.fn();
    render = vi.fn();
  }

  class MockCamera {
    position = { set: vi.fn() };
    perspective = vi.fn();
  }

  class MockTransform {}

  class MockProgram {
    uniforms: Record<string, { value: unknown }>;
    constructor(
      _gl: unknown,
      options: { uniforms: Record<string, { value: unknown }> }
    ) {
      this.uniforms = options.uniforms;
    }
  }

  class MockMesh {
    setParent = vi.fn();
    scale = { set: vi.fn() };
  }

  class MockPlane {}

  class MockTexture {
    image: unknown = null;
  }

  return {
    Renderer: MockRenderer,
    Camera: MockCamera,
    Transform: MockTransform,
    Program: MockProgram,
    Mesh: MockMesh,
    Plane: MockPlane,
    Texture: MockTexture,
  };
});

import {
  isWebGLSupported,
  MeshAccordeonRenderer,
} from '../../src/components/atoms/MeshAccordeon/meshAccordeonRenderer.ts';
import {
  scheduleMeshRaf,
  cancelMeshRaf,
} from '../../src/components/atoms/MeshAccordeon/useMeshAccordeon.ts';

describe('MeshAccordeonRenderer WebGL Support', () => {
  it('detects WebGL support gracefully in environment without throwing', () => {
    const supported = isWebGLSupported();
    expect(typeof supported).toBe('boolean');
  });

  it('handles window undefined in isWebGLSupported', () => {
    const originalWindow = globalThis.window;
    try {
      // @ts-expect-error simulating SSR environment
      delete globalThis.window;
      expect(isWebGLSupported()).toBe(false);
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it('returns true when WebGLRenderingContext is available', () => {
    const originalWindow = globalThis.window;
    try {
      // @ts-expect-error simulating browser environment
      globalThis.window = { WebGLRenderingContext: {} };
      expect(isWebGLSupported()).toBe(true);
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it('returns false when WebGLRenderingContext is absent', () => {
    const originalWindow = globalThis.window;
    try {
      // @ts-expect-error simulating browser environment without WebGL
      globalThis.window = {};
      expect(isWebGLSupported()).toBe(false);
    } finally {
      globalThis.window = originalWindow;
    }
  });
});

describe('MeshAccordeonRenderer Class API', () => {
  it('instantiates and operates on mock canvas when WebGL is available', () => {
    returnExtension = true;
    const mockCanvas = {
      clientWidth: 400,
      clientHeight: 400,
    } as HTMLCanvasElement;

    const renderer = new MeshAccordeonRenderer({
      canvas: mockCanvas,
      folds: 2,
      depth: 0.28,
      radius: 0.05,
      segments: 64,
    });

    renderer.setFoldProgress(0.5);
    renderer.setFoldProgress(2.0);
    renderer.setFoldProgress(-1.0);

    renderer.resize(500, 300);
    renderer.resize(0, 0);
    renderer.resize(-1, -1);

    renderer.render();

    const dummyImage = {} as HTMLImageElement;
    renderer.setTextureSource(dummyImage);

    renderer.destroy();
    expect(mockLose).toHaveBeenCalled();
  });

  it('instantiates with default options and handles missing uniforms safely', () => {
    returnExtension = false;
    const emptyCanvas = {} as HTMLCanvasElement;

    const renderer = new MeshAccordeonRenderer({
      canvas: emptyCanvas,
    });

    // Strip uniforms to test safety guards
    // @ts-expect-error testing missing uniforms
    renderer['program'].uniforms = {};
    expect(() => renderer.setFoldProgress(0.5)).not.toThrow();
    expect(() =>
      renderer.setTextureSource({} as HTMLImageElement)
    ).not.toThrow();

    expect(() => renderer.destroy()).not.toThrow();
  });
});

describe('MeshAccordeon RAF helpers', () => {
  it('schedules and cancels RAF with browser APIs and fallbacks', () => {
    const mockRaf = vi.fn().mockReturnValue(123);
    const mockCancel = vi.fn();
    const originalRaf = globalThis.requestAnimationFrame;
    const originalCancel = globalThis.cancelAnimationFrame;

    try {
      globalThis.requestAnimationFrame = mockRaf;
      globalThis.cancelAnimationFrame = mockCancel;

      const id = scheduleMeshRaf(vi.fn());
      expect(id).toBe(123);
      cancelMeshRaf(id);
      expect(mockCancel).toHaveBeenCalledWith(123);

      // @ts-expect-error simulating fallback
      delete globalThis.requestAnimationFrame;
      // @ts-expect-error simulating fallback
      delete globalThis.cancelAnimationFrame;

      const fallbackId = scheduleMeshRaf(vi.fn());
      expect(fallbackId).toBeDefined();
      cancelMeshRaf(fallbackId);
    } finally {
      globalThis.requestAnimationFrame = originalRaf;
      globalThis.cancelAnimationFrame = originalCancel;
    }
  });
});
