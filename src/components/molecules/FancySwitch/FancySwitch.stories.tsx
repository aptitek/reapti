import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FC } from 'react';
import { Box, Flex } from 'styled-system/jsx';
import { M3eButton } from '@m3e/react/button';
import {
  FancySwitch,
  ZenithSwitch,
  MeridianSwitch,
  ClockFormatSwitch,
  AttendanceSwitch,
  BadgeAccessSwitch,
} from './FancySwitch.tsx';
import type {
  ClockFormat,
  AttendanceMode,
  SupportedLanguage,
  AccessStatus,
  SwitchSize,
} from './FancySwitch.types.ts';

const meta = {
  title: 'Molecules/FancySwitch',
  component: FancySwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FancySwitch>;

export default meta;

const SIZE_PRESETS: readonly SwitchSize[] = [
  'small',
  'medium',
  'large',
] as const;

const AllFancySwitchesStoryComponent: FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [clockFormat, setClockFormat] = useState<ClockFormat>('12h');
  const [attendanceMode, setAttendanceMode] =
    useState<AttendanceMode>('in-person');
  const [badgeAccessStatus, setBadgeAccessStatus] =
    useState<AccessStatus>('locked');
  const [size, setSize] = useState<SwitchSize>('medium');

  return (
    <Flex direction="column" gap="4" align="center">
      <Flex gap="2" align="center">
        <Box fontSize="xs" fontWeight="bold">
          Size Preset:
        </Box>
        {SIZE_PRESETS.map((s) => (
          <M3eButton
            key={s}
            variant={size === s ? 'filled' : 'outlined'}
            size="small"
            onClick={() => setSize(s)}
          >
            {s.toUpperCase()}
          </M3eButton>
        ))}
      </Flex>

      <Box
        p="6"
        minW="440px"
        borderRadius="2xl"
        bg="var(--fancy-switch-panel-bg)"
        color="var(--fancy-switch-panel-text)"
        border="1px solid var(--fancy-switch-panel-border)"
        boxShadow="0 12px 36px rgba(0, 0, 0, 0.45)"
        display="flex"
        flexDirection="column"
        gap="4"
      >
        <Box
          fontSize="lg"
          fontWeight="800"
          letterSpacing="-0.02em"
          color="var(--fancy-switch-panel-text)"
        >
          M3 Fancy Switch Suite
        </Box>

        {/* Row 1: Celestial Theme */}
        <Flex justify="space-between" align="center" py="2">
          <Flex direction="column" gap="0.5">
            <Box
              fontSize="sm"
              fontWeight="700"
              color="var(--fancy-switch-panel-text)"
            >
              Celestial Theme
            </Box>
            <Box fontSize="xs" color="var(--fancy-switch-panel-text-secondary)">
              {isDark ? 'Dark Mode (Moon)' : 'Light Mode (Sun)'}
            </Box>
          </Flex>
          <ZenithSwitch
            checked={isDark}
            onChange={setIsDark}
            size={size}
            dataTestId="showcase-theme-switch"
          />
        </Flex>

        <Box h="1px" bg="var(--fancy-switch-panel-divider)" />

        {/* Row 2: Meridian Flight */}
        <Flex justify="space-between" align="center" py="2">
          <Flex direction="column" gap="0.5">
            <Box
              fontSize="sm"
              fontWeight="700"
              color="var(--fancy-switch-panel-text)"
            >
              Meridian Flight
            </Box>
            <Box fontSize="xs" color="var(--fancy-switch-panel-text-secondary)">
              {lang === 'fr' ? 'Français (France)' : 'English (UK)'}
            </Box>
          </Flex>
          <MeridianSwitch
            language={lang}
            onLanguageChange={setLang}
            size={size}
            dataTestId="showcase-language-switch"
          />
        </Flex>

        <Box h="1px" bg="var(--fancy-switch-panel-divider)" />

        {/* Row 3: Clock 12h / 24h */}
        <Flex justify="space-between" align="center" py="2">
          <Flex direction="column" gap="0.5">
            <Box
              fontSize="sm"
              fontWeight="700"
              color="var(--fancy-switch-panel-text)"
            >
              Clock 12h / 24h
            </Box>
            <Box fontSize="xs" color="var(--fancy-switch-panel-text-secondary)">
              {clockFormat === '24h'
                ? '24-Hour Military Time'
                : '12-Hour AM/PM Time'}
            </Box>
          </Flex>
          <ClockFormatSwitch
            format={clockFormat}
            onChangeFormat={setClockFormat}
            size={size}
            dataTestId="showcase-clock-switch"
          />
        </Flex>

        <Box h="1px" bg="var(--fancy-switch-panel-divider)" />

        {/* Row 4: Attendance Mode */}
        <Flex justify="space-between" align="center" py="2">
          <Flex direction="column" gap="0.5">
            <Box
              fontSize="sm"
              fontWeight="700"
              color="var(--fancy-switch-panel-text)"
            >
              Attendance Mode
            </Box>
            <Box fontSize="xs" color="var(--fancy-switch-panel-text-secondary)">
              {attendanceMode === 'in-person'
                ? 'In-Person (On-Site Pin)'
                : 'Remote (Workstation / Walking Pedestrian)'}
            </Box>
          </Flex>
          <AttendanceSwitch
            mode={attendanceMode}
            onChangeMode={setAttendanceMode}
            size={size}
            dataTestId="showcase-attendance-switch"
          />
        </Flex>

        <Box h="1px" bg="var(--fancy-switch-panel-divider)" />

        {/* Row 5: Badge Access Control */}
        <Flex justify="space-between" align="center" py="2">
          <Flex direction="column" gap="0.5">
            <Box
              fontSize="sm"
              fontWeight="700"
              color="var(--fancy-switch-panel-text)"
            >
              Badge Access Control
            </Box>
            <Box fontSize="xs" color="var(--fancy-switch-panel-text-secondary)">
              {badgeAccessStatus === 'unlocked'
                ? 'Access Granted (Door Open, Unlocked Padlock)'
                : 'Secure Access (Door Closed, Locked Padlock, Tap Badge)'}
            </Box>
          </Flex>
          <BadgeAccessSwitch
            status={badgeAccessStatus}
            onChangeStatus={setBadgeAccessStatus}
            size={size}
            dataTestId="showcase-badge-access-switch"
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export const AllFancySwitchesShowcase: StoryObj = {
  render: () => <AllFancySwitchesStoryComponent />,
};

export const ThemeSwitchLight: StoryObj = {
  render: () => {
    const [isDark, setIsDark] = useState(false);
    return <ZenithSwitch checked={isDark} onChange={setIsDark} size="medium" />;
  },
};

export const ThemeSwitchDark: StoryObj = {
  render: () => {
    const [isDark, setIsDark] = useState(true);
    return <ZenithSwitch checked={isDark} onChange={setIsDark} size="medium" />;
  },
};

export const LanguageSwitchEnglish: StoryObj = {
  render: () => {
    const [lang, setLang] = useState<SupportedLanguage>('en');
    return (
      <MeridianSwitch
        language={lang}
        onLanguageChange={setLang}
        size="medium"
      />
    );
  },
};

export const LanguageSwitchFrench: StoryObj = {
  render: () => {
    const [lang, setLang] = useState<SupportedLanguage>('fr');
    return (
      <MeridianSwitch
        language={lang}
        onLanguageChange={setLang}
        size="medium"
      />
    );
  },
};

export const ClockSwitch12h: StoryObj = {
  render: () => {
    const [format, setFormat] = useState<ClockFormat>('12h');
    return (
      <ClockFormatSwitch
        format={format}
        onChangeFormat={setFormat}
        size="medium"
      />
    );
  },
};

export const ClockSwitch24h: StoryObj = {
  render: () => {
    const [format, setFormat] = useState<ClockFormat>('24h');
    return (
      <ClockFormatSwitch
        format={format}
        onChangeFormat={setFormat}
        size="medium"
      />
    );
  },
};

export const AttendanceSwitchInPerson: StoryObj = {
  render: () => {
    const [mode, setMode] = useState<AttendanceMode>('in-person');
    return (
      <AttendanceSwitch mode={mode} onChangeMode={setMode} size="medium" />
    );
  },
};

export const AttendanceSwitchRemote: StoryObj = {
  render: () => {
    const [mode, setMode] = useState<AttendanceMode>('remote');
    return (
      <AttendanceSwitch mode={mode} onChangeMode={setMode} size="medium" />
    );
  },
};

export const BadgeAccessLocked: StoryObj = {
  render: () => {
    const [status, setStatus] = useState<AccessStatus>('locked');
    return (
      <BadgeAccessSwitch
        status={status}
        onChangeStatus={setStatus}
        size="medium"
      />
    );
  },
};

export const BadgeAccessUnlocked: StoryObj = {
  render: () => {
    const [status, setStatus] = useState<AccessStatus>('unlocked');
    return (
      <BadgeAccessSwitch
        status={status}
        onChangeStatus={setStatus}
        size="medium"
      />
    );
  },
};
