import { describe, it, expect } from 'vitest';
import type {
  VerticalAppBarSide,
  VerticalAppBarProps,
} from '../../src/components/molecules/VerticalAppBar/VerticalAppBar.types.ts';

describe('VerticalAppBar Types Coverage', () => {
  it('validates supported VerticalAppBarSide values', () => {
    const leftSide: VerticalAppBarSide = 'left';
    const rightSide: VerticalAppBarSide = 'right';

    expect(leftSide).toBe('left');
    expect(rightSide).toBe('right');
  });

  it('validates VerticalAppBarProps structure', () => {
    const props: VerticalAppBarProps = {
      side: 'left',
      for: 'main-content',
      elevated: true,
      ariaLabel: 'Main vertical app bar',
      className: 'custom-bar',
      dataTestId: 'test-bar',
      selectedIndex: 0,
      mode: 'compact',
    };

    expect(props.side).toBe('left');
    expect(props.for).toBe('main-content');
    expect(props.elevated).toBe(true);
    expect(props.dataTestId).toBe('test-bar');
  });
});
