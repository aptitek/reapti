import {
  forwardRef,
  useRef,
  useImperativeHandle,
  type FC,
  type RefObject,
} from 'react';
import { Box, Flex } from 'styled-system/jsx';
import ReactMapGL, { type MapRef } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { M3eIcon } from '@m3e/react/icon';
import { MapPin } from '../../atoms/MapPin/MapPin.tsx';
import type { MapProps, MapPinItem } from './Map.types.ts';
import {
  DEFAULT_MAP_STYLE,
  resolveMapContainerClass,
  resolveEffectiveViewState,
  resolveMapPins,
  createMapLoadHandler,
} from './mapHelpers.ts';
import {
  isWebGLSupported,
  useFallbackStrings,
  formatFallbackPinLabel,
} from './mapFallbackHelpers.ts';
import { useMap3DTransition } from './useMap3DTransition.ts';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

if (typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl(maplibreWorkerUrl);
}

export type { MapProps, MapRef };

const MapPinList: FC<{ pins: readonly MapPinItem[] }> = ({ pins }) => {
  if (pins.length === 0) return null;
  return (
    <>
      {pins.map((item, index) => {
        const pinKey =
          item.id ?? `reapti_pin_${item.longitude}_${item.latitude}_${index}`;
        return (
          <MapPin
            key={pinKey}
            longitude={item.longitude}
            latitude={item.latitude}
            label={item.label}
            color={item.color}
            icon={item.icon}
            iconVariant={item.iconVariant}
            chipVariant={item.chipVariant}
            billboard={item.billboard ?? true}
            pitchAlignment={item.pitchAlignment ?? 'viewport'}
            rotationAlignment={item.rotationAlignment ?? 'viewport'}
            anchor={item.anchor ?? 'bottom'}
            showRadar={item.showRadar}
            showShadow={item.showShadow}
            interactive={item.interactive}
            disabled={item.disabled}
            onClick={item.onClick}
            onChipClick={item.onChipClick}
            ariaLabel={item.ariaLabel}
            dataTestId={item.dataTestId}
          />
        );
      })}
    </>
  );
};

const MapSkeleton: FC<{ containerClass: string; testId: string }> = ({
  containerClass,
  testId,
}) => {
  const strings = useFallbackStrings();
  return (
    <Box
      className={containerClass}
      data-testid={testId}
      role="region"
      aria-label={strings.loadingLabel}
    >
      <Box className="reapti_map_skeleton_surface">
        <Box className="reapti_map_skeleton_backdrop" />
        <Box className="reapti_map_skeleton_shimmer" />
        <Box className="reapti_map_skeleton_radar">
          <Box className="reapti_map_skeleton_radar_wave" />
          <Box className="reapti_map_skeleton_radar_core" />
        </Box>
      </Box>
    </Box>
  );
};

interface FallbackProps {
  containerClass: string;
  testId: string;
  pins: readonly MapPinItem[];
}

const MapFallbackSurface: FC<FallbackProps> = ({
  containerClass,
  testId,
  pins,
}) => {
  const strings = useFallbackStrings();
  return (
    <Box
      className={containerClass}
      data-testid={testId}
      role="region"
      aria-label={strings.title}
    >
      <Box className="reapti_map_fallback_surface">
        <Box className="reapti_map_fallback_backdrop" />
        <Box className="reapti_map_fallback_overlay" />
        <Box className="reapti_map_fallback_card" role="alert">
          <Flex className="reapti_map_fallback_header">
            <Box className="reapti_map_fallback_icon" aria-hidden={true}>
              <M3eIcon name="warning" variant="rounded" />
            </Box>
            <Box className="reapti_map_fallback_title">{strings.title}</Box>
          </Flex>
          <Box className="reapti_map_fallback_message">{strings.message}</Box>
          {pins.length > 0 && (
            <Box className="reapti_map_fallback_locations">
              <Box className="reapti_map_fallback_locations_title">
                {strings.locationsTitle}
              </Box>
              <Flex className="reapti_map_fallback_chips">
                {pins.map((pin, index) => (
                  <Box
                    key={
                      pin.id ??
                      `fallback_pin_${pin.latitude}_${pin.longitude}_${index}`
                    }
                    className="reapti_map_fallback_chip"
                  >
                    {formatFallbackPinLabel(pin)}
                  </Box>
                ))}
              </Flex>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

interface ActiveSurfaceProps {
  props: MapProps;
  localMapRef: RefObject<MapRef | null>;
}

const MapActiveSurface: FC<ActiveSurfaceProps> = ({ props, localMapRef }) => {
  const resolvedPins = resolveMapPins(props);
  const containerClass = resolveMapContainerClass(props.className);
  const effectiveViewState = resolveEffectiveViewState(
    props.initialViewState,
    Boolean(props.viewState)
  );
  const handleMapLoad = createMapLoadHandler(props, props.onLoad);

  const {
    pin: _pin,
    pins: _pins,
    pinLabel: _pinLabel,
    pinColor: _pinColor,
    pinIcon: _pinIcon,
    pinAriaLabel: _pinAriaLabel,
    showPin: _showPin,
    enable3DBuildings: _e3d,
    autoTransitionTo3D: _a3d,
    transitionDelayMs: _tDelay,
    transitionDurationMs: _tDur,
    targetPitch: _tPitch,
    targetBearing: _tBear,
    dataTestId = 'reapti-map',
    isLoading: _loading,
    webGLSupported: _wgl,
    className: _cls,
    children,
    initialViewState: _ivs,
    mapStyle,
    onLoad: _onLoad,
    ...restMapProps
  } = props;

  return (
    <Box className={containerClass} data-testid={dataTestId}>
      <ReactMapGL
        ref={localMapRef}
        mapLib={maplibregl}
        initialViewState={effectiveViewState}
        mapStyle={mapStyle ?? DEFAULT_MAP_STYLE}
        onLoad={handleMapLoad}
        {...restMapProps}
      >
        <MapPinList pins={resolvedPins} />
        {children}
      </ReactMapGL>
    </Box>
  );
};

export const Map = forwardRef<MapRef, MapProps>((props, ref) => {
  const localMapRef = useRef<MapRef | null>(null);
  useImperativeHandle(ref, () => localMapRef.current as MapRef, []);

  useMap3DTransition(localMapRef, props);

  const webGLAvailable = props.webGLSupported ?? isWebGLSupported();
  const containerClass = resolveMapContainerClass(props.className);

  if (!webGLAvailable) {
    const resolvedPins = resolveMapPins(props);
    return (
      <MapFallbackSurface
        containerClass={containerClass}
        testId={props.dataTestId ?? 'reapti-map-fallback'}
        pins={resolvedPins}
      />
    );
  }

  if (props.isLoading) {
    return (
      <MapSkeleton
        containerClass={containerClass}
        testId={props.dataTestId ?? 'reapti-map'}
      />
    );
  }

  return <MapActiveSurface props={props} localMapRef={localMapRef} />;
});

Map.displayName = 'Map';
