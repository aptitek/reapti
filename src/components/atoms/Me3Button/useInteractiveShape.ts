import { useState } from 'react';
import type { FocusEvent, PointerEvent } from 'react';
import type { M3eButtonElement } from '@m3e/web/button';
import { toExpressiveShape } from '../../../tokens/shapes.ts';
import type { ShapeName } from '@m3e/web/shape';
import type { Me3Shape } from './Me3Button.tsx';

export interface InteractiveCallbacks {
  onPointerEnter?: (e: PointerEvent<M3eButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<M3eButtonElement>) => void;
  onFocus?: (e: FocusEvent<M3eButtonElement>) => void;
  onBlur?: (e: FocusEvent<M3eButtonElement>) => void;
}

export function resolveActiveShape(
  shape: Me3Shape,
  targetShape: Me3Shape | undefined,
  isShifted: boolean
): ShapeName {
  return toExpressiveShape(isShifted && targetShape ? targetShape : shape);
}

export function useInteractiveShape(
  shape: Me3Shape = 'rounded',
  targetShape?: Me3Shape,
  callbacks?: InteractiveCallbacks
) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isShifted = Boolean(targetShape && (isHovered || isFocused));
  const activeShape = resolveActiveShape(shape, targetShape, isShifted);

  const handlePointerEnter = (e: PointerEvent<M3eButtonElement>) => {
    setIsHovered(true);
    callbacks?.onPointerEnter?.(e);
  };
  const handlePointerLeave = (e: PointerEvent<M3eButtonElement>) => {
    setIsHovered(false);
    callbacks?.onPointerLeave?.(e);
  };
  const handleFocus = (e: FocusEvent<M3eButtonElement>) => {
    setIsFocused(true);
    callbacks?.onFocus?.(e);
  };
  const handleBlur = (e: FocusEvent<M3eButtonElement>) => {
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
