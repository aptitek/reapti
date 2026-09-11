import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useContentElement, useA11yString } from '../../../i18n/context.tsx';
import { HoldButton } from './HoldButton.tsx';
import type { Me3Shape } from '../Me3Button/Me3Button.tsx';

function HoldButtonHarness({
  shape,
  holdTime,
}: {
  shape?: Me3Shape;
  holdTime?: number;
}): ReactNode {
  const content = useContentElement('cta');
  const ariaLabel = useA11yString('ctaAction');

  const handleHoldComplete = () => {
    // Action trigger for Storybook demo
  };

  return (
    <HoldButton
      variant="filled"
      shape={shape}
      holdTime={holdTime}
      aria-label={ariaLabel}
      onHoldComplete={handleHoldComplete}
    >
      {content}
    </HoldButton>
  );
}

const meta: Meta<typeof HoldButton> = {
  title: 'Atoms/HoldButton',
  component: HoldButton,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof HoldButton>;

export const Default: Story = {
  render: () => <HoldButtonHarness shape="rounded" />,
};

export const SunnyShape: Story = {
  render: () => <HoldButtonHarness shape="sunny" />,
};

export const ArchShape: Story = {
  render: () => <HoldButtonHarness shape="arch" />,
};

export const FastHold: Story = {
  render: () => <HoldButtonHarness shape="rounded" holdTime={500} />,
};
