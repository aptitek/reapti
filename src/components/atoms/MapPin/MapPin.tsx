import {
  forwardRef,
  type FC,
  type ReactNode,
  type Ref,
  type MouseEvent,
} from 'react';
import { Box } from 'styled-system/jsx';
import { Marker } from 'react-map-gl/maplibre';
import { M3eIcon } from '@m3e/react/icon';
import { M3eChip } from '@m3e/react/chips';
import type { MapPinProps, MapPinChipVariant } from './MapPin.types.ts';
import {
  resolvePinConfig,
  createPinKeyDownHandler,
  createChipClickHandler,
  type ResolvedPinConfig,
} from './mapPinHelpers.ts';
import './mapPin.css';

export type { MapPinProps };

const PinLabelChip: FC<{
  label?: ReactNode;
  chipVariant?: MapPinChipVariant;
  testId: string;
  onChipClick?: (e: MouseEvent<HTMLElement>) => void;
}> = ({ label, chipVariant, testId, onChipClick }) =>
  label ? (
    <Box
      className="reapti_pin_chip_container"
      data-testid={`${testId}-chip-wrapper`}
    >
      <M3eChip
        variant={chipVariant}
        onClick={onChipClick}
        data-testid={`${testId}-chip`}
      >
        {label}
      </M3eChip>
    </Box>
  ) : null;

const PinMarkerGraphics: FC<{
  cfg: ResolvedPinConfig;
  showShadow: boolean;
  showRadar: boolean;
  testId: string;
}> = ({ cfg, showShadow, showRadar, testId }) => (
  <>
    {showShadow && <Box className="reapti_pin_shadow" aria-hidden="true" />}
    {showRadar && (
      <Box
        bg={cfg.color}
        className="reapti_pin_radar"
        data-testid={`${testId}-radar`}
        aria-hidden="true"
      />
    )}
    <Box
      color={cfg.color}
      className="reapti_pin_icon"
      data-testid={`${testId}-icon`}
      data-icon={cfg.icon}
    >
      <M3eIcon name={cfg.icon} variant={cfg.iconVariant} />
    </Box>
  </>
);

interface PinContainerProps {
  cfg: ResolvedPinConfig;
  props: MapPinProps;
  testId: string;
  refNode: Ref<HTMLDivElement>;
  children: ReactNode;
}

const PinContainer: FC<PinContainerProps> = ({
  cfg,
  props,
  testId,
  refNode,
  children,
}) => {
  if (cfg.isInteractive) {
    const onKeyDown = createPinKeyDownHandler(
      props.disabled,
      props.interactive,
      props.onClick
    );
    return (
      <Box
        ref={refNode}
        className={cfg.rootClass}
        tabIndex={0}
        role="button"
        aria-label={cfg.effectiveAria}
        aria-disabled={props.disabled ? true : undefined}
        onKeyDown={onKeyDown}
        onClick={props.onClick}
        data-testid={testId}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      ref={refNode}
      className={cfg.rootClass}
      role="img"
      aria-label={cfg.effectiveAria}
      data-testid={testId}
    >
      {children}
    </Box>
  );
};

interface GroundMarkerProps {
  longitude: number;
  latitude: number;
  color: string;
  testId: string;
  showShadow: boolean;
  showRadar: boolean;
}

const MapGroundMarker: FC<GroundMarkerProps> = (p) => (
  <Marker
    longitude={p.longitude}
    latitude={p.latitude}
    pitchAlignment="map"
    rotationAlignment="map"
    anchor="center"
  >
    <Box
      className="reapti_pin_ground_surface"
      data-testid={`${p.testId}-ground`}
      aria-hidden="true"
    >
      {p.showShadow && <Box className="reapti_pin_shadow" />}
      {p.showRadar && (
        <Box
          bg={p.color}
          className="reapti_pin_radar"
          data-testid={`${p.testId}-radar`}
        />
      )}
    </Box>
  </Marker>
);

const MapBillboardPin: FC<{
  cfg: ResolvedPinConfig;
  props: MapPinProps;
  testId: string;
  refNode: Ref<HTMLDivElement>;
  handleChipClick?: (e: MouseEvent<HTMLElement>) => void;
}> = ({ cfg, props, testId, refNode, handleChipClick }) => (
  <PinContainer cfg={cfg} props={props} testId={testId} refNode={refNode}>
    <PinLabelChip
      label={props.label}
      chipVariant={cfg.chipVariant}
      testId={testId}
      onChipClick={handleChipClick}
    />
    <Box
      color={cfg.color}
      className="reapti_pin_icon"
      data-testid={`${testId}-icon`}
      data-icon={cfg.icon}
    >
      <M3eIcon name={cfg.icon} variant={cfg.iconVariant} />
    </Box>
    {props.children}
  </PinContainer>
);

export const MapPin = forwardRef<HTMLDivElement, MapPinProps>((props, ref) => {
  const cfg = resolvePinConfig(props);
  const testId = props.dataTestId ?? 'map-pin';
  const handleChipClick = createChipClickHandler(props.onChipClick);

  if (
    typeof props.longitude === 'number' &&
    typeof props.latitude === 'number'
  ) {
    const hasGround = props.showRadar !== false || props.showShadow !== false;
    return (
      <>
        {hasGround && (
          <MapGroundMarker
            longitude={props.longitude}
            latitude={props.latitude}
            color={cfg.color}
            testId={testId}
            showShadow={props.showShadow !== false}
            showRadar={props.showRadar !== false}
          />
        )}
        <Marker
          longitude={props.longitude}
          latitude={props.latitude}
          pitchAlignment={cfg.pitchAlignment}
          rotationAlignment={cfg.rotationAlignment}
          anchor={cfg.anchor as 'bottom'}
          onClick={props.onClick}
        >
          <MapBillboardPin
            cfg={cfg}
            props={props}
            testId={testId}
            refNode={ref}
            handleChipClick={handleChipClick}
          />
        </Marker>
      </>
    );
  }

  return (
    <PinContainer cfg={cfg} props={props} testId={testId} refNode={ref}>
      <PinLabelChip
        label={props.label}
        chipVariant={cfg.chipVariant}
        testId={testId}
        onChipClick={handleChipClick}
      />
      <PinMarkerGraphics
        cfg={cfg}
        showShadow={props.showShadow !== false}
        showRadar={props.showRadar !== false}
        testId={testId}
      />
      {props.children}
    </PinContainer>
  );
});

MapPin.displayName = 'MapPin';
