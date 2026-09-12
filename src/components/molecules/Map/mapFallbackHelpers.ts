import { useContext } from 'react';
import type { Locale } from '../../../i18n/locales.ts';
import { DEFAULT_LOCALE } from '../../../i18n/locales.ts';
import { ContentContext } from '../../../i18n/context.tsx';
import { resolveA11yString } from '../../../i18n/strings.ts';
import type { MapPinItem } from './Map.types.ts';

export interface FallbackA11yStrings {
  title: string;
  message: string;
  locationsTitle: string;
  loadingLabel: string;
}

/**
 * Proactively detects WebGL context support to prevent ReactMapGL crashes.
 */
export function isWebGLSupported(): boolean {
  try {
    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(1, 1);
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      return Boolean(gl);
    }
    if (typeof window === 'undefined') {
      return true;
    }
    return Boolean(
      (window as unknown as { WebGLRenderingContext?: unknown })
        .WebGLRenderingContext
    );
  } catch {
    return false;
  }
}

/**
 * Resolves localized accessibility strings for fallback and skeleton states.
 */
export function resolveFallbackA11yStrings(
  locale?: Locale
): FallbackA11yStrings {
  const activeLocale = locale ?? DEFAULT_LOCALE;
  return {
    title: resolveA11yString(activeLocale, 'mapWebGLDisabledTitle'),
    message: resolveA11yString(activeLocale, 'mapWebGLDisabledMessage'),
    locationsTitle: resolveA11yString(
      activeLocale,
      'mapFallbackLocationsTitle'
    ),
    loadingLabel: resolveA11yString(activeLocale, 'mapLoadingAriaLabel'),
  };
}

/**
 * Hook to safely read fallback strings from ContentContext or default locale.
 */
export function useFallbackStrings(): FallbackA11yStrings {
  const ctx = useContext(ContentContext);
  return resolveFallbackA11yStrings(ctx?.locale);
}

/**
 * Formats latitude and longitude coordinates into a human-readable display string.
 */
export function formatFallbackPinCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const absLat = Math.abs(lat).toFixed(4);
  const absLng = Math.abs(lng).toFixed(4);
  return `${absLat}° ${latDir}, ${absLng}° ${lngDir}`;
}

/**
 * Resolves a text representation of a pin label for non-WebGL chip display.
 */
export function formatFallbackPinLabel(item: MapPinItem): string {
  if (typeof item.label === 'string' && item.label.length > 0) {
    return item.label;
  }
  return formatFallbackPinCoordinates(item.latitude, item.longitude);
}
