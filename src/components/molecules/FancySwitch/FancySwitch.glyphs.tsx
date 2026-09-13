import type { FC } from 'react';
import { Box } from 'styled-system/jsx';
import type {
  AnalogClockGlyphProps,
  BadgeRippleProps,
  BaseGlyphProps,
  CelestialGlyphProps,
  CountrySilhouetteProps,
  DigitalClockGlyphProps,
  DoorPortalProps,
  HoloNetworkProps,
  LockGlyphProps,
  PeekingBadgeProps,
  PeekingFlightProps,
  PeekingPedestrianProps,
} from './FancySwitch.types.ts';
import {
  createAnalogClockSvg,
  createArcSvg,
  createDoorSvg,
  createFlagFranceSvg,
  createFlagUkSvg,
  createMapSvg,
  createMoonSvg,
  createPathSvg,
  createRippleSvg,
  createSunSvg,
} from './fancySwitchGlyphHelpers.ts';
import {
  AIRPLANE_PATH,
  FRANCE_MAP_PATH,
  HOUSE_PATH,
  KEY_PATH,
  LAPTOP_PATH,
  LOCK_CLOSED_PATH,
  LOCK_OPEN_PATH,
  NFC_PATH,
  PEDESTRIAN_PATH,
  PIN_PATH,
  SCHOOL_PATH,
  UK_MAP_PATH,
} from './glyphPaths.ts';
import './fancySwitch.css';

export const HighContrastSunGlyph: FC<BaseGlyphProps> = ({
  size = 16,
  className,
}) => createSunSvg(size, className);

export const HighContrastMoonGlyph: FC<BaseGlyphProps> = ({
  size = 16,
  className,
}) => createMoonSvg(size, className);

export const ActiveZenithGlyph: FC<CelestialGlyphProps> = ({
  isDark,
  size = 16,
}) => (
  <Box
    className="fancy_zenith_handle"
    data-testid={isDark ? 'zenith-moon' : 'zenith-sun'}
  >
    {isDark ? (
      <HighContrastMoonGlyph size={size} />
    ) : (
      <Box className="fancy_sun_spinning">
        <HighContrastSunGlyph size={size} />
      </Box>
    )}
  </Box>
);

export const CelestialArcLine: FC<BaseGlyphProps> = () =>
  createArcSvg('M 4 27 Q 28 3 52 27', '2.5 3', '1.4');

export const UkFlag: FC<BaseGlyphProps> = ({ size = 20 }) =>
  createFlagUkSvg(size);

export const FranceFlag: FC<BaseGlyphProps> = ({ size = 20 }) =>
  createFlagFranceSvg(size);

export const UkMapSilhouette: FC<CountrySilhouetteProps> = ({
  size = 22,
  active = false,
}) => createMapSvg(UK_MAP_PATH, active, size);

export const FranceMapSilhouette: FC<CountrySilhouetteProps> = ({
  size = 22,
  active = false,
}) => createMapSvg(FRANCE_MAP_PATH, active, size);

export const MeridianBackground: FC<{ isFrench: boolean }> = ({ isFrench }) => (
  <Box className="fancy_celestial_arc">
    <Box className="fancy_country_zone fancy_country_zone_left">
      <UkMapSilhouette active={!isFrench} />
    </Box>
    <Box className="fancy_country_zone fancy_country_zone_right">
      <FranceMapSilhouette active={isFrench} />
    </Box>
    {createArcSvg('M 6 26 Q 28 4 50 26', '2 3', '1.2')}
  </Box>
);

export const FlightAirplane: FC<PeekingFlightProps> = ({
  size = 16,
  isFrench = false,
}) =>
  createPathSvg(AIRPLANE_PATH, {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    fill: 'currentColor',
    className: 'fancy_flight_airplane',
    'data-testid': 'peeking-airplane',
    'data-french': isFrench,
    'aria-hidden': 'true',
  });

export const ClockDigitPuck: FC<{ is24h: boolean }> = ({ is24h }) => (
  <Box className="fancy_clock_digit_text">{is24h ? '24' : '12'}</Box>
);

export const DigitalClockGlyph: FC<DigitalClockGlyphProps> = ({
  format = '12h',
}) => (
  <Box
    className="fancy_digital_slot"
    data-testid="digital-clock-slot"
    aria-hidden="true"
  >
    <Box as="span">{format === '24h' ? '24' : '12'}</Box>
  </Box>
);

export const AnalogClockGlyph: FC<AnalogClockGlyphProps> = ({ size = 18 }) =>
  createAnalogClockSvg(size);

const createThumbIcon = (
  d: string,
  opts: { size: number; testId: string; className?: string }
) =>
  createPathSvg(d, {
    viewBox: '0 0 24 24',
    width: opts.size,
    height: opts.size,
    fill: 'currentColor',
    className: opts.className ?? '',
    'data-testid': opts.testId,
    'aria-hidden': 'true',
  });

export const MapPinDrop: FC<BaseGlyphProps> = ({ size = 18 }) =>
  createThumbIcon(PIN_PATH, {
    size,
    testId: 'map-pin-glyph',
    className: 'fancy_pin_drop',
  });

export const RemoteHomeGlyph: FC<BaseGlyphProps> = ({ size = 18 }) =>
  createThumbIcon(LAPTOP_PATH, {
    size,
    testId: 'remote-laptop-glyph',
    className: 'fancy_laptop_home',
  });

export const WalkingPedestrianGlyph: FC<PeekingPedestrianProps> = ({
  size = 16,
  isInPerson = false,
}) =>
  createPathSvg(PEDESTRIAN_PATH, {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    fill: 'currentColor',
    className: 'fancy_pedestrian_mirror',
    'data-testid': 'peeking-pedestrian',
    'data-mirrored': isInPerson,
    'aria-hidden': 'true',
  });

const createHoloIcon = (d: string, testId: string) =>
  createPathSvg(d, {
    viewBox: '0 0 24 24',
    width: 14,
    height: 14,
    fill: 'currentColor',
    'data-testid': testId,
    'aria-hidden': 'true',
  });

export const HoloNetworkSilhouette: FC<HoloNetworkProps> = ({
  isInPerson = false,
}) => (
  <Box className="fancy_celestial_arc">
    <Box className="fancy_country_zone fancy_country_zone_left">
      <Box className="fancy_holo_wrapper" data-active={!isInPerson}>
        {createHoloIcon(HOUSE_PATH, 'holo-house-icon')}
      </Box>
    </Box>
    <Box className="fancy_country_zone fancy_country_zone_right">
      <Box className="fancy_holo_wrapper" data-active={isInPerson}>
        {createHoloIcon(SCHOOL_PATH, 'holo-school-icon')}
      </Box>
    </Box>
  </Box>
);

export const LockSecureGlyph: FC<LockGlyphProps> = ({
  isUnlocked = false,
  size = 18,
}) =>
  createThumbIcon(isUnlocked ? LOCK_OPEN_PATH : LOCK_CLOSED_PATH, {
    size,
    testId: isUnlocked ? 'lock-open-glyph' : 'lock-closed-glyph',
  });

export const AnimatedDoorPortal: FC<DoorPortalProps> = ({ isOpen = false }) => (
  <Box className="fancy_door_perspective" data-testid="animated-door-portal">
    <Box className="fancy_door_swing" data-open={isOpen}>
      {createDoorSvg(isOpen)}
    </Box>
  </Box>
);

export const HoloAccessScanner: FC<{ isUnlocked: boolean }> = ({
  isUnlocked,
}) => (
  <Box className="fancy_celestial_arc">
    <Box className="fancy_country_zone fancy_country_zone_left">
      <Box className="fancy_holo_wrapper" data-active={!isUnlocked}>
        {createHoloIcon(NFC_PATH, 'holo-nfc-icon')}
      </Box>
    </Box>
    <Box className="fancy_country_zone fancy_country_zone_right">
      <AnimatedDoorPortal isOpen={isUnlocked} />
    </Box>
  </Box>
);

export const PeekingBadgeCompanion: FC<PeekingBadgeProps> = ({ size = 16 }) => (
  <Box className="fancy_badge_companion" data-testid="peeking-badge">
    {createThumbIcon(KEY_PATH, { size, testId: 'peeking-badge-icon' })}
  </Box>
);

export const BadgeScanRippleEffect: FC<BadgeRippleProps> = ({
  isUnlocked = false,
  size = 20,
}) => createRippleSvg(isUnlocked, size);
