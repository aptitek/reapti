import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { ThemeProvider } from './ThemeProvider.tsx';
import { useTheme } from './useTheme.ts';
import { HoldButton } from '../components/atoms/HoldButton/HoldButton.tsx';
import { Switch } from '../components/atoms/Switch/Switch.tsx';
import { SegmentedChip } from '../components/atoms/SegmentedChip/SegmentedChip.tsx';

interface SwatchDef {
  id: string;
  label: string;
  bg: string;
  color: string;
}

const COLOR_SWATCHES: readonly SwatchDef[] = [
  { id: 'primary', label: 'Primary', bg: 'primary', color: 'onPrimary' },
  {
    id: 'primary-c',
    label: 'Primary Container',
    bg: 'primaryContainer',
    color: 'onPrimaryContainer',
  },
  {
    id: 'secondary',
    label: 'Secondary',
    bg: 'secondary',
    color: 'onSecondary',
  },
  {
    id: 'secondary-c',
    label: 'Secondary Container',
    bg: 'secondaryContainer',
    color: 'onSecondaryContainer',
  },
  { id: 'tertiary', label: 'Tertiary', bg: 'tertiary', color: 'onTertiary' },
  {
    id: 'tertiary-c',
    label: 'Tertiary Container',
    bg: 'tertiaryContainer',
    color: 'onTertiaryContainer',
  },
  { id: 'error', label: 'Error', bg: 'error', color: 'onError' },
];

const HOLD_LABEL = 'Hold Action';
const TONAL_LABEL = 'Tonal Action';
const CHIP_SEGMENTS = [
  { id: 'exotic', label: 'Exotic Dev', interaction: 'button' as const },
  { id: 'audit', label: 'Audit Mode', interaction: 'button' as const },
];

const ColorSwatches = () => (
  <Flex gap="3" wrap="wrap" mb="6">
    {COLOR_SWATCHES.map((swatch) => (
      <Box
        key={swatch.id}
        p="3"
        bg={swatch.bg}
        color={swatch.color}
        borderRadius="small"
        fontWeight="semibold"
      >
        {swatch.label}
      </Box>
    ))}
  </Flex>
);

const InteractiveControls = () => (
  <Flex gap="4" align="center" wrap="wrap">
    <HoldButton variant="filled">{HOLD_LABEL}</HoldButton>
    <HoldButton variant="tonal">{TONAL_LABEL}</HoldButton>
    <Switch defaultChecked />
    <SegmentedChip items={CHIP_SEGMENTS} />
  </Flex>
);

function ThemeDemo() {
  const { themeName, mode, resolvedMode } = useTheme();
  const status = `${themeName.toUpperCase()} — ${mode} (${resolvedMode})`;

  return (
    <Box
      p="6"
      bg="surface"
      color="onSurface"
      borderRadius="large"
      border="1px solid"
      borderColor="outlineVariant"
    >
      <Box fontSize="xl" fontWeight="bold" mb="4">
        {status}
      </Box>
      <ColorSwatches />
      <InteractiveControls />
    </Box>
  );
}

const meta: Meta<typeof ThemeProvider> = {
  title: 'Architecture/ThemeProvider',
  component: ThemeProvider,
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

export const SolarizedLight: Story = {
  args: {
    defaultThemeName: 'solarized',
    defaultMode: 'light',
    children: <ThemeDemo />,
  },
};

export const SolarizedDark: Story = {
  args: {
    defaultThemeName: 'solarized',
    defaultMode: 'dark',
    children: <ThemeDemo />,
  },
};

export const Md3Light: Story = {
  args: {
    defaultThemeName: 'md3',
    defaultMode: 'light',
    children: <ThemeDemo />,
  },
};

export const Md3Dark: Story = {
  args: {
    defaultThemeName: 'md3',
    defaultMode: 'dark',
    children: <ThemeDemo />,
  },
};

export const ExoticLight: Story = {
  args: {
    defaultThemeName: 'exotic',
    defaultMode: 'light',
    children: <ThemeDemo />,
  },
};

export const ExoticDark: Story = {
  args: {
    defaultThemeName: 'exotic',
    defaultMode: 'dark',
    children: <ThemeDemo />,
  },
};
