import { forwardRef } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eButton } from '@m3e/react/button';
import { M3eShape } from '@m3e/react/shape';
import type { HoldButtonProps, M3eButtonElement } from './HoldButton.types.ts';
import { useHoldButton } from './useHoldButton.ts';
import { renderBorderSvg } from './holdButtonHelpers.ts';
import './holdButton.css';

export type { HoldButtonProps, M3eButtonElement };

function getRootClassName(customClassName?: string): string {
  const base = 'hold-button_root override-hold-button';
  return customClassName ? `${base} ${customClassName}` : base;
}

export const HoldButton = forwardRef<M3eButtonElement, HoldButtonProps>(
  (props, ref) => {
    const {
      rootRef,
      bounds,
      activeShape,
      borderPath,
      borderWidth,
      isHolding,
      isCompleted,
      isShaking,
      buttonHandlers,
    } = useHoldButton(props);

    const testId = props.dataTestId ?? 'me3-hold-button';

    const svgOverlay = renderBorderSvg(borderPath, {
      width: bounds.rootWidth,
      height: bounds.rootHeight,
      strokeWidth: borderWidth,
      dataTestId: testId,
    });

    return (
      <Box
        ref={rootRef}
        className={getRootClassName(props.className)}
        data-holding={isHolding}
        data-shaking={isShaking}
        data-completed={isCompleted}
        data-disabled={props.disabled ?? false}
        data-shape={activeShape}
        data-variant={props.variant ?? 'filled'}
        data-size={props.size ?? 'medium'}
        data-testid={`${testId}-wrapper`}
      >
        {svgOverlay}
        <M3eShape name={activeShape} data-testid={`${testId}-shape`}>
          <M3eButton
            ref={ref}
            id={props.id}
            name={props.name}
            type={props.type}
            value={props.value}
            variant={props.variant ?? 'filled'}
            size={props.size ?? 'medium'}
            disabled={props.disabled}
            disabledInteractive={props.disabledInteractive}
            aria-label={props.ariaLabel}
            data-testid={testId}
            {...buttonHandlers}
          >
            {props.icon}
            {props.children}
            {props.trailingIcon}
          </M3eButton>
        </M3eShape>
      </Box>
    );
  }
);

HoldButton.displayName = 'HoldButton';
