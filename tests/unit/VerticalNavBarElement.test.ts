import { describe, it, expect, vi } from 'vitest';
import { M3eNavBarElement } from '@m3e/web/nav-bar';
import {
  VerticalNavBarElement,
  M3eVerticalNavBar,
} from '../../src/components/molecules/VerticalNavBar/VerticalNavBarElement.ts';

describe('VerticalNavBarElement Inheritance & Registry', () => {
  it('extends M3eNavBarElement and registers custom element', () => {
    expect(VerticalNavBarElement.prototype instanceof M3eNavBarElement).toBe(
      true
    );
    expect(customElements.get('vertical-nav-bar')).toBe(VerticalNavBarElement);
    expect(M3eVerticalNavBar).toBeDefined();
    expect(Array.isArray(VerticalNavBarElement.styles)).toBe(true);
  });

  it('instantiates cleanly with compact default mode', () => {
    const el = new VerticalNavBarElement();
    expect(el.mode).toBe('compact');
  });

  it('filters navigable items correctly', () => {
    const el = new VerticalNavBarElement();
    const itemDisabled = {
      hasAttribute: (a: string) => a === 'disabled',
    };
    const itemEnabled = { hasAttribute: () => false };

    el.querySelectorAll = vi
      .fn()
      .mockReturnValue([
        itemDisabled,
        itemEnabled,
      ]) as unknown as typeof el.querySelectorAll;
    expect(el.getNavigableItems().length).toBe(1);

    const bare = Object.create(VerticalNavBarElement.prototype);
    expect(bare.getNavigableItems()).toEqual([]);
  });

  it('updates orientation via _updateOrientation', () => {
    const el = new VerticalNavBarElement();
    const spy = vi.spyOn(M3eNavBarElement.prototype, '_updateOrientation');
    el._updateOrientation('vertical');
    expect(spy).toHaveBeenCalledWith('vertical');
    spy.mockRestore();
  });
});

describe('VerticalNavBarElement Target Index Resolution', () => {
  it('resolves target index correctly for all navigation keys', () => {
    const el = new VerticalNavBarElement();
    expect(el.resolveTargetIndex('ArrowDown', 0, 3)).toBe(1);
    expect(el.resolveTargetIndex('ArrowDown', -1, 3)).toBe(0);
    expect(el.resolveTargetIndex('ArrowUp', 2, 3)).toBe(1);
    expect(el.resolveTargetIndex('ArrowUp', -1, 3)).toBe(2);
    expect(el.resolveTargetIndex('Home', 1, 3)).toBe(0);
    expect(el.resolveTargetIndex('End', 1, 3)).toBe(2);
    expect(el.resolveTargetIndex('Tab', 1, 3)).toBe(1);
  });

  it('attaches and removes keydown listener upon connect and disconnect', () => {
    const el = new VerticalNavBarElement();
    const superConnect = vi
      .spyOn(M3eNavBarElement.prototype, 'connectedCallback')
      .mockImplementation(() => {});
    const superDisconnect = vi
      .spyOn(M3eNavBarElement.prototype, 'disconnectedCallback')
      .mockImplementation(() => {});

    el.connectedCallback();
    el.disconnectedCallback();

    const g = globalThis as unknown as { document?: unknown };
    g.document = {};
    el.connectedCallback();
    el.disconnectedCallback();
    delete g.document;

    expect(superConnect).toHaveBeenCalled();
    expect(superDisconnect).toHaveBeenCalled();
    superConnect.mockRestore();
    superDisconnect.mockRestore();
  });
});

describe('VerticalNavBarElement Keyboard Event Handling', () => {
  it('handles arrow navigation keys and prevents default', () => {
    const el = new VerticalNavBarElement();
    const mockItem1 = { focus: vi.fn() } as unknown as HTMLElement;
    const mockItem2 = { focus: vi.fn() } as unknown as HTMLElement;

    vi.spyOn(el, 'getNavigableItems').mockReturnValue([mockItem1, mockItem2]);
    vi.spyOn(el, 'getRootNode').mockReturnValue({
      activeElement: mockItem1,
    } as unknown as Node);

    const preventDefault = vi.fn();
    el.handleKeyDown({
      key: 'ArrowDown',
      preventDefault,
    } as unknown as KeyboardEvent);
    expect(preventDefault).toHaveBeenCalled();
    expect(mockItem2.focus).toHaveBeenCalled();

    el.handleKeyDown({
      key: 'ArrowUp',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent);
  });

  it('handles boundary keys and edge cases', () => {
    const el = new VerticalNavBarElement();
    const mockItem = { focus: vi.fn() } as unknown as HTMLElement;

    vi.spyOn(el, 'getNavigableItems').mockReturnValue([mockItem]);
    vi.spyOn(el, 'getRootNode').mockReturnValue({} as unknown as Node);
    el.handleKeyDown({
      key: 'End',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent);

    const bare = Object.create(VerticalNavBarElement.prototype);
    bare.resolveTargetIndex = el.resolveTargetIndex;
    bare.getNavigableItems = () => [mockItem];
    bare.handleKeyDown = el.handleKeyDown;
    bare.handleKeyDown({
      key: 'Home',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent);

    const ignored = vi.fn();
    el.handleKeyDown({
      key: 'Escape',
      preventDefault: ignored,
    } as unknown as KeyboardEvent);
    expect(ignored).not.toHaveBeenCalled();

    vi.spyOn(el, 'getNavigableItems').mockReturnValue([]);
    el.handleKeyDown({
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent);
  });
});
