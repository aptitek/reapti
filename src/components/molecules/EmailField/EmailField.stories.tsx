import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { EmailField } from './EmailField.tsx';

const defaultLabel = 'Institutional Email';
const customLabel = 'Aptitek Work Email';
const controlledLabel = 'Controlled Account';
const errorLabel = 'Student Login';
const errorMessage = 'Username not found in system';
const helperMessage = 'Enter your school ID prefix';
const customPlaceholder = 'first.last';

function StoryContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box p="6" inlineSize="360px">
      {children}
    </Box>
  );
}

function ControlledDemo() {
  const [val, setVal] = useState('jane.doe');
  return (
    <Flex direction="column" gap="4">
      <EmailField
        label={controlledLabel}
        value={val}
        domain="example.com"
        onEmailChange={(_full, local) => setVal(local)}
      />
      <Box fontSize="sm" color="onSurfaceVariant">
        {val}
      </Box>
    </Flex>
  );
}

const meta: Meta<typeof EmailField> = {
  title: 'Molecules/EmailField',
  component: EmailField,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: defaultLabel,
    domain: 'example.com',
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
type Story = StoryObj<typeof EmailField>;

export const Default: Story = {};

export const CustomDomain: Story = {
  args: {
    label: customLabel,
    domain: 'aptitek.io',
    placeholder: customPlaceholder,
  },
};

export const Prepopulated: Story = {
  args: {
    defaultValue: 'alex.morgan',
    domain: 'example.com',
  },
};

export const Clearable: Story = {
  args: {
    defaultValue: 'sam.fisher',
    domain: 'example.com',
    showClearButton: true,
    showDomainLock: false,
  },
};

export const DomainLocked: Story = {
  args: {
    defaultValue: 'professor.smith',
    domain: 'university.edu',
    showDomainLock: true,
    showClearButton: false,
  },
};

export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    defaultValue: 'taylor.swift',
    domain: 'example.com',
  },
};

export const SmallDensity: Story = {
  args: {
    size: 'small',
    defaultValue: 'j.doe',
    domain: 'example.com',
  },
};

export const WithErrorAndHelperText: Story = {
  args: {
    label: errorLabel,
    defaultValue: 'invalid.user',
    domain: 'example.com',
    error: true,
    errorText: errorMessage,
    helperText: helperMessage,
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    defaultValue: 'archived.student',
    domain: 'example.com',
  },
};

export const ControlledState: Story = {
  render: () => <ControlledDemo />,
};
