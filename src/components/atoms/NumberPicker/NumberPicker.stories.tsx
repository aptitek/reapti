import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberPicker } from './NumberPicker.tsx';

const guestsLabel = 'Guests';
const quantityLabel = 'Quantity';
const yearRangeLabel = 'Year Range';
const priceRangeLabel = 'Price Range';
const anyPlaceholder = 'Any';
const disabledLabel = 'Disabled Picker';
const compactLabel = 'Compact Stepper';

const meta = {
  title: 'Atoms/NumberPicker',
  component: NumberPicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range'],
    },
    variant: {
      control: 'select',
      options: ['unified', 'split'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    showStepButtons: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    step: {
      control: { type: 'number', min: 1, max: 100 },
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof NumberPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: 'single',
    value: 4,
    label: guestsLabel,
    min: 1,
    max: 20,
    step: 1,
    showStepButtons: true,
  },
};

export const SingleWithLabel: Story = {
  args: {
    mode: 'single',
    value: 12,
    label: quantityLabel,
    min: 0,
    max: 100,
    step: 1,
    showStepButtons: true,
  },
};

export const SingleWithoutStepButtons: Story = {
  args: {
    mode: 'single',
    value: '',
    label: guestsLabel,
    placeholder: anyPlaceholder,
    showStepButtons: false,
  },
};

export const RangeUnified: Story = {
  args: {
    mode: 'range',
    variant: 'unified',
    minValue: 2020,
    maxValue: 2026,
    min: 1990,
    max: 2030,
    label: yearRangeLabel,
    showStepButtons: true,
  },
};

export const RangeSplit: Story = {
  args: {
    mode: 'range',
    variant: 'split',
    minValue: 25,
    maxValue: 75,
    min: 0,
    max: 100,
    label: priceRangeLabel,
    showStepButtons: true,
  },
};

export const Disabled: Story = {
  args: {
    mode: 'single',
    value: 5,
    label: disabledLabel,
    disabled: true,
  },
};

export const SmallSize: Story = {
  args: {
    mode: 'single',
    value: 3,
    label: compactLabel,
    size: 'small',
  },
};

export const MediumSize: Story = {
  args: {
    mode: 'range',
    variant: 'unified',
    minValue: 2022,
    maxValue: 2028,
    size: 'medium',
    label: yearRangeLabel,
  },
};
