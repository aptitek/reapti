import type { ReactNode } from 'react';
import type { SwitchProps, SwitchTransitionDirection } from './Switch.types.ts';
import { applySwitchCssVariables } from './useSwitch.ts';

export interface TransitionContext {
  isTransitioning: boolean;
  direction: SwitchTransitionDirection;
}

export function resolveBackground(
  props: SwitchProps,
  isChecked: boolean
): ReactNode {
  const cfg = isChecked ? props.on : props.off;
  if (cfg?.backgroundSvg !== undefined) return cfg.backgroundSvg;
  const stateSvg = isChecked ? props.backgroundSvgOn : props.backgroundSvgOff;
  if (stateSvg) return stateSvg;
  const bg = props.backgroundSvg;
  return typeof bg === 'function' ? bg(isChecked) : bg;
}

export function resolveHandle(
  props: SwitchProps,
  isChecked: boolean,
  transCtx: TransitionContext
): ReactNode {
  const { handleTransitionComponent, handleIconOn, handleIconOff, on, off } =
    props;
  if (transCtx.isTransitioning && handleTransitionComponent) {
    return typeof handleTransitionComponent === 'function'
      ? handleTransitionComponent(transCtx.direction)
      : handleTransitionComponent;
  }
  const cfg = isChecked ? on : off;
  if (cfg?.handleIcon !== undefined) {
    return cfg.handleIcon;
  }
  return isChecked ? handleIconOn : handleIconOff;
}

export function resolveActiveState(props: SwitchProps, isChecked: boolean) {
  const cfg = isChecked ? props.on : props.off;
  return {
    ghostIcon:
      cfg?.ghostIcon ?? (isChecked ? props.ghostIconOn : props.ghostIconOff),
    peekingIcon:
      cfg?.peekingIcon ??
      (isChecked ? props.peekingIconOn : props.peekingIconOff),
  };
}

export function hasHandleIconOff(props: SwitchProps): boolean {
  if (props.icons === 'both') return true;
  const off = props.off;
  if (off && off.handleIcon) return true;
  return Boolean(props.handleIconOff);
}

export function syncSwitchStyles(
  element: HTMLElement | null,
  props: SwitchProps
): void {
  applySwitchCssVariables(element, props);
}
