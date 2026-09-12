import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import type { KeyboardEvent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  SegmentedChip,
  ChipSegment,
  ChipSegmentsList,
} from '../../src/components/atoms/SegmentedChip/SegmentedChip.tsx';
import type { SegmentedChipItemConfig } from '../../src/components/atoms/SegmentedChip/SegmentedChip.types.ts';

const sampleItems: SegmentedChipItemConfig[] = [
  { id: '1', label: 'Item 1', icon: 'star' },
  {
    id: '2',
    label: 'Item 2',
    icon: 'favorite',
    trailingIcon: 'arrow_drop_down',
    interaction: 'button',
    tooltip: 'Favorite item',
    onClick: () => {},
  },
  {
    id: '3',
    label: 'Item 3',
    icon: 'link',
    interaction: 'link',
    href: 'https://example.com',
    tooltip: 'External link',
  },
  { id: '4', label: 'Item 4', disabled: true },
];

interface RenderedBox {
  props: {
    onClick?: () => void;
    onKeyDown?: (e: KeyboardEvent) => void;
  };
}

function getSegmentBox(element: unknown): RenderedBox {
  return element as RenderedBox;
}

describe('SegmentedChip Static Markup', () => {
  it('renders root element and density presets', () => {
    const html = renderToStaticMarkup(
      createElement(SegmentedChip, {
        items: sampleItems,
        dataTestId: 'test-chip',
        ariaLabel: 'Categories',
      })
    );

    expect(html).toContain('segmented-chip');
    expect(html).toContain('segmented-chip-root');
    expect(html).toContain('segmented-chip-root--outlined');
    expect(html).toContain('segmented-chip-root--medium');
    expect(html).toContain('data-testid="test-chip"');
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Categories"');
  });

  it('renders elevated variant and small size', () => {
    const html = renderToStaticMarkup(
      createElement(SegmentedChip, {
        items: sampleItems,
        variant: 'elevated',
        size: 'small',
      })
    );

    expect(html).toContain('segmented-chip-root--elevated');
    expect(html).toContain('segmented-chip-root--small');
  });
});

describe('SegmentedChip Icon & Compositional Markup', () => {
  it('renders segment icons and trailing icons', () => {
    const html = renderToStaticMarkup(
      createElement(SegmentedChip, { items: sampleItems })
    );

    expect(html).toContain('segmented-chip__icon');
    expect(html).toContain('data-icon="star"');
    expect(html).toContain('segmented-chip__trailing-icon');
    expect(html).toContain('data-trailing-icon="arrow_drop_down"');
    expect(html).toContain('segmented-chip__label');
  });

  it('renders button and link semantics with M3e tooltips', () => {
    const html = renderToStaticMarkup(
      createElement(SegmentedChip, { items: sampleItems })
    );

    expect(html).toContain('data-interaction="button"');
    expect(html).toContain('role="button"');
    expect(html).toContain('data-interaction="link"');
    expect(html).toContain('role="link"');
    expect(html).toContain('m3e-tooltip');
    expect(html).toContain('Favorite item');
    expect(html).toContain('External link');
  });

  it('renders compositional children and disabled items', () => {
    const html = renderToStaticMarkup(
      createElement(
        SegmentedChip,
        null,
        createElement(ChipSegment, { label: 'Child A', icon: 'bolt' }),
        createElement(ChipSegment, { label: 'Child B', disabled: true })
      )
    );

    expect(html).toContain('Child A');
    expect(html).toContain('data-icon="bolt"');
    expect(html).toContain('segmented-chip__segment--disabled');
  });
});

describe('ChipSegment Click & Keydown Actions', () => {
  it('triggers onClick on click and ignores when disabled', () => {
    const onClick = vi.fn();
    const enabledSeg = ChipSegment({
      label: 'Test',
      interaction: 'button',
      onClick,
    });
    getSegmentBox(enabledSeg).props.onClick?.();
    expect(onClick).toHaveBeenCalledTimes(1);

    const disabledSeg = ChipSegment({
      label: 'Test',
      interaction: 'button',
      onClick,
      disabled: true,
    });
    expect(getSegmentBox(disabledSeg).props.onClick).toBeUndefined();
  });

  it('handles Enter and Space keydown for button interaction', () => {
    const onClick = vi.fn();
    const segment = ChipSegment({
      label: 'Key',
      interaction: 'button',
      onClick,
    });

    const box = getSegmentBox(segment);
    const preventDefault = vi.fn();
    box.props.onKeyDown?.({
      key: 'Enter',
      preventDefault,
    } as unknown as KeyboardEvent);
    expect(onClick).toHaveBeenCalledTimes(1);

    box.props.onKeyDown?.({
      key: ' ',
      preventDefault,
    } as unknown as KeyboardEvent);
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

describe('ChipSegment Link Interactions', () => {
  it('handles navigation on link interaction', () => {
    const mockWindow = { location: { href: '' }, open: vi.fn() };
    vi.stubGlobal('window', mockWindow);
    try {
      const seg = ChipSegment({
        label: 'L',
        interaction: 'link',
        href: '/nav',
      });
      getSegmentBox(seg).props.onClick?.();
      expect(mockWindow.location.href).toBe('/nav');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('opens new tab for target="_blank" link interaction', () => {
    const openMock = vi.fn();
    vi.stubGlobal('window', { location: { href: '' }, open: openMock });
    try {
      const seg = ChipSegment({
        label: 'Ext',
        interaction: 'link',
        href: '/ext',
        target: '_blank',
      });
      getSegmentBox(seg).props.onClick?.();
      expect(openMock).toHaveBeenCalledWith(
        '/ext',
        '_blank',
        'noopener,noreferrer'
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('ChipSegment Keys and SSR Fallbacks', () => {
  it('ignores non-activation keys on keydown', () => {
    const onClick = vi.fn();
    const preventDefault = vi.fn();
    const seg = ChipSegment({ label: 'Key', interaction: 'button', onClick });
    getSegmentBox(seg).props.onKeyDown?.({
      key: 'Tab',
      preventDefault,
    } as unknown as KeyboardEvent);
    expect(onClick).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('generates auto-incremented segment ID when id and dataTestId are absent', () => {
    const segment = ChipSegment({ label: 'Auto' });
    const box = segment as unknown as { props: { id?: string } };
    expect(box.props.id).toMatch(/^chip-seg-\d+$/);
  });

  it('handles link click when window is undefined without throwing', () => {
    const origWindow = globalThis.window;
    // @ts-expect-error testing SSR environment branch
    delete globalThis.window;
    try {
      const seg = ChipSegment({
        label: 'SSR',
        interaction: 'link',
        href: '/ssr',
      });
      expect(() => getSegmentBox(seg).props.onClick?.()).not.toThrow();
    } finally {
      globalThis.window = origWindow;
    }
  });
});

describe('ChipSegmentsList Item Delegation', () => {
  it('triggers item click handler from ChipSegmentsList items', () => {
    const onItemClick = vi.fn((item: SegmentedChipItemConfig) => {
      item.onClick?.();
    });
    const itemClick = vi.fn();
    const rendered = ChipSegmentsList({
      items: [
        {
          id: 'b1',
          label: 'Action',
          interaction: 'button',
          onClick: itemClick,
        },
      ],
      disabled: false,
      testId: 'test-chip',
      onItemClick,
    });

    expect(rendered).not.toBeNull();
    const children = (rendered as { props: { children: unknown[] } }).props
      .children;
    const itemVnode = (children as { props: { onClick?: () => void } }[])[0];
    expect(itemVnode.props.onClick).toBeDefined();
    itemVnode.props.onClick?.();
    expect(itemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledTimes(1);

    expect(
      ChipSegmentsList({ items: undefined, testId: 't', onItemClick })
    ).toBeNull();
    expect(
      ChipSegmentsList({ items: [], testId: 't', onItemClick })
    ).toBeNull();
  });
});
