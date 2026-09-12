import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSegmentedChip } from '../../src/components/atoms/SegmentedChip/useSegmentedChip.ts';
import type {
  SegmentedChipProps,
  SegmentedChipItemConfig,
} from '../../src/components/atoms/SegmentedChip/SegmentedChip.types.ts';

function renderHookHelper(props: SegmentedChipProps) {
  let result: ReturnType<typeof useSegmentedChip> | null = null;
  function Probe() {
    result = useSegmentedChip(props);
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return result!;
}

describe('useSegmentedChip hook', () => {
  it('triggers item.onClick on click when enabled', () => {
    const onClick = vi.fn();
    const item: SegmentedChipItemConfig = {
      id: 'test-1',
      label: 'Test Item',
      onClick,
    };

    const hook = renderHookHelper({});
    hook.handleItemClick(item);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger item.onClick when container is disabled', () => {
    const onClick = vi.fn();
    const item: SegmentedChipItemConfig = {
      id: 'test-1',
      label: 'Test Item',
      onClick,
    };

    const hook = renderHookHelper({ disabled: true });
    hook.handleItemClick(item);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not trigger item.onClick when item is disabled', () => {
    const onClick = vi.fn();
    const item: SegmentedChipItemConfig = {
      id: 'test-1',
      label: 'Test Item',
      disabled: true,
      onClick,
    };

    const hook = renderHookHelper({ disabled: false });
    hook.handleItemClick(item);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('safely handles items without onClick callback', () => {
    const item: SegmentedChipItemConfig = {
      id: 'test-1',
      label: 'Test Item',
    };

    const hook = renderHookHelper({});
    expect(() => hook.handleItemClick(item)).not.toThrow();
  });
});
