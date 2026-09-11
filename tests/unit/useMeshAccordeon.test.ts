import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const mockLose = vi.fn();
const mockGl = {
  getExtension: vi.fn().mockReturnValue({ loseContext: mockLose }),
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
      opts: { uniforms: Record<string, { value: unknown }> }
    ) {
      this.uniforms = opts.uniforms;
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
  useMeshAccordeon,
  easeOutCubic,
  stepMeshAnimation,
  handleMeshResize,
  createMeshLifecycle,
  createMeshAnimation,
} from '../../src/components/atoms/MeshAccordeon/useMeshAccordeon.ts';
import type { AnimationState } from '../../src/components/atoms/MeshAccordeon/useMeshAccordeon.ts';
import type { MeshAccordeonRenderer } from '../../src/components/atoms/MeshAccordeon/meshAccordeonRenderer.ts';
import { isWebGLSupported } from '../../src/components/atoms/MeshAccordeon/meshAccordeonRenderer.ts';

describe('useMeshAccordeon Math and Support Utils', () => {
  it('computes accurate easeOutCubic curve values', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 5);
  });

  it('safely evaluates WebGL support in server/mock environments', () => {
    const supported = isWebGLSupported();
    expect(typeof supported).toBe('boolean');
  });
});

describe('useMeshAccordeon Animation and Resize Helpers', () => {
  it('steps animation correctly and triggers renderer updates', () => {
    const mockRenderer = {
      setFoldProgress: vi.fn(),
      render: vi.fn(),
    } as unknown as MeshAccordeonRenderer;

    const anim: AnimationState = {
      currentProgress: 0,
      targetProgress: 1,
      startProgress: 0,
      startTime: 1000,
      duration: 500,
    };

    const finishedMid = stepMeshAnimation(anim, 1250, mockRenderer);
    expect(finishedMid).toBe(false);
    expect(mockRenderer.setFoldProgress).toHaveBeenCalled();
    expect(mockRenderer.render).toHaveBeenCalled();

    const finishedEnd = stepMeshAnimation(anim, 1600, mockRenderer);
    expect(finishedEnd).toBe(true);
    expect(anim.currentProgress).toBe(1);

    expect(() => stepMeshAnimation(anim, 1600, null)).not.toThrow();
  });

  it('handles mesh resize safely with valid and invalid dimensions', () => {
    const mockRenderer = {
      resize: vi.fn(),
      render: vi.fn(),
    } as unknown as MeshAccordeonRenderer;

    handleMeshResize(mockRenderer, 500, 300);
    expect(mockRenderer.resize).toHaveBeenCalledWith(500, 300);
    expect(mockRenderer.render).toHaveBeenCalled();

    mockRenderer.resize = vi.fn();
    handleMeshResize(mockRenderer, 0, 0);
    expect(mockRenderer.resize).not.toHaveBeenCalled();

    expect(() => handleMeshResize(null, 500, 300)).not.toThrow();
  });
});

describe('useMeshAccordeon Lifecycle Effect', () => {
  let originalRO: typeof globalThis.ResizeObserver;

  beforeEach(() => {
    originalRO = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      private callback: ResizeObserverCallback;
      constructor(cb: ResizeObserverCallback) {
        this.callback = cb;
      }
      observe(_target: Element) {
        this.callback(
          [{ contentRect: { width: 320, height: 240 } } as ResizeObserverEntry],
          this
        );
      }
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalRO;
  });

  it('creates and cleans up mesh lifecycle', () => {
    const rendererRef = { current: null };
    const cleanupNull = createMeshLifecycle(null, rendererRef, {});
    cleanupNull();
    expect(rendererRef.current).toBeNull();

    const mockCanvas = {
      clientWidth: 400,
      clientHeight: 300,
    } as HTMLCanvasElement;
    const cleanup = createMeshLifecycle(mockCanvas, rendererRef, {
      folds: 2,
      depth: 0.3,
      radius: 0.05,
      segments: 64,
    });
    expect(rendererRef.current).not.toBeNull();
    cleanup();
    expect(rendererRef.current).toBeNull();
  });
});

describe('useMeshAccordeon Animation Effect', () => {
  it('creates and ticks animation effect', () => {
    vi.useFakeTimers();
    try {
      const animRef = {
        current: {
          currentProgress: 0,
          targetProgress: 1,
          startProgress: 0,
          startTime: 0,
          duration: 100,
        },
      };
      const rendererRef = {
        current: {
          setFoldProgress: vi.fn(),
          render: vi.fn(),
        } as unknown as MeshAccordeonRenderer,
      };

      const cleanup = createMeshAnimation(animRef, rendererRef, 1);
      vi.advanceTimersByTime(50);
      vi.advanceTimersByTime(100);
      cleanup();

      const cleanupNull = createMeshAnimation(
        { current: null as never },
        rendererRef,
        1
      );
      cleanupNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('useMeshAccordeon Hook Execution', () => {
  it('manages fold state, callbacks, and keyboard interactions', () => {
    let hookApi: ReturnType<typeof useMeshAccordeon> | null = null;
    const onToggle = vi.fn();

    function Probe() {
      hookApi = useMeshAccordeon({
        folds: 2,
        defaultFolded: false,
        onToggle,
        ariaLabel: 'Custom 3D Mesh',
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    expect((hookApi as typeof hookApi).isFolded).toBe(false);
    (hookApi as typeof hookApi).handleToggle();
    expect(onToggle).toHaveBeenCalledWith(true);

    const preventDefault = vi.fn();
    (hookApi as typeof hookApi).handleKeyDown({
      key: 'Enter',
      preventDefault,
    } as never);
    (hookApi as typeof hookApi).handleKeyDown({
      key: ' ',
      preventDefault,
    } as never);
    (hookApi as typeof hookApi).handleKeyDown({
      key: 'Escape',
      preventDefault: vi.fn(),
    } as never);
    expect(preventDefault).toHaveBeenCalled();

    (hookApi as typeof hookApi).initLifecycle()();
    (hookApi as typeof hookApi).startAnimation()();
  });

  it('handles controlled fold toggles', () => {
    let controlledApi: ReturnType<typeof useMeshAccordeon> | null = null;
    const onToggle = vi.fn();

    function ControlledProbe() {
      controlledApi = useMeshAccordeon({ isFolded: true, onToggle });
      return null;
    }

    renderToStaticMarkup(createElement(ControlledProbe));
    controlledApi?.handleToggle();
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
