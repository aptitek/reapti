import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eButton } from '@m3e/react/button';
import { M3eShape } from '@m3e/react/shape';
import type {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  M3eButtonElement,
} from '@m3e/web/button';
import type { ShapeName } from '@m3e/web/shape';
import { useInteractiveShape } from './useInteractiveShape.ts';

export type Me3Shape = ShapeName | ButtonShape;

export interface Me3ButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof M3eButton>,
  'shape'
> {
  shape?: Me3Shape;
  targetShape?: Me3Shape;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

interface ExpressiveButtonProps extends Me3ButtonProps {
  buttonRef: Ref<M3eButtonElement>;
}

function ExpressiveButton({
  shape = 'rounded',
  targetShape,
  variant = 'filled',
  buttonRef,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...restProps
}: ExpressiveButtonProps) {
  const {
    activeShape,
    handlePointerEnter,
    handlePointerLeave,
    handleFocus,
    handleBlur,
  } = useInteractiveShape(shape, targetShape, {
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
  });

  return (
    <Box
      className="override-shape-button"
      data-variant={variant}
      data-shape={activeShape}
    >
      <M3eShape name={activeShape} data-shape={activeShape}>
        <M3eButton
          ref={buttonRef}
          variant={variant}
          data-shape={activeShape}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restProps}
        >
          {children}
        </M3eButton>
      </M3eShape>
    </Box>
  );
}

/**
 * Atomic button component implementing Material Design 3 Expressive.
 * Supports 35 expressive shapes, interactive targetShape shifting on hover,
 * and perimeter-following border physics.
 */
export const Me3Button = forwardRef<M3eButtonElement, Me3ButtonProps>(
  ({ shape = 'rounded', targetShape, ...props }, ref) => {
    const isNative =
      (shape === 'rounded' || shape === 'square') && !targetShape;
    if (isNative) {
      const nativeShape: ButtonShape =
        shape === 'square' ? 'square' : 'rounded';
      return (
        <M3eButton
          ref={ref}
          shape={nativeShape}
          data-shape={nativeShape}
          {...props}
        />
      );
    }

    return (
      <ExpressiveButton
        shape={shape}
        targetShape={targetShape}
        buttonRef={ref}
        {...props}
      />
    );
  }
);

Me3Button.displayName = 'Me3Button';
