import { useState, useCallback, useRef } from 'react';
import type {
  VerticalNavBarProps,
  VerticalNavBarItemConfig,
  VerticalNavBarElement,
} from './VerticalNavBar.types.ts';

import {
  resolveEffectiveMode,
  resolveActiveIndex,
} from './verticalNavBarHelpers.ts';

export interface UseVerticalNavBarReturn {
  effectiveMode: 'compact' | 'expanded';
  isExpanded: boolean;
  activeIndex: number;
  rootRef: React.RefObject<VerticalNavBarElement | null>;
  handleToggle: () => void;
  handleSelect: (index: number, item?: VerticalNavBarItemConfig) => void;
}

export function useVerticalNavBar(
  props: VerticalNavBarProps
): UseVerticalNavBarReturn {
  const rootRef = useRef<VerticalNavBarElement | null>(null);
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [internalIndex, setInternalIndex] = useState(props.defaultIndex ?? 0);

  const isControlled =
    props.isExpanded !== undefined || props.mode !== undefined;
  const effectiveMode = resolveEffectiveMode(
    props.mode,
    isControlled ? props.isExpanded : internalExpanded
  );
  const isExpanded = effectiveMode === 'expanded';
  const activeIndex = resolveActiveIndex(props, internalIndex);

  const handleToggle = useCallback(() => {
    const next = !isExpanded;
    setInternalExpanded(next);
    const nextMode = next ? 'expanded' : 'compact';
    props.onModeChange?.(nextMode);
  }, [isExpanded, props]);

  const handleSelect = useCallback(
    (index: number, item?: VerticalNavBarItemConfig) => {
      setInternalIndex(index);
      props.onSelect?.(index, item);
    },
    [props]
  );

  return {
    effectiveMode,
    isExpanded,
    activeIndex,
    rootRef,
    handleToggle,
    handleSelect,
  };
}
