import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useVerticalAppBar } from '../../src/components/molecules/VerticalAppBar/useVerticalAppBar.ts';
import type { VerticalAppBarProps } from '../../src/components/molecules/VerticalAppBar/VerticalAppBar.types.ts';

function renderHookHelper(props: VerticalAppBarProps) {
  let result: ReturnType<typeof useVerticalAppBar> | null = null;
  function Probe() {
    result = useVerticalAppBar(props);
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return result!;
}

describe('useVerticalAppBar Hook', () => {
  it('initializes with default left side and false elevation', () => {
    const hook = renderHookHelper({});
    expect(hook.side).toBe('left');
    expect(hook.isScrolled).toBe(false);
    expect(hook.isElevated).toBe(false);
  });

  it('respects right side configuration and explicit elevation', () => {
    const hook = renderHookHelper({ side: 'right', elevated: true });
    expect(hook.side).toBe('right');
    expect(hook.isScrolled).toBe(false);
    expect(hook.isElevated).toBe(true);
  });
});
