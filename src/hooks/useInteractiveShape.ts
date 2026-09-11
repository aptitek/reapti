import { useState } from 'react';
import type { FocusEvent, PointerEvent } from 'react';
import type { ShapeName } from '@m3e/web/shape';
import { toExpressiveShape } from '../tokens/shapes.ts';

export type InteractiveShapeName = ShapeName | string;

export interface InteractiveCallbacks<T = HTMLElement> {
  onPointerEnter?: (e: PointerEvent<T>) => void;
  onPointerLeave?: (e: PointerEvent<T>) => void;
  onFocus?: (e: FocusEvent<T>) => void;
  onBlur?: (e: FocusEvent<T>) => void;
}

export function resolveActiveShape(
  shape: InteractiveShapeName,
  targetShape: InteractiveShapeName | undefined,
  isShifted: boolean
): ShapeName {
  return toExpressiveShape(isShifted && targetShape ? targetShape : shape);
}

export function useInteractiveShape<T = HTMLElement>(
  shape: InteractiveShapeName = 'rounded',
  targetShape?: InteractiveShapeName,
  callbacks?: InteractiveCallbacks<T>
) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isShifted = Boolean(targetShape && (isHovered || isFocused));
  const activeShape = resolveActiveShape(shape, targetShape, isShifted);

  const handlePointerEnter = (e: PointerEvent<T>) => {
    setIsHovered(true);
    callbacks?.onPointerEnter?.(e);
  };
  const handlePointerLeave = (e: PointerEvent<T>) => {
    setIsHovered(false);
    callbacks?.onPointerLeave?.(e);
  };
  const handleFocus = (e: FocusEvent<T>) => {
    setIsFocused(true);
    callbacks?.onFocus?.(e);
  };
  const handleBlur = (e: FocusEvent<T>) => {
    setIsFocused(false);
    callbacks?.onBlur?.(e);
  };

  return {
    activeShape,
    handlePointerEnter,
    handlePointerLeave,
    handleFocus,
    handleBlur,
  };
}
