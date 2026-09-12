import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { MapPinProps } from './MapPin.types.ts';

export const DEFAULT_PIN_ICON = 'location_on';
const DEFAULT_PIN_ICON_VARIANT = 'rounded';
const DEFAULT_PIN_CHIP_VARIANT = 'elevated';
export const DEFAULT_PIN_COLOR = 'var(--colors-primary)';
const DEFAULT_PIN_ANCHOR = 'bottom';

export interface ResolvedPinConfig {
  color: string;
  icon: string;
  iconVariant: 'rounded' | 'outlined' | 'sharp';
  chipVariant: 'outlined' | 'elevated';
  billboard: boolean;
  pitchAlignment: 'map' | 'viewport' | 'auto';
  rotationAlignment: 'map' | 'viewport' | 'auto';
  anchor: string;
  isInteractive: boolean;
  effectiveAria: string | undefined;
  rootClass: string;
}

export interface PinClassOptions {
  className?: string;
  isInteractive?: boolean;
  disabled?: boolean;
  isBillboard?: boolean;
}

export function resolvePinClasses(options: PinClassOptions = {}): string {
  const classList = ['reapti_pin', 'override-reapti_pin'];
  if (options.isBillboard ?? true) classList.push('reapti_pin--billboard');
  if (options.isInteractive) classList.push('reapti_pin--interactive');
  if (options.disabled) classList.push('reapti_pin--disabled');
  if (options.className) classList.push(options.className);
  return classList.join(' ');
}

export function resolvePinAria(
  ariaLabel?: string,
  label?: ReactNode
): string | undefined {
  if (ariaLabel) return ariaLabel;
  if (typeof label === 'string') return label;
  return undefined;
}

export function resolvePinInteractive(
  interactive = true,
  disabled = false,
  hasAction = false
): boolean {
  return interactive && !disabled && hasAction;
}

export function resolvePinSpatial(props: MapPinProps) {
  const isBillboard = props.billboard ?? true;
  const defaultPitch = isBillboard ? 'viewport' : 'map';
  const defaultRotation = isBillboard ? 'viewport' : 'auto';

  return {
    billboard: isBillboard,
    pitchAlignment: props.pitchAlignment ?? defaultPitch,
    rotationAlignment: props.rotationAlignment ?? defaultRotation,
    anchor: props.anchor ?? DEFAULT_PIN_ANCHOR,
  };
}

export function resolvePinConfig(props: MapPinProps): ResolvedPinConfig {
  const hasAction = Boolean(props.onClick || props.onChipClick);
  const isInteractive = resolvePinInteractive(
    props.interactive,
    props.disabled,
    hasAction
  );
  const spatial = resolvePinSpatial(props);
  const rootClass = resolvePinClasses({
    className: props.className,
    isInteractive,
    disabled: props.disabled,
    isBillboard: spatial.billboard,
  });

  return {
    color: props.color ?? DEFAULT_PIN_COLOR,
    icon: props.icon ?? DEFAULT_PIN_ICON,
    iconVariant: props.iconVariant ?? DEFAULT_PIN_ICON_VARIANT,
    chipVariant: props.chipVariant ?? DEFAULT_PIN_CHIP_VARIANT,
    ...spatial,
    isInteractive,
    effectiveAria: resolvePinAria(props.ariaLabel, props.label),
    rootClass,
  };
}

export function createPinKeyDownHandler(
  disabled: boolean | undefined,
  interactive: boolean | undefined,
  onClick?: () => void
): (e: KeyboardEvent<HTMLDivElement>) => void {
  return (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || interactive === false) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };
}

export function createChipClickHandler(
  onChipClick?: () => void
): (e: MouseEvent<HTMLElement>) => void {
  return (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onChipClick?.();
  };
}
