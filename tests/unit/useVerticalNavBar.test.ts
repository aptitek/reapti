import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useVerticalNavBar } from '../../src/components/molecules/VerticalNavBar/useVerticalNavBar.ts';
import type {
  VerticalNavBarProps,
  VerticalNavBarItemConfig,
} from '../../src/components/molecules/VerticalNavBar/VerticalNavBar.types.ts';

function renderHookHelper(props: VerticalNavBarProps) {
  let result: ReturnType<typeof useVerticalNavBar> | null = null;
  function Probe() {
    result = useVerticalNavBar(props);
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return result!;
}

describe('useVerticalNavBar Modes', () => {
  it('initializes with expanded mode by default', () => {
    const hook = renderHookHelper({});
    expect(hook.effectiveMode).toBe('expanded');
    expect(hook.isExpanded).toBe(true);
    expect(hook.activeIndex).toBe(0);
  });

  it('initializes in compact mode when mode="compact"', () => {
    const hook = renderHookHelper({ mode: 'compact' });
    expect(hook.effectiveMode).toBe('compact');
    expect(hook.isExpanded).toBe(false);
  });

  it('initializes in expanded mode when mode="expanded"', () => {
    const hook = renderHookHelper({ mode: 'expanded' });
    expect(hook.effectiveMode).toBe('expanded');
    expect(hook.isExpanded).toBe(true);
  });

  it('initializes in expanded mode when isExpanded=true', () => {
    const hook = renderHookHelper({ isExpanded: true });
    expect(hook.effectiveMode).toBe('expanded');
    expect(hook.isExpanded).toBe(true);
  });

  it('toggles mode and invokes onModeChange', () => {
    const onModeChange = vi.fn();
    const hook = renderHookHelper({ onModeChange });

    hook.handleToggle();
    expect(onModeChange).toHaveBeenCalledWith('compact');

    const compactHook = renderHookHelper({ mode: 'compact', onModeChange });
    compactHook.handleToggle();
    expect(onModeChange).toHaveBeenCalledWith('expanded');
  });
});

describe('useVerticalNavBar Selection', () => {
  it('updates activeIndex and invokes onSelect', () => {
    const onSelect = vi.fn();
    const item: VerticalNavBarItemConfig = { id: 'search', label: 'Search' };
    const hook = renderHookHelper({ onSelect });

    hook.handleSelect(2, item);
    expect(onSelect).toHaveBeenCalledWith(2, item);
  });

  it('respects initial selectedIndex', () => {
    const hook = renderHookHelper({ selectedIndex: 3 });
    expect(hook.activeIndex).toBe(3);
  });

  it('respects defaultIndex when selectedIndex is omitted', () => {
    const hook = renderHookHelper({ defaultIndex: 2 });
    expect(hook.activeIndex).toBe(2);
  });

  it('resolves activeIndex from selectedId matching item list', () => {
    const items: VerticalNavBarItemConfig[] = [
      { id: 'home', label: 'Home' },
      { id: 'search', label: 'Search' },
    ];
    const hook = renderHookHelper({ items, selectedId: 'search' });
    expect(hook.activeIndex).toBe(1);

    const fallbackHook = renderHookHelper({ items, selectedId: 'unknown' });
    expect(fallbackHook.activeIndex).toBe(0);
  });
});
