import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ActiveZenithGlyph,
  AnalogClockGlyph,
  AnimatedDoorPortal,
  BadgeScanRippleEffect,
  CelestialArcLine,
  ClockDigitPuck,
  DigitalClockGlyph,
  FlightAirplane,
  FranceFlag,
  FranceMapSilhouette,
  HighContrastMoonGlyph,
  HighContrastSunGlyph,
  HoloAccessScanner,
  HoloNetworkSilhouette,
  LockSecureGlyph,
  MapPinDrop,
  MeridianBackground,
  PeekingBadgeCompanion,
  RemoteHomeGlyph,
  UkFlag,
  UkMapSilhouette,
  WalkingPedestrianGlyph,
} from '../../src/components/molecules/FancySwitch/FancySwitch.glyphs.tsx';

describe('FancySwitch Glyphs - Celestial & Geographic', () => {
  it('renders celestial glyphs correctly', () => {
    const sunHtml = renderToStaticMarkup(
      createElement(HighContrastSunGlyph, { size: 20 })
    );
    expect(sunHtml).toContain('fancy_sun_glyph');

    const moonHtml = renderToStaticMarkup(
      createElement(HighContrastMoonGlyph, { size: 20 })
    );
    expect(moonHtml).toContain('fancy_moon_glyph');

    const darkActiveHtml = renderToStaticMarkup(
      createElement(ActiveZenithGlyph, { isDark: true })
    );
    expect(darkActiveHtml).toContain('zenith-moon');

    const lightActiveHtml = renderToStaticMarkup(
      createElement(ActiveZenithGlyph, { isDark: false })
    );
    expect(lightActiveHtml).toContain('zenith-sun');

    const arcHtml = renderToStaticMarkup(createElement(CelestialArcLine));
    expect(arcHtml).toContain('fancy_celestial_arc');
  });

  it('renders flags and map silhouettes correctly', () => {
    const ukFlagHtml = renderToStaticMarkup(
      createElement(UkFlag, { size: 24 })
    );
    expect(ukFlagHtml).toContain('fancy_flag_puck');

    const frFlagHtml = renderToStaticMarkup(
      createElement(FranceFlag, { size: 24 })
    );
    expect(frFlagHtml).toContain('fancy_flag_puck');

    const ukMapHtml = renderToStaticMarkup(
      createElement(UkMapSilhouette, { active: true })
    );
    expect(ukMapHtml).toContain('data-active="true"');

    const frMapHtml = renderToStaticMarkup(
      createElement(FranceMapSilhouette, { active: false })
    );
    expect(frMapHtml).toContain('data-active="false"');

    const meridianBgHtml = renderToStaticMarkup(
      createElement(MeridianBackground, { isFrench: true })
    );
    expect(meridianBgHtml).toContain('fancy_country_zone');

    const airplaneHtml = renderToStaticMarkup(
      createElement(FlightAirplane, { isFrench: true })
    );
    expect(airplaneHtml).toContain('peeking-airplane');
  });
});

describe('FancySwitch Glyphs - Time Glyphs', () => {
  it('renders clock digit pucks and digital clock slot', () => {
    const puck12Html = renderToStaticMarkup(
      createElement(ClockDigitPuck, { is24h: false })
    );
    expect(puck12Html).toContain('12');

    const puck24Html = renderToStaticMarkup(
      createElement(ClockDigitPuck, { is24h: true })
    );
    expect(puck24Html).toContain('24');

    const digitalSlotHtml = renderToStaticMarkup(
      createElement(DigitalClockGlyph, { format: '24h' })
    );
    expect(digitalSlotHtml).toContain('digital-clock-slot');
    expect(digitalSlotHtml).toContain('24');
    expect(digitalSlotHtml).not.toContain('digital-colon');
    expect(digitalSlotHtml).not.toContain('00');

    const analogHtml = renderToStaticMarkup(
      createElement(AnalogClockGlyph, { isAnimating: true })
    );
    expect(analogHtml).toContain('switch-analog-clock');
  });
});

describe('FancySwitch Glyphs - Attendance & Access Control', () => {
  it('renders attendance and access control glyphs', () => {
    const pinHtml = renderToStaticMarkup(createElement(MapPinDrop));
    expect(pinHtml).toContain('map-pin-glyph');

    const laptopHtml = renderToStaticMarkup(createElement(RemoteHomeGlyph));
    expect(laptopHtml).toContain('remote-laptop-glyph');

    const pedestrianHtml = renderToStaticMarkup(
      createElement(WalkingPedestrianGlyph, { isInPerson: true })
    );
    expect(pedestrianHtml).toContain('peeking-pedestrian');
    expect(pedestrianHtml).toContain('data-mirrored="true"');

    const holoNetHtml = renderToStaticMarkup(
      createElement(HoloNetworkSilhouette, { isInPerson: true })
    );
    expect(holoNetHtml).toContain('holo-school-icon');
    expect(holoNetHtml).toContain('holo-house-icon');

    const lockClosedHtml = renderToStaticMarkup(
      createElement(LockSecureGlyph, { isUnlocked: false })
    );
    expect(lockClosedHtml).toContain('lock-closed-glyph');

    const lockOpenHtml = renderToStaticMarkup(
      createElement(LockSecureGlyph, { isUnlocked: true })
    );
    expect(lockOpenHtml).toContain('lock-open-glyph');

    const doorPortalHtml = renderToStaticMarkup(
      createElement(AnimatedDoorPortal, { isOpen: true })
    );
    expect(doorPortalHtml).toContain('meeting-room-open-icon');

    const doorClosedPortalHtml = renderToStaticMarkup(
      createElement(AnimatedDoorPortal, { isOpen: false })
    );
    expect(doorClosedPortalHtml).toContain('door-front-closed-icon');

    const holoAccessHtml = renderToStaticMarkup(
      createElement(HoloAccessScanner, { isUnlocked: true })
    );
    expect(holoAccessHtml).toContain('holo-nfc-icon');

    const badgeHtml = renderToStaticMarkup(
      createElement(PeekingBadgeCompanion)
    );
    expect(badgeHtml).toContain('peeking-badge');

    const rippleHtml = renderToStaticMarkup(
      createElement(BadgeScanRippleEffect, { isUnlocked: true })
    );
    expect(rippleHtml).toContain('badge-scan-ripple');
  });
});
