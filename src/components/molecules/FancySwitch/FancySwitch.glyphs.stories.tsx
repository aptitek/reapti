import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import {
  ActiveZenithGlyph,
  AnalogClockGlyph,
  AnimatedDoorPortal,
  BadgeScanRippleEffect,
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
} from './FancySwitch.glyphs.tsx';

const meta = {
  title: 'Molecules/FancySwitch/Glyphs',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;

export const CelestialGlyphs: StoryObj = {
  render: () => (
    <Flex
      gap="6"
      p="6"
      align="center"
      bg="var(--colors-surface)"
      borderRadius="xl"
    >
      <ActiveZenithGlyph isDark={false} size={24} />
      <ActiveZenithGlyph isDark={true} size={24} />
      <HighContrastSunGlyph size={24} />
      <HighContrastMoonGlyph size={24} />
    </Flex>
  ),
};

export const FlagsAndMaps: StoryObj = {
  render: () => (
    <Flex
      gap="6"
      p="6"
      align="center"
      bg="var(--colors-surface)"
      borderRadius="xl"
    >
      <UkFlag size={28} />
      <FranceFlag size={28} />
      <UkMapSilhouette size={28} active={true} />
      <FranceMapSilhouette size={28} active={true} />
      <FlightAirplane size={24} isFrench={false} />
      <FlightAirplane size={24} isFrench={true} />
      <Box w="56px" h="32px" position="relative">
        <MeridianBackground isFrench={false} />
      </Box>
    </Flex>
  ),
};

export const ClockGlyphs: StoryObj = {
  render: () => (
    <Flex
      gap="6"
      p="6"
      align="center"
      bg="var(--colors-surface)"
      borderRadius="xl"
    >
      <ClockDigitPuck is24h={false} />
      <ClockDigitPuck is24h={true} />
      <DigitalClockGlyph format="12h" />
      <DigitalClockGlyph format="24h" />
      <AnalogClockGlyph size={24} isAnimating={true} />
    </Flex>
  ),
};

export const AttendanceGlyphs: StoryObj = {
  render: () => (
    <Flex
      gap="6"
      p="6"
      align="center"
      bg="var(--colors-surface)"
      borderRadius="xl"
    >
      <MapPinDrop size={24} />
      <RemoteHomeGlyph size={24} />
      <WalkingPedestrianGlyph size={24} isInPerson={false} />
      <WalkingPedestrianGlyph size={24} isInPerson={true} />
      <Box w="56px" h="32px" position="relative">
        <HoloNetworkSilhouette isInPerson={false} />
      </Box>
    </Flex>
  ),
};

export const BadgeAccessGlyphs: StoryObj = {
  render: () => (
    <Flex
      gap="6"
      p="6"
      align="center"
      bg="var(--colors-surface)"
      borderRadius="xl"
    >
      <LockSecureGlyph isUnlocked={false} size={24} />
      <LockSecureGlyph isUnlocked={true} size={24} />
      <AnimatedDoorPortal isOpen={false} size={24} />
      <AnimatedDoorPortal isOpen={true} size={24} />
      <PeekingBadgeCompanion size={24} />
      <Box w="56px" h="32px" position="relative">
        <HoloAccessScanner isUnlocked={false} />
      </Box>
      <Box w="56px" h="32px" position="relative">
        <BadgeScanRippleEffect isUnlocked={true} size={24} />
      </Box>
    </Flex>
  ),
};
