import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/internal/preview-api';
import { Box, Flex } from 'styled-system/jsx';
import { M3eNavItem } from '@m3e/react/nav-bar';
import { M3eIcon } from '@m3e/react/icon';
import { M3eIconButton } from '@m3e/react/icon-button';
import { M3eBadge } from '@m3e/react/badge';
import { M3eFab } from '@m3e/react/fab';
import { VerticalNavBar } from './VerticalNavBar.tsx';
import type { VerticalNavBarItemConfig } from './VerticalNavBar.types.ts';

const homeLabel = 'Home';
const searchLabel = 'Search';
const exploreLabel = 'Explore';
const notificationsLabel = 'Notifications';
const settingsLabel = 'Settings';
const profileLabel = 'Profile';
const brandTitle = 'Aptitek';
const composeLabel = 'Compose';
const menuLabel = 'Toggle menu';
const activeIndicatorText = 'Active View:';
const sampleBadgeCount = '5';

const sampleNavItems: readonly VerticalNavBarItemConfig[] = [
  { id: 'home', label: homeLabel, icon: 'home', selectedIcon: 'home' },
  { id: 'search', label: searchLabel, icon: 'search' },
  { id: 'explore', label: exploreLabel, icon: 'explore' },
  {
    id: 'notifications',
    label: notificationsLabel,
    icon: 'notifications',
    badge: 3,
  },
  { id: 'settings', label: settingsLabel, icon: 'settings' },
];

function StoryContainer({ children }: { children: React.ReactNode }) {
  return (
    <Flex blockSize="520px" bg="surface" p="4">
      {children}
    </Flex>
  );
}

function InteractiveDemo() {
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentItem = sampleNavItems[selectedIndex];
  const activeName = currentItem ? currentItem.label : homeLabel;

  return (
    <Flex gap="6" inlineSize="100%" blockSize="100%">
      <VerticalNavBar
        isExpanded={expanded}
        onModeChange={(m) => setExpanded(m === 'expanded')}
        items={sampleNavItems}
        selectedIndex={selectedIndex}
        onSelect={(i) => setSelectedIndex(i)}
        header={
          <M3eIconButton
            aria-label={menuLabel}
            onClick={() => setExpanded(!expanded)}
          >
            <M3eIcon name="menu" />
          </M3eIconButton>
        }
        action={
          <M3eFab size="small" aria-label={composeLabel}>
            <M3eIcon name="edit" />
          </M3eFab>
        }
        footer={
          <M3eIconButton aria-label={profileLabel}>
            <M3eIcon name="account_circle" />
          </M3eIconButton>
        }
      />
      <Box p="6" flex="1">
        <Flex gap="2" alignItems="center">
          <Box fontWeight="bold">{activeIndicatorText}</Box>
          <Box>{activeName}</Box>
        </Flex>
      </Box>
    </Flex>
  );
}

const meta: Meta<typeof VerticalNavBar> = {
  title: 'Molecules/VerticalNavBar',
  component: VerticalNavBar,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      const [, updateArgs] = useArgs();
      return (
        <StoryContainer>
          <Story
            args={{
              ...context.args,
              onSelect: (
                nextIndex: number,
                item?: VerticalNavBarItemConfig
              ) => {
                updateArgs({ selectedIndex: nextIndex });
                context.args.onSelect?.(nextIndex, item);
              },
            }}
          />
        </StoryContainer>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof VerticalNavBar>;

export const Default: Story = {
  args: {
    items: sampleNavItems,
    selectedIndex: 0,
  },
};

export const Compact: Story = {
  args: {
    mode: 'compact',
    items: sampleNavItems,
    selectedIndex: 0,
  },
};

export const Expanded: Story = {
  args: {
    mode: 'expanded',
    items: sampleNavItems,
    selectedIndex: 1,
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    mode: 'compact',
    items: sampleNavItems,
    selectedIndex: 0,
    header: (
      <Box p="2" fontWeight="bold">
        {brandTitle}
      </Box>
    ),
    footer: (
      <M3eIconButton aria-label={profileLabel}>
        <M3eIcon name="account_circle" />
      </M3eIconButton>
    ),
  },
};

export const CompositionalChildren: Story = {
  render: () => (
    <VerticalNavBar mode="compact">
      <M3eNavItem selected>
        <M3eIcon slot="icon" name="home" />
        {homeLabel}
      </M3eNavItem>
      <M3eNavItem>
        <M3eIcon slot="icon" name="search" />
        {searchLabel}
      </M3eNavItem>
      <M3eNavItem>
        <M3eIcon slot="icon" name="notifications" />
        <M3eBadge slot="badge">{sampleBadgeCount}</M3eBadge>
        {notificationsLabel}
      </M3eNavItem>
      <M3eNavItem>
        <M3eIcon slot="icon" name="settings" />
        {settingsLabel}
      </M3eNavItem>
    </VerticalNavBar>
  ),
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
