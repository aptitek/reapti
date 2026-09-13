import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  usePrintPage,
  type UsePrintPageReturn,
} from '../../src/components/organisms/PrintPage/usePrintPage.ts';

function runHook(runner: () => void): () => void {
  const internals = (
    React as unknown as {
      __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
        H?: { useEffect?: (eff: () => (() => void) | void) => void };
      };
    }
  ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

  const cleanups: (() => void)[] = [];
  function Probe() {
    if (internals?.H) {
      internals.H.useEffect = (eff) => {
        const cleanup = eff();
        if (typeof cleanup === 'function') cleanups.push(cleanup);
      };
    }
    runner();
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return () => cleanups.forEach((c) => c());
}

let listeners: Record<string, (e: unknown) => void> = {};

function setupWindowMock() {
  listeners = {};
  vi.stubGlobal('window', {
    location: { search: '' },
    setTimeout: (fn: () => void) => {
      fn();
      return 1;
    },
    clearTimeout: () => {},
    addEventListener: (type: string, handler: (e: unknown) => void) => {
      listeners[type] = handler;
    },
    removeEventListener: (type: string) => {
      delete listeners[type];
    },
  });
}

describe('usePrintPage State Initialization and Modes', () => {
  beforeEach(setupWindowMock);
  afterEach(() => vi.unstubAllGlobals());

  it('initializes with default vertical mode and first page', () => {
    let hookApi: UsePrintPageReturn | null = null;
    runHook(() => {
      hookApi = usePrintPage({ totalPages: 3 });
    });
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.viewMode).toBe('vertical');
    expect(hookApi.currentPage).toBe(1);
    expect(hookApi.isPdfMode).toBe(false);
    expect(hookApi.flipDirection).toBe('idle');
  });

  it('updates view mode and triggers onModeChange callback', () => {
    let hookApi: UsePrintPageReturn | null = null;
    const onModeChange = vi.fn();

    runHook(() => {
      hookApi = usePrintPage({
        totalPages: 4,
        defaultMode: 'vertical',
        onModeChange,
      });
    });
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    hookApi.setViewMode('horizontal');
    expect(onModeChange).toHaveBeenCalledWith('horizontal');
  });

  it('honors controlled view mode and PDF override', () => {
    let hookApi: UsePrintPageReturn | null = null;
    runHook(() => {
      hookApi = usePrintPage({
        totalPages: 4,
        controlledMode: 'flip',
      });
    });
    expect(hookApi?.viewMode).toBe('flip');

    runHook(() => {
      hookApi = usePrintPage({
        totalPages: 5,
        controlledMode: 'flip',
        isPdf: true,
      });
    });
    expect(hookApi?.isPdfMode).toBe(true);
    expect(hookApi?.viewMode).toBe('vertical');
  });
});

describe('usePrintPage Page Navigation Actions', () => {
  beforeEach(setupWindowMock);
  afterEach(() => vi.unstubAllGlobals());

  it('safely handles navigation callbacks across boundaries', () => {
    let hookApi: UsePrintPageReturn | null = null;
    runHook(() => {
      hookApi = usePrintPage({ totalPages: 5, initialPage: 3 });
    });
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    hookApi.goToPage(4);
    hookApi.goToPage(1);
    hookApi.goToPage(3);
    hookApi.nextPage();
    hookApi.prevPage();
  });

  it('handles boundary conditions on first and last pages', () => {
    let firstPageHook: UsePrintPageReturn | null = null;
    runHook(() => {
      firstPageHook = usePrintPage({ totalPages: 3, initialPage: 1 });
    });
    firstPageHook?.prevPage();

    let lastPageHook: UsePrintPageReturn | null = null;
    runHook(() => {
      lastPageHook = usePrintPage({ totalPages: 3, initialPage: 3 });
    });
    lastPageHook?.nextPage();
  });
});

describe('usePrintPage Flip Mode Lifecycle', () => {
  beforeEach(setupWindowMock);
  afterEach(() => vi.unstubAllGlobals());

  it('manages targetPage, flipDirection, and completeFlip lifecycle', () => {
    let hookApi: UsePrintPageReturn | null = null;
    runHook(() => {
      hookApi = usePrintPage({ totalPages: 4, defaultMode: 'flip' });
    });
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.currentPage).toBe(1);
    expect(hookApi.targetPage).toBe(1);
    expect(hookApi.flipDirection).toBe('idle');

    hookApi.nextPage();
    hookApi.prevPage();
    hookApi.completeFlip();
    hookApi.goToPage(3);
    hookApi.completeFlip();
  });
});

describe('usePrintPage Keyboard Navigation', () => {
  beforeEach(setupWindowMock);
  afterEach(() => vi.unstubAllGlobals());

  it('handles keyboard arrow navigation in horizontal and flip mode', () => {
    let hookApi: UsePrintPageReturn | null = null;
    const cleanup = runHook(() => {
      hookApi = usePrintPage({
        totalPages: 4,
        defaultMode: 'flip',
      });
    });
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    const keydownHandler = listeners['keydown'];
    expect(keydownHandler).toBeDefined();

    keydownHandler?.({ key: 'ArrowRight' });
    keydownHandler?.({ key: 'PageDown' });
    keydownHandler?.({ key: 'ArrowLeft' });
    keydownHandler?.({ key: 'PageUp' });
    keydownHandler?.({ key: 'Escape' });

    cleanup();
    expect(listeners['keydown']).toBeUndefined();
  });
});
