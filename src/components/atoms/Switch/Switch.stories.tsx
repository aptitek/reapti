import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/internal/preview-api';
import { createElement, type ReactNode } from 'react';
import { Switch } from './Switch.tsx';

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      const [, updateArgs] = useArgs();
      return (
        <Story
          args={{
            ...context.args,
            onChange: (nextChecked: boolean) => {
              updateArgs({ checked: nextChecked });
              context.args.onChange?.(nextChecked);
            },
          }}
        />
      );
    },
  ],
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

function createSvgPath(d: string): ReactNode {
  return createElement(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: 16,
      height: 16,
      fill: 'currentColor',
      'aria-hidden': 'true',
    },
    createElement('path', { d })
  );
}

const SunGhost = createElement(
  'svg',
  {
    viewBox: '0 0 24 24',
    width: 16,
    height: 16,
    fill: 'currentColor',
    'aria-hidden': 'true',
  },
  createElement('circle', { cx: 12, cy: 12, r: 5 }),
  createElement('path', {
    d: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
  })
);

const MoonGhost = createSvgPath(
  'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
);
const PeekingFlight = createSvgPath(
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'
);
const PeekingHotel = createSvgPath(
  'M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z'
);

const SpinTransition = createElement(
  'svg',
  {
    viewBox: '0 0 24 24',
    width: 14,
    height: 14,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    'aria-hidden': 'true',
  },
  createElement('path', {
    d: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  })
);

const SvgBackgroundGraphic = createElement(
  'svg',
  {
    viewBox: '0 0 100 60',
    width: '100%',
    height: '100%',
    preserveAspectRatio: 'none',
    'aria-hidden': 'true',
  },
  createElement(
    'defs',
    null,
    createElement(
      'linearGradient',
      { id: 'sb-bg-grad', x1: '0', y1: '0', x2: '1', y2: '1' },
      createElement('stop', {
        offset: '0%',
        stopColor: 'var(--colors-tertiary)',
      }),
      createElement('stop', {
        offset: '100%',
        stopColor: 'var(--colors-secondary)',
      })
    )
  ),
  createElement('rect', {
    width: '100',
    height: '60',
    fill: 'url(#sb-bg-grad)',
    opacity: '0.4',
  }),
  createElement('path', {
    d: 'M0 40 Q 25 20, 50 40 T 100 40 L 100 60 L 0 60 Z',
    fill: 'currentColor',
    opacity: '0.2',
  })
);

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

export const WithGhostIcons: Story = {
  args: {
    checked: false,
    size: 'medium',
    on: { ghostIcon: SunGhost },
    off: { ghostIcon: MoonGhost },
    ariaLabel: 'Switch with ghost icons on opposite side',
  },
};

export const WithGlyphGhostIcons: Story = {
  args: {
    checked: false,
    size: 'medium',
    on: { ghostIcon: 'PM' },
    off: { ghostIcon: 'AM' },
    ariaLabel: 'Switch with arbitrary glyph ghost icons',
  },
};

export const WithCustomColors: Story = {
  args: {
    checked: true,
    size: 'medium',
    on: {
      color: 'var(--colors-tertiary)',
      handleColor: 'var(--colors-on-tertiary)',
    },
    off: {
      color: 'var(--colors-surface-container-highest)',
      handleColor: 'var(--colors-primary)',
    },
    ariaLabel: 'Switch with custom on and off colors',
  },
};

export const WithPeekingIcon: Story = {
  args: {
    checked: false,
    size: 'medium',
    on: {
      peekingIcon: PeekingFlight,
      peekingRotation: 180,
      peekingSymmetry: true,
    },
    off: {
      peekingIcon: PeekingHotel,
      peekingRotation: 0,
    },
    ariaLabel: 'Switch with peeking icon on hover',
  },
};

export const WithSvgBackground: Story = {
  args: {
    checked: true,
    size: 'large',
    backgroundSvg: SvgBackgroundGraphic,
    on: { ghostIcon: SunGhost, peekingIcon: PeekingFlight },
    off: { ghostIcon: MoonGhost, peekingIcon: PeekingHotel },
    ariaLabel: 'Switch with layered SVG background',
  },
};

export const WithHandleTransition: Story = {
  args: {
    checked: false,
    size: 'medium',
    on: { handleIcon: SunGhost },
    off: { handleIcon: MoonGhost },
    handleTransitionComponent: SpinTransition,
    transitionDuration: 350,
    ariaLabel: 'Switch with handle transition component',
  },
};

export const AllFeaturesCombined: Story = {
  args: {
    checked: true,
    size: 'large',
    backgroundSvg: SvgBackgroundGraphic,
    handleTransitionComponent: SpinTransition,
    transitionDuration: 300,
    on: {
      color: 'var(--colors-primary)',
      handleColor: 'var(--colors-on-primary)',
      ghostIcon: SunGhost,
      peekingIcon: PeekingFlight,
      peekingRotation: 180,
      peekingSymmetry: 'horizontal',
      handleIcon: SunGhost,
    },
    off: {
      color: 'var(--colors-surface-variant)',
      handleColor: 'var(--colors-outline)',
      ghostIcon: MoonGhost,
      peekingIcon: PeekingHotel,
      handleIcon: MoonGhost,
    },
    ariaLabel: 'Switch with all features combined',
  },
};
