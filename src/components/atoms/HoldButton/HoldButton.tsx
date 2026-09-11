import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Box, panda } from 'styled-system/jsx';
import type { M3eButtonElement } from '@m3e/web/button';
import { Me3Button } from '../Me3Button/Me3Button.tsx';
import type { Me3ButtonProps, Me3Shape } from '../Me3Button/Me3Button.tsx';
import { resolveBorderPath } from '../../../tokens/shapes.ts';
import { useHoldGesture } from './useHoldGesture.ts';

export interface HoldButtonProps extends Me3ButtonProps {
  onHoldComplete: () => void;
  holdTime?: number;
  borderThickness?: number;
  outlineGap?: number;
  shape?: Me3Shape;
  width?: number;
  height?: number;
}

function resolveDimensions(
  shape: Me3Shape | undefined,
  width?: number,
  height?: number
): { width: number; height: number } {
  if (width !== undefined && height !== undefined) {
    return { width, height };
  }
  if (shape && shape !== 'rounded' && shape !== 'square') {
    return { width: 48, height: 48 };
  }
  return { width: width ?? 120, height: height ?? 40 };
}

interface OverlayProps {
  shape?: Me3Shape;
  dimensions: { width: number; height: number };
  outlineGap: number;
  borderThickness: number;
  isHolding: boolean;
  holdTime: number;
}

function resolveOverlayTransition(
  isHolding: boolean,
  holdTime: number
): string {
  if (isHolding) {
    return `stroke-dashoffset ${holdTime}ms var(--easings-emphasized, cubic-bezier(0.2, 0, 0, 1)), opacity 150ms ease`;
  }
  return `stroke-dashoffset 250ms var(--easings-emphasized-decelerate, cubic-bezier(0.05, 0.7, 0.1, 1.0)), opacity 200ms ease`;
}

export function HoldBorderOverlay({
  shape,
  dimensions,
  outlineGap,
  borderThickness,
  isHolding,
  holdTime,
}: OverlayProps): ReactNode {
  const totalOffset = outlineGap + borderThickness / 2;
  const outerWidth = dimensions.width + 2 * totalOffset;
  const outerHeight = dimensions.height + 2 * totalOffset;

  const pathD = resolveBorderPath({
    shape,
    bounds: {
      x: borderThickness / 2,
      y: borderThickness / 2,
      width: dimensions.width + 2 * outlineGap,
      height: dimensions.height + 2 * outlineGap,
    },
  });

  const offset = isHolding ? 0 : 100;
  const transition = resolveOverlayTransition(isHolding, holdTime);

  return (
    <panda.svg
      position="absolute"
      top={`-${totalOffset}px`}
      left={`-${totalOffset}px`}
      width={`${outerWidth}px`}
      height={`${outerHeight}px`}
      viewBox={`0 0 ${outerWidth} ${outerHeight}`}
      pointerEvents="none"
      aria-hidden="true"
    >
      <panda.path
        d={pathD}
        fill="none"
        stroke="var(--colors-primary)"
        strokeWidth={borderThickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={offset}
        opacity={isHolding ? 1 : 0}
        transition={transition}
      />
    </panda.svg>
  );
}

/**
 * Atomic hold button component implementing Material Design 3 physics.
 * Features a spring border tracing the button geometry and tactile shake feedback.
 */
export const HoldButton = forwardRef<M3eButtonElement, HoldButtonProps>(
  (
    {
      onHoldComplete,
      holdTime = 1000,
      borderThickness = 2.5,
      outlineGap = 4,
      shape = 'rounded',
      width,
      height,
      children,
      ...restProps
    },
    forwardedRef
  ) => {
    const dimensions = resolveDimensions(shape, width, height);
    const { isHolding, isShaking, startHold, cancelHold } = useHoldGesture({
      holdTime,
      onHoldComplete,
    });

    const shakeClass = isShaking ? 'hold-button-shake' : undefined;

    return (
      <Box
        position="relative"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        className={shakeClass}
      >
        <Me3Button
          ref={forwardedRef}
          shape={shape}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          {...restProps}
        >
          {children}
        </Me3Button>

        <HoldBorderOverlay
          shape={shape}
          dimensions={dimensions}
          outlineGap={outlineGap}
          borderThickness={borderThickness}
          isHolding={isHolding}
          holdTime={holdTime}
        />
      </Box>
    );
  }
);

HoldButton.displayName = 'HoldButton';
