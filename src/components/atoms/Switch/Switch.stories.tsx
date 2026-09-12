import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch.tsx';

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    icons: {
      control: 'select',
      options: ['none', 'selected', 'both'],
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    size: 'medium',
    icons: 'none',
    ariaLabel: 'Default ME3 Switch',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    size: 'medium',
    icons: 'none',
    ariaLabel: 'Checked ME3 Switch',
  },
};

export const WithIcons: Story = {
  args: {
    checked: true,
    size: 'medium',
    icons: 'both',
    ariaLabel: 'ME3 Switch with native icons',
  },
};

export const SmallSize: Story = {
  args: {
    checked: true,
    size: 'small',
    icons: 'selected',
    ariaLabel: 'Small ME3 Switch',
  },
};

export const LargeSize: Story = {
  args: {
    checked: true,
    size: 'large',
    icons: 'both',
    ariaLabel: 'Large ME3 Switch',
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    size: 'medium',
    ariaLabel: 'Disabled ME3 Switch',
  },
};
