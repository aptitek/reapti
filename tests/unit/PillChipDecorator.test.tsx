import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import {
  PillChipDecorator,
  PillChip,
} from '../../src/components/atoms/PillChipDecorator/PillChipDecorator.tsx';

describe('PillChip Component Rendering', () => {
  it('renders label and tooltip accessibility attributes', () => {
    const html = renderToStaticMarkup(
      createElement(PillChip, {
        label: 'Dashboard',
        testId: 'dash-chip',
      })
    );

    expect(html).toContain('pill-chip_decorator_chip');
    expect(html).toContain('pill-chip_caption');
    expect(html).toContain('Dashboard');
    expect(html).toContain('role="tooltip"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-testid="dash-chip"');
  });

  it('renders badge when badge value is provided', () => {
    const html = renderToStaticMarkup(
      createElement(PillChip, {
        label: 'Inbox',
        badge: '5',
      })
    );

    expect(html).toContain('m3e-badge');
    expect(html).toContain('5');
  });

  it('triggers onClick when clicked', () => {
    const onClick = vi.fn();
    const vnode = PillChip({
      label: 'Clickable',
      onClick,
    });

    (vnode as unknown as { props: { onClick?: () => void } }).props.onClick?.();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('PillChipDecorator Active and Inactive States', () => {
  it('renders children with side pill chip when active', () => {
    const html = renderToStaticMarkup(
      createElement(
        PillChipDecorator,
        {
          label: 'Favorites',
          dataTestId: 'fav-decorator',
          chipTestId: 'fav-chip',
        },
        createElement(Box, { 'data-testid': 'target-icon' })
      )
    );

    expect(html).toContain('pill-chip_decorator');
    expect(html).toContain('data-testid="fav-decorator"');
    expect(html).toContain('data-testid="target-icon"');
    expect(html).toContain('pill-chip_decorator_chip');
    expect(html).toContain('Favorites');
    expect(html).toContain('data-testid="fav-chip"');
    expect(html).toContain('data-placement="end"');
  });

  it('omits pill chip when active is false but keeps container', () => {
    const html = renderToStaticMarkup(
      createElement(
        PillChipDecorator,
        {
          label: 'Hidden Chip',
          active: false,
          dataTestId: 'inactive-decorator',
        },
        createElement(Box, { 'data-testid': 'icon-only' })
      )
    );

    expect(html).toContain('data-testid="inactive-decorator"');
    expect(html).toContain('data-testid="icon-only"');
    expect(html).not.toContain('pill-chip_decorator_chip');
    expect(html).not.toContain('Hidden Chip');
    expect(html).toContain('data-active="false"');
  });
});

describe('PillChipDecorator Placement and Interactions', () => {
  it('supports placement="start" and open={true}', () => {
    const html = renderToStaticMarkup(
      createElement(
        PillChipDecorator,
        {
          label: 'Side Start',
          placement: 'start',
          open: true,
          className: 'custom-entry',
        },
        createElement(Box, null)
      )
    );

    expect(html).toContain('data-placement="start"');
    expect(html).toContain('data-open="true"');
    expect(html).toContain('custom-entry');
  });

  it('delegates onChipClick to chip', () => {
    const onChipClick = vi.fn();
    const vnode = PillChipDecorator({
      label: 'Click',
      children: null,
      onChipClick,
    });

    const children = (
      vnode as unknown as {
        props: {
          children: [unknown, { props: { onClick?: () => void } } | null];
        };
      }
    ).props.children;
    const chipNode = children[1];
    chipNode?.props.onClick?.();
    expect(onChipClick).toHaveBeenCalledTimes(1);
  });
});
