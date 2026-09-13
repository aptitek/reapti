import { createElement, type ReactElement, type ReactNode } from 'react';
import {
  SUN_PATH,
  MOON_PATH,
  DOOR_CLOSED_PATH,
  DOOR_OPEN_PATH,
} from './glyphPaths.ts';

export function createSvg(
  tag: string,
  props: Record<string, unknown>,
  ...children: ReactNode[]
): ReactElement {
  return createElement(tag, props, ...children);
}

export function createPathSvg(
  d: string,
  attrs: Record<string, unknown>
): ReactElement {
  return createSvg('svg', attrs, createSvg('path', { d }));
}

export function createSunSvg(size: number, className?: string): ReactElement {
  return createPathSvg(SUN_PATH, {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    fill: 'currentColor',
    className: `fancy_sun_glyph ${className ?? ''}`,
    'aria-hidden': 'true',
  });
}

export function createMoonSvg(size: number, className?: string): ReactElement {
  return createPathSvg(MOON_PATH, {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    fill: 'currentColor',
    className: `fancy_moon_glyph ${className ?? ''}`,
    'aria-hidden': 'true',
  });
}

export function createFlagUkSvg(size: number): ReactElement {
  return createSvg(
    'svg',
    {
      viewBox: '0 0 32 32',
      width: size,
      height: size,
      className: 'fancy_flag_puck',
      'aria-hidden': 'true',
    },
    createSvg('rect', {
      width: 32,
      height: 32,
      fill: 'var(--fancy-switch-uk-blue)',
    }),
    createSvg('path', {
      d: 'M0 0 L32 32 M32 0 L0 32',
      stroke: 'var(--fancy-switch-uk-white)',
      strokeWidth: '5.33',
    }),
    createSvg('path', {
      d: 'M0 0 L32 32 M32 0 L0 32',
      stroke: 'var(--fancy-switch-uk-red)',
      strokeWidth: '2.67',
    }),
    createSvg('path', {
      d: 'M16 0 V32 M0 16 H32',
      stroke: 'var(--fancy-switch-uk-white)',
      strokeWidth: '8',
    }),
    createSvg('path', {
      d: 'M16 0 V32 M0 16 H32',
      stroke: 'var(--fancy-switch-uk-red)',
      strokeWidth: '4.8',
    })
  );
}

export function createFlagFranceSvg(size: number): ReactElement {
  return createSvg(
    'svg',
    {
      viewBox: '0 0 32 32',
      width: size,
      height: size,
      className: 'fancy_flag_puck',
      'aria-hidden': 'true',
    },
    createSvg('rect', {
      x: 0,
      y: 0,
      width: '10.67',
      height: 32,
      fill: 'var(--fancy-switch-fr-blue)',
    }),
    createSvg('rect', {
      x: '10.67',
      y: 0,
      width: '10.67',
      height: 32,
      fill: 'var(--fancy-switch-fr-white)',
    }),
    createSvg('rect', {
      x: '21.34',
      y: 0,
      width: '10.66',
      height: 32,
      fill: 'var(--fancy-switch-fr-red)',
    })
  );
}

export function createMapSvg(
  d: string,
  active: boolean,
  size: number
): ReactElement {
  return createSvg(
    'svg',
    {
      viewBox: '0 0 28 25',
      width: size,
      height: size,
      fill: 'none',
      'aria-hidden': 'true',
    },
    createSvg('path', {
      className: 'fancy_country_silhouette',
      'data-active': active,
      d,
    })
  );
}

export function createArcSvg(
  d: string,
  dash: string,
  strokeWidth = '1.2'
): ReactElement {
  return createSvg(
    'svg',
    {
      viewBox: '0 0 56 32',
      className: 'fancy_celestial_arc',
      preserveAspectRatio: 'none',
      'aria-hidden': 'true',
    },
    createSvg('path', {
      d,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeDasharray: dash,
    })
  );
}

export function createAnalogClockSvg(size: number): ReactElement {
  return createSvg(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      className: 'fancy_analog_transit',
      'data-testid': 'switch-analog-clock',
      'aria-hidden': 'true',
    },
    createSvg('circle', {
      cx: 12,
      cy: 12,
      r: 10,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
    }),
    createSvg('line', {
      x1: 12,
      y1: 12,
      x2: 12,
      y2: 6,
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
    }),
    createSvg('line', {
      x1: 12,
      y1: 12,
      x2: 16,
      y2: 12,
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
    })
  );
}

export function createDoorSvg(isOpen: boolean): ReactElement {
  return createSvg(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: 15,
      height: 15,
      fill: 'currentColor',
      'data-testid': isOpen
        ? 'meeting-room-open-icon'
        : 'door-front-closed-icon',
      'aria-hidden': 'true',
    },
    createSvg('path', { d: isOpen ? DOOR_OPEN_PATH : DOOR_CLOSED_PATH })
  );
}

export function createRippleSvg(
  isUnlocked: boolean,
  size: number
): ReactElement {
  return createSvg(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: isUnlocked
        ? 'var(--fancy-switch-access-unlocked)'
        : 'var(--fancy-switch-access-badge)',
      strokeWidth: '1.5',
      className: 'fancy_badge_ripple_wave',
      'data-testid': 'badge-scan-ripple',
      'aria-hidden': 'true',
    },
    createSvg('circle', { cx: 12, cy: 12, r: 9 })
  );
}
