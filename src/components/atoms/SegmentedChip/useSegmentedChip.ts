import { useCallback } from 'react';
import type {
  SegmentedChipProps,
  SegmentedChipItemConfig,
} from './SegmentedChip.types.ts';

export interface UseSegmentedChipResult {
  handleItemClick: (item: SegmentedChipItemConfig) => void;
}

export function useSegmentedChip(
  props: SegmentedChipProps
): UseSegmentedChipResult {
  const handleItemClick = useCallback(
    (item: SegmentedChipItemConfig) => {
      if (props.disabled || item.disabled) {
        return;
      }
      item.onClick?.();
    },
    [props.disabled]
  );

  return {
    handleItemClick,
  };
}
