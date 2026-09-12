import { forwardRef, type FC } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eSwitch } from '@m3e/react/switch';
import type {
  M3eSwitchElement,
  SwitchProps,
  SwitchTransitionDirection,
} from './Switch.types.ts';
import { useSwitch } from './useSwitch.ts';
import {
  resolveBackground,
  resolveHandle,
  resolveActiveState,
  hasHandleIconOff,
} from './switchHelpers.ts';
import './switch.css';

export type { SwitchProps, M3eSwitchElement };

interface SwitchSlotsProps {
  props: SwitchProps;
  isChecked: boolean;
  isTransitioning: boolean;
  transitionDirection: SwitchTransitionDirection;
}

const SwitchSlots: FC<SwitchSlotsProps> = ({
  props,
  isChecked,
  isTransitioning,
  transitionDirection,
}) => {
  const { ghostIcon: activeGhost, peekingIcon: activePeek } =
    resolveActiveState(props, isChecked);
  const activeBg = resolveBackground(props, isChecked);
  const handleContent = resolveHandle(props, isChecked, {
    isTransitioning,
    direction: transitionDirection,
  });

  return (
    <>
      <Box className="switch_track_frame" data-testid="switch-track-frame" />
      {activeGhost && (
        <Box className="switch_ghost_slot" data-testid="switch-ghost-slot">
          {activeGhost}
        </Box>
      )}
      {activeBg && (
        <Box
          className="switch_background_slot"
          data-testid="switch-background-slot"
        >
          {activeBg}
        </Box>
      )}
      {activePeek && (
        <Box className="switch_peeking_slot" data-testid="switch-peeking-slot">
          {activePeek}
        </Box>
      )}
      {handleContent && (
        <Box className="switch_handle_slot" data-testid="switch-handle-slot">
          {handleContent}
        </Box>
      )}
    </>
  );
};

function getRootClassName(className?: string): string {
  if (!className) return 'switch_root override-switch';
  return `switch_root override-switch ${className}`;
}

export const Switch = forwardRef<M3eSwitchElement, SwitchProps>(
  (props, ref) => {
    const {
      rootRef,
      isChecked,
      isTransitioning,
      transitionDirection,
      handleChange,
    } = useSwitch(props);

    const rootClassName = getRootClassName(props.className);
    const testId = props.dataTestId ?? 'me3-switch';
    const hasIconOff = hasHandleIconOff(props);

    return (
      <Box
        ref={rootRef}
        className={rootClassName}
        data-size={props.size ?? 'medium'}
        data-checked={isChecked}
        data-disabled={props.disabled ?? false}
        data-icons={props.icons ?? 'none'}
        data-handle-icon-off={hasIconOff}
        data-testid={`${testId}-wrapper`}
      >
        <SwitchSlots
          props={props}
          isChecked={isChecked}
          isTransitioning={isTransitioning}
          transitionDirection={transitionDirection}
        />
        <M3eSwitch
          ref={ref}
          id={props.id}
          name={props.name}
          value={props.value ?? 'on'}
          checked={isChecked}
          disabled={props.disabled}
          icons={props.icons}
          aria-label={props.ariaLabel}
          data-testid={testId}
          onChange={handleChange}
        />
      </Box>
    );
  }
);

Switch.displayName = 'Switch';
