import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from 'styled-system/jsx';
import { SegmentedChip, ChipSegment } from './SegmentedChip.tsx';
import type { SegmentedChipItemConfig } from './SegmentedChip.types.ts';

const meta = {
  title: 'Atoms/SegmentedChip',
  component: SegmentedChip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'elevated'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof SegmentedChip>;

export default meta;
type Story = StoryObj<typeof meta>;

const designLabel = 'Design';
const codeLabel = 'Code';
const researchLabel = 'Research';

const actionCopy = 'Copy link';
const actionShare = 'Share project';
const actionDownload = 'Download assets';

const linkDocs = 'Docs';
const linkGitHub = 'GitHub';
const linkDemo = 'Live Demo';

const tooltipCopy = 'Copy link to clipboard';
const tooltipShare = 'Share with colleagues';
const tooltipDownload = 'Download archive package';
const tooltipDocs = 'Read component documentation';
const tooltipGitHub = 'Open GitHub repository';
const tooltipDemo = 'Preview in sandbox';

const customTag1 = 'Edit';
const customTag2 = 'Duplicate';
const customTag3 = 'Docs Link';

const metadataItems: readonly SegmentedChipItemConfig[] = [
  { id: 'design', label: designLabel, icon: 'palette' },
  { id: 'code', label: codeLabel, icon: 'terminal' },
  { id: 'research', label: researchLabel, icon: 'search' },
];

const buttonItems: readonly SegmentedChipItemConfig[] = [
  {
    id: 'btn-copy',
    label: actionCopy,
    icon: 'content_copy',
    interaction: 'button',
    tooltip: tooltipCopy,
    onClick: () => {},
  },
  {
    id: 'btn-share',
    label: actionShare,
    icon: 'share',
    interaction: 'button',
    tooltip: tooltipShare,
    onClick: () => {},
  },
  {
    id: 'btn-download',
    label: actionDownload,
    icon: 'download',
    trailingIcon: 'open_in_new',
    interaction: 'button',
    tooltip: tooltipDownload,
    onClick: () => {},
  },
];

const linkItems: readonly SegmentedChipItemConfig[] = [
  {
    id: 'link-docs',
    label: linkDocs,
    icon: 'menu_book',
    interaction: 'link',
    href: 'https://m3.material.io',
    target: '_blank',
    tooltip: tooltipDocs,
  },
  {
    id: 'link-github',
    label: linkGitHub,
    icon: 'code',
    interaction: 'link',
    href: 'https://github.com',
    target: '_blank',
    tooltip: tooltipGitHub,
  },
  {
    id: 'link-demo',
    label: linkDemo,
    icon: 'play_arrow',
    interaction: 'link',
    href: '#demo',
    tooltip: tooltipDemo,
  },
];

const disabledItems: readonly SegmentedChipItemConfig[] = [
  { id: 'enabled-1', label: designLabel, icon: 'palette', onClick: () => {} },
  {
    id: 'disabled-2',
    label: codeLabel,
    icon: 'terminal',
    disabled: true,
    onClick: () => {},
  },
  { id: 'enabled-3', label: researchLabel, icon: 'search', onClick: () => {} },
];

export const Default: Story = {
  args: {
    items: metadataItems,
    variant: 'outlined',
    size: 'medium',
  },
};

export const ButtonInteractions: Story = {
  args: {
    items: buttonItems,
    variant: 'outlined',
    size: 'medium',
  },
};

export const LinkInteractions: Story = {
  args: {
    items: linkItems,
    variant: 'outlined',
    size: 'medium',
  },
};

export const ElevatedWithTooltips: Story = {
  args: {
    items: buttonItems,
    variant: 'elevated',
    size: 'medium',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Flex direction="column" gap="4" align="flex-start">
      <SegmentedChip {...args} items={buttonItems} size="small" />
      <SegmentedChip {...args} items={buttonItems} size="medium" />
      <SegmentedChip {...args} items={buttonItems} size="large" />
    </Flex>
  ),
};

export const Disabled: Story = {
  args: {
    items: disabledItems,
    variant: 'outlined',
    size: 'medium',
  },
};

export const Compositional: Story = {
  render: (args) => (
    <SegmentedChip {...args} variant="outlined" size="medium">
      <ChipSegment
        id="comp-edit"
        label={customTag1}
        icon="edit"
        interaction="button"
        tooltip={tooltipCopy}
        onClick={() => {}}
      />
      <ChipSegment
        id="comp-dup"
        label={customTag2}
        icon="content_copy"
        interaction="button"
        tooltip={tooltipShare}
        onClick={() => {}}
      />
      <ChipSegment
        id="comp-docs"
        label={customTag3}
        icon="description"
        interaction="link"
        href="https://example.com"
        target="_blank"
        tooltip={tooltipDocs}
      />
    </SegmentedChip>
  ),
};
