import { describe, it, expect, vi } from 'vitest';
import type { KeyboardEvent, MouseEvent } from 'react';
import {
  resolvePinConfig,
  resolvePinClasses,
  resolvePinAria,
  resolvePinInteractive,
  resolvePinSpatial,
  createPinKeyDownHandler,
  createChipClickHandler,
  DEFAULT_PIN_ICON,
  DEFAULT_PIN_COLOR,
} from '../../src/components/atoms/MapPin/mapPinHelpers.ts';

describe('MapPin Configuration Resolution', () => {
  it('resolves default pin configuration when optional props are omitted', () => {
    const cfg = resolvePinConfig({});
    expect(cfg.color).toBe(DEFAULT_PIN_COLOR);
    expect(cfg.icon).toBe(DEFAULT_PIN_ICON);
    expect(cfg.iconVariant).toBe('rounded');
    expect(cfg.chipVariant).toBe('elevated');
    expect(cfg.billboard).toBe(true);
    expect(cfg.pitchAlignment).toBe('viewport');
    expect(cfg.rotationAlignment).toBe('viewport');
    expect(cfg.anchor).toBe('bottom');
    expect(cfg.isInteractive).toBe(false);
    expect(cfg.effectiveAria).toBeUndefined();
    expect(cfg.rootClass).toContain('reapti_pin');
    expect(cfg.rootClass).toContain('reapti_pin--billboard');
  });

  it('resolves interactive state when onClick is present and not disabled', () => {
    const isInteractive = resolvePinInteractive(true, false, true);
    expect(isInteractive).toBe(true);

    const isNonInteractive = resolvePinInteractive(true, true, true);
    expect(isNonInteractive).toBe(false);
  });

  it('resolves aria string from ariaLabel or string label', () => {
    expect(resolvePinAria('Custom Aria', 'Visible Label')).toBe('Custom Aria');
    expect(resolvePinAria(undefined, 'Only Label')).toBe('Only Label');
    expect(resolvePinAria(undefined, undefined)).toBeUndefined();
  });

  it('resolves spatial 3D billboard settings accurately', () => {
    const spatial = resolvePinSpatial({
      pitchAlignment: 'viewport',
      rotationAlignment: 'map',
      anchor: 'top',
    });
    expect(spatial.billboard).toBe(true);
    expect(spatial.pitchAlignment).toBe('viewport');
    expect(spatial.rotationAlignment).toBe('map');
    expect(spatial.anchor).toBe('top');

    const nonBillboard = resolvePinSpatial({
      billboard: false,
    });
    expect(nonBillboard.billboard).toBe(false);
    expect(nonBillboard.pitchAlignment).toBe('map');
    expect(nonBillboard.rotationAlignment).toBe('auto');
  });

  it('resolves root classes with modifiers', () => {
    const classes = resolvePinClasses({
      className: 'custom-cls',
      isInteractive: true,
      disabled: true,
      isBillboard: true,
    });
    expect(classes).toContain('reapti_pin');
    expect(classes).toContain('reapti_pin--billboard');
    expect(classes).toContain('reapti_pin--interactive');
    expect(classes).toContain('reapti_pin--disabled');
    expect(classes).toContain('custom-cls');
  });
});

describe('MapPin Event Handlers', () => {
  it('creates keyboard handler for Enter and Space triggering onClick', () => {
    const onClick = vi.fn();
    const handler = createPinKeyDownHandler(false, true, onClick);

    const enterEvent = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent<HTMLDivElement>;
    handler(enterEvent);
    expect(enterEvent.preventDefault).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);

    const spaceEvent = {
      key: ' ',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent<HTMLDivElement>;
    handler(spaceEvent);
    expect(spaceEvent.preventDefault).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(2);

    const otherEvent = {
      key: 'Tab',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent<HTMLDivElement>;
    handler(otherEvent);
    expect(otherEvent.preventDefault).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('creates chip click handler stopping propagation', () => {
    const onChipClick = vi.fn();
    const handler = createChipClickHandler(onChipClick);

    const event = {
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent<HTMLElement>;
    handler(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(onChipClick).toHaveBeenCalledTimes(1);
  });
});
