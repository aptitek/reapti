import { describe, it, expect } from 'vitest';
import type {
  SegmentedChipVariant,
  SegmentedChipSize,
  SegmentInteraction,
  SegmentedChipItemConfig,
  SegmentedChipProps,
  ChipSegmentProps,
} from '../../src/components/atoms/SegmentedChip/SegmentedChip.types.ts';

describe('SegmentedChip Enumerated Types', () => {
  it('validates supported SegmentedChipVariant and Size values', () => {
    const outlined: SegmentedChipVariant = 'outlined';
    const elevated: SegmentedChipVariant = 'elevated';
    expect(outlined).toBe('outlined');
    expect(elevated).toBe('elevated');

    const small: SegmentedChipSize = 'small';
    const medium: SegmentedChipSize = 'medium';
    const large: SegmentedChipSize = 'large';
    expect(small).toBe('small');
    expect(medium).toBe('medium');
    expect(large).toBe('large');
  });

  it('validates supported SegmentInteraction values', () => {
    const btn: SegmentInteraction = 'button';
    const link: SegmentInteraction = 'link';
    const none: SegmentInteraction = 'none';

    expect(btn).toBe('button');
    expect(link).toBe('link');
    expect(none).toBe('none');
  });
});

describe('SegmentedChip Interface Structures', () => {
  it('validates SegmentedChipItemConfig structure', () => {
    const item: SegmentedChipItemConfig = {
      id: 'tag-1',
      label: 'Tag One',
      icon: 'palette',
      trailingIcon: 'arrow_drop_down',
      interaction: 'button',
      tooltip: 'Select palette',
      disabled: false,
      href: 'https://example.com',
      target: '_blank',
      ariaLabel: 'Accessible Tag One',
      onClick: () => {},
    };

    expect(item.id).toBe('tag-1');
    expect(item.label).toBe('Tag One');
    expect(item.icon).toBe('palette');
    expect(item.trailingIcon).toBe('arrow_drop_down');
    expect(item.interaction).toBe('button');
    expect(item.tooltip).toBe('Select palette');
    expect(item.disabled).toBe(false);
    expect(item.href).toBe('https://example.com');
  });

  it('validates SegmentedChipProps and ChipSegmentProps structures', () => {
    const props: SegmentedChipProps = {
      variant: 'elevated',
      size: 'large',
      disabled: true,
      ariaLabel: 'Filter Tags',
      className: 'my-custom-chip',
      dataTestId: 'custom-segmented-chip',
      items: [{ id: '1', label: 'Item 1' }],
    };
    expect(props.variant).toBe('elevated');
    expect(props.items?.length).toBe(1);

    const segmentProps: ChipSegmentProps = {
      id: 'segment-1',
      label: 'Segment 1',
      icon: 'star',
      trailingIcon: 'close',
      interaction: 'link',
      tooltip: 'Favorite item',
    };
    expect(segmentProps.id).toBe('segment-1');
    expect(segmentProps.interaction).toBe('link');
  });
});
