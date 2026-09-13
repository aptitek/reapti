import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { M3eIcon } from '@m3e/react/icon';
import { M3eIconButton } from '@m3e/react/icon-button';
import { VerticalAppBar } from './VerticalAppBar.tsx';
import type { VerticalNavBarItemConfig } from '../VerticalNavBar/VerticalNavBar.types.ts';

const navItems: readonly VerticalNavBarItemConfig[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'courses', label: 'Classes', icon: 'school' },
  { id: 'space', label: 'Aptispace', icon: 'rocket_launch' },
  { id: 'about', label: 'About', icon: 'person' },
];

function StoryContainer({ children }: { children: React.ReactNode }) {
  return (
    <Flex blockSize="600px" bg="surface" p="4">
      {children}
    </Flex>
  );
}

const meta: Meta<typeof VerticalAppBar> = {
  title: 'Molecules/VerticalAppBar',
  component: VerticalAppBar,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <StoryContainer>
        <Story />
      </StoryContainer>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VerticalAppBar>;

export const Default: Story = {
  args: {
    side: 'left',
    header: (
      <Box p="2" fontWeight="bold">
        Apti
      </Box>
    ),
    footer: (
      <M3eIconButton aria-label="Settings">
        <M3eIcon name="settings" />
      </M3eIconButton>
    ),
  },
};

export const WithNavItems: Story = {
  args: {
    side: 'left',
    items: navItems,
    selectedIndex: 0,
    header: (
      <Box p="2" fontWeight="bold">
        Aptitek
      </Box>
    ),
    footer: (
      <M3eIconButton aria-label="Account">
        <M3eIcon name="account_circle" />
      </M3eIconButton>
    ),
  },
};

export const RightSide: Story = {
  args: {
    side: 'right',
    items: navItems,
    selectedIndex: 1,
    header: (
      <Box p="2" fontWeight="bold">
        Drawer
      </Box>
    ),
  },
};

export const Elevated: Story = {
  args: {
    side: 'left',
    elevated: true,
    items: navItems,
    selectedIndex: 2,
    header: (
      <Box p="2" fontWeight="bold">
        Scrolled
      </Box>
    ),
  },
};

export const Compositional: Story = {
  render: () => (
    <VerticalAppBar
      side="left"
      header={<Box p="2">Header</Box>}
      footer={<Box p="2">Footer</Box>}
    >
      <Box p="4">Custom Navigation Content</Box>
    </VerticalAppBar>
  ),
};
