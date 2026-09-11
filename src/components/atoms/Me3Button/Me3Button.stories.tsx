import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useContentElement, useA11yString } from '../../../i18n/context.tsx';
import { Me3Button } from './Me3Button.tsx';
import type { Me3Shape } from './Me3Button.tsx';

function ButtonHarness({
  shape,
  targetShape,
}: {
  shape?: Me3Shape;
  targetShape?: Me3Shape;
}): ReactNode {
  const content = useContentElement('cta');
  const ariaLabel = useA11yString('ctaAction');

  return (
    <Me3Button
      variant="filled"
      shape={shape}
      targetShape={targetShape}
      aria-label={ariaLabel}
    >
      {content}
    </Me3Button>
  );
}

const meta: Meta<typeof Me3Button> = {
  title: 'Atoms/Me3Button',
  component: Me3Button,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Me3Button>;

export const Default: Story = {
  render: () => <ButtonHarness shape="rounded" />,
};

export const SunnyShape: Story = {
  render: () => <ButtonHarness shape="sunny" />,
};

export const ArchShape: Story = {
  render: () => <ButtonHarness shape="arch" />,
};

export const CookieShape: Story = {
  render: () => <ButtonHarness shape="4-sided-cookie" />,
};

export const MorphOnHover: Story = {
  render: () => <ButtonHarness shape="sunny" targetShape="arch" />,
};
