import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { M3eIcon } from '@m3e/react/icon';
import { PillChipDecorator, PillChip } from './PillChipDecorator.tsx';

const homeLabel = 'Home';
const notificationsLabel = 'Notifications';
const settingsLabel = 'Settings';
const profileLabel = 'Profile';
const searchLabel = 'Search';
const demoBadgeCount = '3';
const newBadge = 'NEW';

function MockNavButton({ icon, label }: { icon: string; label: string }) {
  return (
    <Box
      inlineSize="56px"
      blockSize="56px"
      borderRadius="full"
      bg="surfaceContainerLow"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      aria-label={label}
    >
      <M3eIcon name={icon} />
    </Box>
  );
}

const meta = {
  title: 'Atoms/PillChipDecorator',
  component: PillChipDecorator,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: homeLabel,
    active: true,
    placement: 'end',
    children: <MockNavButton icon="home" label={homeLabel} />,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['end', 'start'],
    },
    active: {
      control: 'boolean',
    },
    open: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof PillChipDecorator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: homeLabel,
    active: true,
    children: <MockNavButton icon="home" label={homeLabel} />,
  },
};

export const WithBadge: Story = {
  args: {
    label: notificationsLabel,
    badge: demoBadgeCount,
    active: true,
    children: <MockNavButton icon="notifications" label={notificationsLabel} />,
  },
};

export const PersistentOpen: Story = {
  args: {
    label: settingsLabel,
    badge: newBadge,
    active: true,
    open: true,
    children: <MockNavButton icon="settings" label={settingsLabel} />,
  },
};

export const StartPlacement: Story = {
  args: {
    label: profileLabel,
    placement: 'start',
    active: true,
    children: <MockNavButton icon="person" label={profileLabel} />,
  },
};

export const Inactive: Story = {
  args: {
    label: searchLabel,
    active: false,
    children: <MockNavButton icon="search" label={searchLabel} />,
  },
};

export const StandaloneChip: Story = {
  render: () => (
    <Flex gap="4" align="center">
      <PillChip label={homeLabel} />
      <PillChip label={notificationsLabel} badge={demoBadgeCount} />
    </Flex>
  ),
};
