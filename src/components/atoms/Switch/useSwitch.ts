import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  M3eSwitchElement,
  SwitchProps,
  SwitchRotation,
  SwitchSymmetry,
  SwitchTransitionDirection,
} from './Switch.types.ts';

export type SwitchChangeHandler = (checked: boolean) => void;

export interface SwitchStateOptions {
  onChange?: SwitchChangeHandler;
  transitionDuration?: number;
}

function resolveRotation(
  rotation: SwitchRotation | undefined,
  checked: boolean,
  stateRotation?: number
): number {
  if (stateRotation !== undefined) return stateRotation;
  if (rotation === undefined) return 0;
  if (typeof rotation === 'number') return rotation;
  const val = checked ? rotation.on : rotation.off;
  return typeof val === 'number' ? val : 0;
}

function resolveSymmetry(
  symmetry: SwitchSymmetry | undefined,
  checked: boolean,
  stateSymmetry?: boolean | 'horizontal' | 'vertical'
): number {
  const target = stateSymmetry ?? symmetry;
  if (target === true || target === 'horizontal') return -1;
  if (typeof target === 'object' && (checked ? target.on : target.off)) {
    return -1;
  }
  return 1;
}

function setVar(
  element: HTMLElement,
  prop: string,
  val: string | undefined
): void {
  if (val) {
    element.style.setProperty(prop, val);
  } else {
    element.style.removeProperty(prop);
  }
}

function pickCfg(
  cfg: SwitchProps['on'],
  key: 'color' | 'trackColor' | 'handleColor' | 'ghostColor' | 'peekingColor',
  fallback?: string
): string | undefined {
  if (!cfg) return fallback;
  const val = cfg[key];
  return typeof val === 'string' ? val : fallback;
}

function resolveColorTokens(props: SwitchProps) {
  const on = props.on;
  const off = props.off;
  const colorOn = pickCfg(on, 'color', props.colorOn);
  const colorOff = pickCfg(off, 'color', props.colorOff);
  return {
    colorOn,
    colorOff,
    trackOn: pickCfg(
      on,
      'trackColor',
      pickCfg(on, 'color', props.trackColorOn)
    ),
    trackOff: pickCfg(
      off,
      'trackColor',
      pickCfg(off, 'color', props.trackColorOff)
    ),
    handleOn: pickCfg(on, 'handleColor', props.handleColorOn),
    handleOff: pickCfg(off, 'handleColor', props.handleColorOff),
    ghostOn: pickCfg(on, 'ghostColor', props.ghostColorOn),
    ghostOff: pickCfg(off, 'ghostColor', props.ghostColorOff),
    peekOn: pickCfg(on, 'peekingColor', props.peekingColorOn),
    peekOff: pickCfg(off, 'peekingColor', props.peekingColorOff),
  };
}

function applyColorVars(element: HTMLElement, props: SwitchProps): void {
  const c = resolveColorTokens(props);
  setVar(element, '--switch-color-on', c.colorOn);
  setVar(element, '--switch-color-off', c.colorOff);
  setVar(element, '--switch-track-color-on', c.trackOn);
  setVar(element, '--switch-track-color-off', c.trackOff);
  setVar(element, '--switch-handle-color-on', c.handleOn);
  setVar(element, '--switch-handle-color-off', c.handleOff);
  setVar(element, '--switch-ghost-color-on', c.ghostOn);
  setVar(element, '--switch-ghost-color-off', c.ghostOff);
  setVar(element, '--switch-peeking-color-on', c.peekOn);
  setVar(element, '--switch-peeking-color-off', c.peekOff);
}

function applyTransformVars(element: HTMLElement, props: SwitchProps): void {
  const { peekingRotation, peekingSymmetry, peekingOffset, on, off } = props;

  if (peekingOffset !== undefined) {
    const offsetStr =
      typeof peekingOffset === 'number' ? `${peekingOffset}px` : peekingOffset;
    element.style.setProperty('--switch-peek-offset', offsetStr);
  } else {
    element.style.removeProperty('--switch-peek-offset');
  }

  const rotOn = resolveRotation(peekingRotation, true, on?.peekingRotation);
  const rotOff = resolveRotation(peekingRotation, false, off?.peekingRotation);
  element.style.setProperty('--switch-peeking-rot-on', `${rotOn}deg`);
  element.style.setProperty('--switch-peeking-rot-off', `${rotOff}deg`);

  const symOn = resolveSymmetry(peekingSymmetry, true, on?.peekingSymmetry);
  const symOff = resolveSymmetry(peekingSymmetry, false, off?.peekingSymmetry);
  element.style.setProperty('--switch-peeking-scale-x-on', String(symOn));
  element.style.setProperty('--switch-peeking-scale-x-off', String(symOff));
}

export function applySwitchCssVariables(
  element: HTMLElement | null,
  props: SwitchProps
): void {
  if (!element) return;
  applyColorVars(element, props);
  applyTransformVars(element, props);
  const transitionDuration = props.transitionDuration ?? 300;
  element.style.setProperty(
    '--switch-trans-duration',
    `${transitionDuration}ms`
  );
}

export function clearSwitchTimer(timerRef: {
  current: ReturnType<typeof setTimeout> | null;
}): void {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

export function useSwitchInternalState(
  controlledChecked: boolean | undefined,
  defaultChecked = false,
  onChangeOrOptions?: SwitchChangeHandler | SwitchStateOptions
) {
  const onChange =
    typeof onChangeOrOptions === 'function'
      ? onChangeOrOptions
      : onChangeOrOptions?.onChange;
  const transitionDuration =
    typeof onChangeOrOptions === 'object'
      ? (onChangeOrOptions.transitionDuration ?? 300)
      : 300;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] =
    useState<SwitchTransitionDirection>('to-on');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const cleanup = useCallback(() => {
    clearSwitchTimer(timerRef);
  }, []);

  const handleMount = useCallback(() => cleanup, [cleanup]);

  useEffect(handleMount, [handleMount]);

  const handleChange = useCallback(
    (e: Event) => {
      const target = e.currentTarget as M3eSwitchElement | null;
      const nextChecked = Boolean(target?.checked);
      if (!isControlled) {
        setInternalChecked(nextChecked);
      }
      setIsTransitioning(true);
      setTransitionDirection(nextChecked ? 'to-on' : 'to-off');

      clearSwitchTimer(timerRef);
      timerRef.current = setTimeout(() => {
        setIsTransitioning(false);
        timerRef.current = null;
      }, transitionDuration);

      onChange?.(nextChecked);
    },
    [isControlled, onChange, transitionDuration]
  );

  return {
    isChecked,
    isTransitioning,
    transitionDirection,
    handleChange,
    cleanup,
    handleMount,
  };
}

export function useSwitch(props: SwitchProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const state = useSwitchInternalState(props.checked, props.defaultChecked, {
    onChange: props.onChange,
    transitionDuration: props.transitionDuration,
  });

  const syncStyles = useCallback(() => {
    applySwitchCssVariables(rootRef.current, props);
  }, [props]);

  useEffect(syncStyles);

  return {
    rootRef,
    syncStyles,
    ...state,
  };
}
