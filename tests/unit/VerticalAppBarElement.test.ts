import { describe, it, expect, vi } from 'vitest';
import { M3eAppBarElement } from '@m3e/web/app-bar';
import {
  VerticalAppBarElement,
  M3eVerticalAppBar,
} from '../../src/components/molecules/VerticalAppBar/VerticalAppBarElement.ts';

describe('VerticalAppBarElement: Inheritance & Lifecycle', () => {
  it('extends M3eAppBarElement and registers custom element', () => {
    expect(VerticalAppBarElement.prototype instanceof M3eAppBarElement).toBe(
      true
    );
    expect(customElements.get('vertical-app-bar')).toBe(VerticalAppBarElement);
    expect(M3eVerticalAppBar).toBeDefined();
    expect(Array.isArray(VerticalAppBarElement.styles)).toBe(true);
  });

  it('instantiates cleanly with left default side and compact mode', () => {
    const el = new VerticalAppBarElement();
    expect(el.side).toBe('left');
    expect(el.mode).toBe('compact');
    expect(el.elevated).toBe(false);
  });

  it('renders slot template with top, middle, and bottom sections', () => {
    const el = new VerticalAppBarElement();
    const template = el.render();
    expect(template).toBeDefined();
  });
});

describe('VerticalAppBarElement: Window Scroll Listener Management', () => {
  it('attaches window scroll listener on connectedCallback when htmlFor is not set', () => {
    const el = new VerticalAppBarElement();
    let scrollCallback: (() => void) | undefined;
    const fakeWindow = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'scroll') scrollCallback = handler;
      }),
      removeEventListener: vi.fn(),
      scrollY: 50,
      document: { documentElement: { scrollTop: 0 } },
    };

    const originalWindow = (globalThis as unknown as { window?: unknown })
      .window;
    (globalThis as unknown as { window?: unknown }).window = fakeWindow;

    const baseClassList = {
      toggle: vi.fn(),
    };
    (el as unknown as { renderRoot: { querySelector: unknown } }).renderRoot = {
      querySelector: vi.fn().mockReturnValue({ classList: baseClassList }),
    };

    el.connectedCallback();
    expect(fakeWindow.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );

    scrollCallback?.();
    expect(baseClassList.toggle).toHaveBeenCalledWith('on-scroll', true);

    fakeWindow.scrollY = 0;
    scrollCallback?.();
    expect(baseClassList.toggle).toHaveBeenCalledWith('on-scroll', false);

    el.disconnectedCallback();
    expect(fakeWindow.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );

    (globalThis as unknown as { window?: unknown }).window = originalWindow;
  });

  it('skips window scroll listener when htmlFor is specified', () => {
    const el = new VerticalAppBarElement();
    el.htmlFor = 'custom-scroller';

    const fakeWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollY: 10,
    };
    const originalWindow = (globalThis as unknown as { window?: unknown })
      .window;
    (globalThis as unknown as { window?: unknown }).window = fakeWindow;

    el.connectedCallback();
    expect(fakeWindow.addEventListener).not.toHaveBeenCalled();

    el.disconnectedCallback();
    (globalThis as unknown as { window?: unknown }).window = originalWindow;
  });
});

describe('VerticalAppBarElement: Lifecycle Callbacks', () => {
  it('handles connectedCallback and disconnectedCallback lifecycle and duplicate calls', () => {
    const superConnect = vi
      .spyOn(M3eAppBarElement.prototype, 'connectedCallback')
      .mockImplementation(() => {});
    const superDisconnect = vi
      .spyOn(M3eAppBarElement.prototype, 'disconnectedCallback')
      .mockImplementation(() => {});

    const el = new VerticalAppBarElement();
    const fakeWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollY: 0,
    };
    const originalWindow = (globalThis as unknown as { window?: unknown })
      .window;
    const originalDocument = (globalThis as unknown as { document?: unknown })
      .document;
    (globalThis as unknown as { window?: unknown }).window = fakeWindow;
    (globalThis as unknown as { document?: unknown }).document = {};

    // First connect attaches listener and invokes super
    el.connectedCallback();
    expect(fakeWindow.addEventListener).toHaveBeenCalledTimes(1);
    expect(superConnect).toHaveBeenCalledTimes(1);

    // Second connect is a no-op (already attached)
    el.connectedCallback();
    expect(fakeWindow.addEventListener).toHaveBeenCalledTimes(1);

    // First disconnect removes listener and invokes super
    el.disconnectedCallback();
    expect(fakeWindow.removeEventListener).toHaveBeenCalledTimes(1);
    expect(superDisconnect).toHaveBeenCalledTimes(1);

    // Second disconnect is a no-op
    el.disconnectedCallback();
    expect(fakeWindow.removeEventListener).toHaveBeenCalledTimes(1);

    // Disconnect when window is undefined
    (globalThis as unknown as { window?: unknown }).window = undefined;
    el.disconnectedCallback();

    // Connect when window is undefined
    el.connectedCallback();

    (globalThis as unknown as { window?: unknown }).window = originalWindow;
    (globalThis as unknown as { document?: unknown }).document =
      originalDocument;
    superConnect.mockRestore();
    superDisconnect.mockRestore();
  });
});

describe('VerticalAppBarElement: Slot Content Toggling', () => {
  it('toggles top-section visibility via firstUpdated and slotchange', () => {
    const el = new VerticalAppBarElement();
    const topSectionClassList = { toggle: vi.fn() };
    const mockHeaderSlot = {
      assignedElements: vi.fn().mockReturnValue([{ id: 'brand-logo' }]),
    };
    const mockLeadingSlot = {
      assignedElements: vi.fn().mockReturnValue([]),
    };

    (el as unknown as { renderRoot: { querySelector: unknown } }).renderRoot = {
      querySelector: vi.fn().mockImplementation((sel: string) => {
        if (sel === 'slot[name="header"]') return mockHeaderSlot;
        if (sel === 'slot[name="leading"]') return mockLeadingSlot;
        if (sel === '.top-section') return { classList: topSectionClassList };
        return null;
      }),
    };

    el.firstUpdated();
    expect(topSectionClassList.toggle).toHaveBeenCalledWith(
      'has-content',
      true
    );

    mockHeaderSlot.assignedElements.mockReturnValue([]);
    el.firstUpdated();
    expect(topSectionClassList.toggle).toHaveBeenCalledWith(
      'has-content',
      false
    );
  });

  it('handles slot without assignedElements or leading only in _hasSlotContent', () => {
    const el = new VerticalAppBarElement();
    const topSectionClassList = { toggle: vi.fn() };
    (el as unknown as { renderRoot: { querySelector: unknown } }).renderRoot = {
      querySelector: vi.fn().mockImplementation((sel: string) => {
        if (sel === 'slot[name="header"]')
          return { assignedElements: () => undefined };
        if (sel === 'slot[name="leading"]')
          return { assignedElements: () => [{ id: 'lead' }] };
        if (sel === '.top-section') return { classList: topSectionClassList };
        return null;
      }),
    };

    el.firstUpdated();
    expect(topSectionClassList.toggle).toHaveBeenCalledWith(
      'has-content',
      true
    );
  });
});

describe('VerticalAppBarElement: Scroll Position Handling', () => {
  it('returns early in _handleWindowScroll when htmlFor is set', () => {
    const el = new VerticalAppBarElement();
    el.htmlFor = 'some-scroller';
    const baseClassList = { toggle: vi.fn() };
    (el as unknown as { renderRoot: { querySelector: unknown } }).renderRoot = {
      querySelector: vi.fn().mockReturnValue({ classList: baseClassList }),
    };
    (
      el as unknown as { _handleWindowScroll: () => void }
    )._handleWindowScroll();
    expect(baseClassList.toggle).not.toHaveBeenCalled();
  });

  it('evaluates scrollTop from documentElement when window.scrollY is 0', () => {
    const el = new VerticalAppBarElement();
    const fakeWindow = {
      scrollY: 0,
    };
    const originalWindow = (globalThis as unknown as { window?: unknown })
      .window;
    const originalDocument = (globalThis as unknown as { document?: unknown })
      .document;
    (globalThis as unknown as { window?: unknown }).window = fakeWindow;
    (globalThis as unknown as { document?: unknown }).document = {
      documentElement: { scrollTop: 75 },
    };

    const baseClassList = { toggle: vi.fn() };
    (el as unknown as { renderRoot: { querySelector: unknown } }).renderRoot = {
      querySelector: vi.fn().mockReturnValue({ classList: baseClassList }),
    };

    (
      el as unknown as { _handleWindowScroll: () => void }
    )._handleWindowScroll();
    expect(baseClassList.toggle).toHaveBeenCalledWith('on-scroll', true);

    (globalThis as unknown as { window?: unknown }).window = originalWindow;
    (globalThis as unknown as { document?: unknown }).document =
      originalDocument;
  });
});
