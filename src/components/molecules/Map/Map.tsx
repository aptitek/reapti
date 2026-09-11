import { useContext } from 'react';
import type { ReactNode } from 'react';
import { Box, Flex } from 'styled-system/jsx';
import { ContentContext } from '../../../i18n/context.tsx';
import { DEFAULT_LOCALE } from '../../../i18n/locales.ts';
import { resolveA11yString } from '../../../i18n/strings.ts';
import { Me3Button } from '../../atoms/Me3Button/Me3Button.tsx';
import { MapPin } from '../../atoms/MapPin/MapPin.tsx';
import { MapSkeleton } from '../../atoms/MapSkeleton/MapSkeleton.tsx';
import { useMapZoom } from './useMapZoom.ts';

interface MapCoordinates {
  lat: number;
  lon: number;
}

const DEFAULT_COORDS: MapCoordinates = {
  lat: 48.7118,
  lon: 2.1698,
};

export interface MapProps {
  coordinates?: MapCoordinates;
  zoom?: number;
  showPin?: boolean;
  pinLabel?: string;
  pinColor?: string;
  pinAriaLabel?: string;
  interactive?: boolean;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  isLoading?: boolean;
  className?: string;
  testId?: string;
  children?: ReactNode;
}

function MapBackgroundGrid(): ReactNode {
  return (
    <>
      <Box
        position="absolute"
        inset="0"
        bg="surfaceContainerLowest"
        opacity={0.8}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="50%"
        left="-10%"
        width="120%"
        height="28px"
        transform="translateY(-50%) rotate(-5deg)"
        bg="surfaceContainer"
        borderTop="1px solid var(--colors-outline-variant)"
        borderBottom="1px solid var(--colors-outline-variant)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        left="45%"
        top="-10%"
        height="120%"
        width="20px"
        bg="surfaceContainer"
        borderLeft="1px solid var(--colors-outline-variant)"
        borderRight="1px solid var(--colors-outline-variant)"
        pointerEvents="none"
      />
    </>
  );
}

interface ControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function useSafeA11yString(key: 'zoomIn' | 'zoomOut'): string {
  const ctx = useContext(ContentContext);
  return resolveA11yString(ctx?.locale ?? DEFAULT_LOCALE, key);
}

function MapControls({
  zoomLevel,
  onZoomIn,
  onZoomOut,
}: ControlsProps): ReactNode {
  const zoomText = `${zoomLevel.toFixed(1)}x`;
  const zoomInLabel = useSafeA11yString('zoomIn');
  const zoomOutLabel = useSafeA11yString('zoomOut');

  return (
    <Flex
      position="absolute"
      top="3"
      right="3"
      direction="column"
      gap="1"
      zIndex={4}
    >
      <Me3Button
        size="small"
        variant="tonal"
        shape="rounded"
        onClick={onZoomIn}
        aria-label={zoomInLabel}
      >
        <Box fontSize="sm" fontWeight="bold">
          +
        </Box>
      </Me3Button>
      <Box
        textAlign="center"
        fontSize="xs"
        fontWeight="bold"
        color="onSurfaceVariant"
        userSelect="none"
      >
        {zoomText}
      </Box>
      <Me3Button
        size="small"
        variant="tonal"
        shape="rounded"
        onClick={onZoomOut}
        aria-label={zoomOutLabel}
      >
        <Box fontSize="sm" fontWeight="bold">
          -
        </Box>
      </Me3Button>
    </Flex>
  );
}

function CoordBadge({
  coordinates,
}: {
  coordinates: MapCoordinates;
}): ReactNode {
  const text = `${coordinates.lat.toFixed(4)}°N, ${coordinates.lon.toFixed(4)}°E`;
  return (
    <Box
      position="absolute"
      bottom="3"
      left="3"
      px="2"
      py="1"
      borderRadius="small"
      bg="surfaceContainer"
      color="onSurfaceVariant"
      fontSize="xs"
      fontWeight="medium"
      boxShadow="elevation1"
      userSelect="none"
      zIndex={4}
    >
      {text}
    </Box>
  );
}

function PinLayer({
  showPin,
  pinLabel,
  pinColor,
  pinAriaLabel,
}: {
  showPin: boolean;
  pinLabel?: string;
  pinColor?: string;
  pinAriaLabel?: string;
}): ReactNode {
  if (!showPin) return null;
  return (
    <Box position="absolute" left="50%" top="50%" zIndex={3}>
      <MapPin label={pinLabel} color={pinColor} ariaLabel={pinAriaLabel} />
    </Box>
  );
}

function resolveMapSettings(props: MapProps) {
  return {
    coords: props.coordinates ?? DEFAULT_COORDS,
    initialZoom: props.zoom ?? 14.5,
    hasPin: props.showPin !== false,
    interactive: props.interactive !== false,
    width: props.width ?? '100%',
    height: props.height ?? '100%',
    radius: props.borderRadius ?? '12px',
    testId: props.testId ?? 'map-root',
  };
}

/**
 * MD3 Map Molecule composing MapPin, cartographic surface, and zoom controls.
 */
export function Map(props: MapProps): ReactNode {
  const settings = resolveMapSettings(props);
  const { zoomLevel, zoomIn, zoomOut } = useMapZoom(settings.initialZoom);

  if (props.isLoading) {
    return (
      <MapSkeleton
        width={settings.width}
        height={settings.height}
        borderRadius={settings.radius}
        testId={settings.testId}
      />
    );
  }

  return (
    <Box
      position="relative"
      width={settings.width}
      height={settings.height}
      borderRadius={settings.radius}
      overflow="hidden"
      bg="surfaceContainerLow"
      className={props.className}
      data-testid={settings.testId}
    >
      <MapBackgroundGrid />
      {settings.interactive && (
        <MapControls
          zoomLevel={zoomLevel}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
      )}
      <PinLayer
        showPin={settings.hasPin}
        pinLabel={props.pinLabel}
        pinColor={props.pinColor}
        pinAriaLabel={props.pinAriaLabel}
      />
      <CoordBadge coordinates={settings.coords} />
      {props.children}
    </Box>
  );
}

Map.displayName = 'Map';
