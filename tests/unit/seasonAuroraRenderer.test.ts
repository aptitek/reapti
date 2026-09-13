import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isWebGLSupported,
  createAuroraRenderer,
  attachAuroraLifecycle,
  SOLARIZED_AURORA_COLORS,
  REALISTIC_AURORA_COLORS,
} from '../../src/components/organisms/SeasonBackground/seasonAuroraRenderer.ts';

const mockLose = vi.fn();
let throwRendererError = false;
let nullGl = false;
let triangleHasUv = true;
let hasLoseContext = true;
const originalRaf = globalThis.requestAnimationFrame;
const originalCaf = globalThis.cancelAnimationFrame;

const mockGl = {
  getExtension: vi.fn().mockImplementation((ext: string) => {
    if (ext === 'WEBGL_lose_context' && hasLoseContext) {
      return { loseContext: mockLose };
    }
    return null;
  }),
  clearColor: vi.fn(),
  enable: vi.fn(),
  blendFunc: vi.fn(),
  BLEND: 1,
  ONE: 1,
  ONE_MINUS_SRC_ALPHA: 771,
};

vi.mock('ogl', () => {
  class MockRenderer {
    gl = nullGl ? null : mockGl;
    setSize = vi.fn();
    render = vi.fn();
    constructor() {
      if (throwRendererError) {
        throw new Error('WebGL creation failed');
      }
    }
  }

  class MockProgram {
    uniforms: Record<string, { value: unknown }>;
    constructor(
      _gl: unknown,
      options: { uniforms: Record<string, { value: unknown }> }
    ) {
      this.uniforms = options.uniforms;
    }
  }

  class MockMesh {}

  class MockTriangle {
    attributes: Record<string, unknown> = triangleHasUv ? { uv: true } : {};
  }

  return {
    Renderer: MockRenderer,
    Program: MockProgram,
    Mesh: MockMesh,
    Triangle: MockTriangle,
  };
});

beforeEach(() => {
  throwRendererError = false;
  nullGl = false;
  triangleHasUv = true;
  hasLoseContext = true;
  mockLose.mockClear();
  vi.clearAllMocks();
  globalThis.requestAnimationFrame = vi.fn().mockReturnValue(1);
  globalThis.cancelAnimationFrame = vi.fn();
});

afterEach(() => {
  globalThis.requestAnimationFrame = originalRaf;
  globalThis.cancelAnimationFrame = originalCaf;
});

describe('seasonAuroraRenderer - Setup & Support', () => {
  it('exposes realistic aurora colors (cyan, green, red)', () => {
    expect(REALISTIC_AURORA_COLORS.cyan).toHaveLength(3);
    expect(REALISTIC_AURORA_COLORS.green).toHaveLength(3);
    expect(REALISTIC_AURORA_COLORS.red).toHaveLength(3);
  });

  it('exposes four distinct Solarized aurora color stops', () => {
    expect(SOLARIZED_AURORA_COLORS).toHaveLength(4);
    for (const [r, g, b] of SOLARIZED_AURORA_COLORS) {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(b).toBeGreaterThanOrEqual(0);
    }
  });

  it('detects WebGL support in browser environment', () => {
    const originalWindow = globalThis.window;
    try {
      // @ts-expect-error simulating browser environment
      globalThis.window = { WebGLRenderingContext: {} };
      expect(isWebGLSupported()).toBe(true);

      // @ts-expect-error simulating browser without WebGL
      globalThis.window = {};
      expect(isWebGLSupported()).toBe(false);

      // @ts-expect-error simulating SSR
      delete globalThis.window;
      expect(isWebGLSupported()).toBe(false);
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it('handles null renderer and null gl gracefully', () => {
    throwRendererError = true;
    const canvas = { width: 300, height: 150 } as unknown as HTMLCanvasElement;
    expect(createAuroraRenderer({ canvas })).toBeNull();

    throwRendererError = false;
    nullGl = true;
    expect(createAuroraRenderer({ canvas })).toBeNull();
  });
});

describe('seasonAuroraRenderer - Lifecycle & Animation', () => {
  it('initializes renderer and covers all shader options and branches', () => {
    let rafCallback: FrameRequestCallback | null = null;
    globalThis.requestAnimationFrame = vi.fn((cb) => {
      rafCallback = cb;
      return 42;
    });
    triangleHasUv = false;
    hasLoseContext = false;

    const canvas = { width: 0, height: 0 } as unknown as HTMLCanvasElement;
    const handle = createAuroraRenderer({
      canvas,
      colors: {
        cyan: [0.05, 0.6, 0.7],
        green: [0.1, 0.8, 0.2],
        red: [0.8, 0.1, 0.2],
      },
    });
    expect(handle).not.toBeNull();

    if (rafCallback) {
      (rafCallback as FrameRequestCallback)(100);
      (rafCallback as FrameRequestCallback)(250);
    }

    handle?.resize(1200, 600);
    handle?.resize(0, 0);
    handle?.destroy();
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalledWith(42);
  });
});

describe('seasonAuroraRenderer - attachAuroraLifecycle', () => {
  it('manages attachAuroraLifecycle with DOM resize and ResizeObserver', () => {
    const parent = { clientWidth: 1000, clientHeight: 800 };
    const canvas = {
      width: 500,
      height: 400,
      parentElement: parent,
    } as unknown as HTMLCanvasElement;

    let resizeCallback: (() => void) | null = null;
    const originalRO = globalThis.ResizeObserver;
    const mockDisconnect = vi.fn();
    globalThis.ResizeObserver = class {
      observe = vi.fn();
      disconnect = mockDisconnect;
      constructor(cb: () => void) {
        resizeCallback = cb;
      }
    } as unknown as typeof ResizeObserver;

    const originalWindow = globalThis.window;
    const mockAddListener = vi.fn();
    const mockRemoveListener = vi.fn();
    // @ts-expect-error simulating browser window
    globalThis.window = {
      addEventListener: mockAddListener,
      removeEventListener: mockRemoveListener,
    };

    try {
      const cleanup = attachAuroraLifecycle(canvas);
      if (resizeCallback) {
        (resizeCallback as () => void)();
      }

      cleanup();
      expect(mockDisconnect).toHaveBeenCalled();
      expect(mockRemoveListener).toHaveBeenCalled();

      // Test when createAuroraRenderer returns null
      throwRendererError = true;
      const noopCleanup = attachAuroraLifecycle(canvas);
      expect(typeof noopCleanup).toBe('function');
      noopCleanup();
    } finally {
      globalThis.ResizeObserver = originalRO;
      globalThis.window = originalWindow;
    }
  });
});

describe('seasonAuroraRenderer - attachAuroraLifecycle Edge Cases', () => {
  it('handles attachAuroraLifecycle with missing parent, zero bounds, and SSR', () => {
    const canvasNoParent = {
      width: 500,
      height: 400,
      parentElement: null,
    } as unknown as HTMLCanvasElement;
    const canvasZero = {
      width: 500,
      height: 400,
      parentElement: { clientWidth: 0, clientHeight: 0 },
    } as unknown as HTMLCanvasElement;

    const originalRO = globalThis.ResizeObserver;
    const originalWindow = globalThis.window;
    // @ts-expect-error simulating SSR
    delete globalThis.ResizeObserver;
    // @ts-expect-error simulating SSR
    delete globalThis.window;

    try {
      const cleanup1 = attachAuroraLifecycle(canvasNoParent);
      cleanup1();
      const cleanup2 = attachAuroraLifecycle(canvasZero);
      cleanup2();
    } finally {
      globalThis.ResizeObserver = originalRO;
      globalThis.window = originalWindow;
    }
  });
});
