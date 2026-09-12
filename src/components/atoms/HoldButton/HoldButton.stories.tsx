import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoldButton } from './HoldButton.tsx';

const defaultLabel = 'Hold to Confirm';
const sunnyLabel = 'Hold for Sunshine';
const archLabel = 'Hold to Enter Arch';
const squareLabel = 'Square Hold Button';
const cookieLabel = 'Cookie Hold Action';
const fastHoldLabel = 'Quick Hold (400ms)';
const deleteLabel = 'Hold to Delete (2.5s)';
const outlinedLabel = 'Outlined Hold';
const tonalLabel = 'Tonal Hold';
const elevatedLabel = 'Elevated Hold';
const disabledLabel = 'Disabled Hold';
const compactSpacingLabel = 'Compact Gap (2px)';
const relaxedSpacingLabel = 'Relaxed Gap (8px)';

const meta = {
  title: 'Atoms/HoldButton',
  component: HoldButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    holdingTime: {
      control: { type: 'range', min: 200, max: 4000, step: 100 },
    },
    variant: {
      control: 'select',
      options: ['filled', 'tonal', 'elevated', 'outlined', 'text'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'extra-large'],
    },
    shape: {
      control: 'select',
      options: [
        'pill',
        'square',
        'sunny',
        'arch',
        '4-sided-cookie',
        'clover',
        'burst',
      ],
    },
    disabled: { control: 'boolean' },
    borderWidth: {
      control: 'select',
      options: ['thin', 'medium', 'thick', 'heavy', 1, 2, 3, 4],
    },
    borderSpacing: {
      control: 'select',
      options: ['none', 'compact', 'standard', 'relaxed', 0, 2, 4, 8],
    },
  },
} satisfies Meta<typeof HoldButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    holdingTime: 1000,
    shape: 'pill',
    variant: 'filled',
    size: 'medium',
    ariaLabel: defaultLabel,
    children: defaultLabel,
  },
};

export const SunnyShape: Story = {
  args: {
    holdingTime: 1200,
    shape: 'sunny',
    variant: 'filled',
    size: 'large',
    ariaLabel: sunnyLabel,
    children: sunnyLabel,
  },
};

export const ArchShape: Story = {
  args: {
    holdingTime: 1200,
    shape: 'arch',
    variant: 'tonal',
    size: 'large',
    ariaLabel: archLabel,
    children: archLabel,
  },
};

export const SquareShape: Story = {
  args: {
    holdingTime: 1000,
    shape: 'square',
    variant: 'filled',
    size: 'medium',
    ariaLabel: squareLabel,
    children: squareLabel,
  },
};

export const CookieShape: Story = {
  args: {
    holdingTime: 1200,
    shape: '4-sided-cookie',
    variant: 'filled',
    size: 'large',
    ariaLabel: cookieLabel,
    children: cookieLabel,
  },
};

export const FastHold: Story = {
  args: {
    holdingTime: 400,
    shape: 'pill',
    variant: 'filled',
    size: 'medium',
    ariaLabel: fastHoldLabel,
    children: fastHoldLabel,
  },
};

export const SafetyHold: Story = {
  args: {
    holdingTime: 2500,
    shape: 'pill',
    variant: 'filled',
    size: 'large',
    borderColor: 'var(--colors-error)',
    ariaLabel: deleteLabel,
    children: deleteLabel,
  },
};

export const Outlined: Story = {
  args: {
    holdingTime: 1000,
    shape: 'pill',
    variant: 'outlined',
    size: 'medium',
    ariaLabel: outlinedLabel,
    children: outlinedLabel,
  },
};

export const Tonal: Story = {
  args: {
    holdingTime: 1000,
    shape: 'pill',
    variant: 'tonal',
    size: 'medium',
    ariaLabel: tonalLabel,
    children: tonalLabel,
  },
};

export const Elevated: Story = {
  args: {
    holdingTime: 1000,
    shape: 'pill',
    variant: 'elevated',
    size: 'medium',
    ariaLabel: elevatedLabel,
    children: elevatedLabel,
  },
};

export const Disabled: Story = {
  args: {
    holdingTime: 1000,
    shape: 'pill',
    disabled: true,
    ariaLabel: disabledLabel,
    children: disabledLabel,
  },
};

export const CompactSpacing: Story = {
  args: {
    holdingTime: 1000,
    shape: 'sunny',
    variant: 'filled',
    size: 'medium',
    borderSpacing: 'compact',
    borderWidth: 'medium',
    ariaLabel: compactSpacingLabel,
    children: compactSpacingLabel,
  },
};

export const RelaxedSpacing: Story = {
  args: {
    holdingTime: 1200,
    shape: 'sunny',
    variant: 'filled',
    size: 'medium',
    borderSpacing: 'relaxed',
    borderWidth: 'thick',
    ariaLabel: relaxedSpacingLabel,
    children: relaxedSpacingLabel,
  },
};
