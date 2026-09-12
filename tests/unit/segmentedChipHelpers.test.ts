import { describe, it, expect } from 'vitest';
import {
  resolveSegmentInteraction,
  resolveSegmentedChipRootClass,
  resolveSegmentItemClass,
  resolveAriaProps,
  resolveSegmentAria,
} from '../../src/components/atoms/SegmentedChip/segmentedChipHelpers.ts';

describe('resolveSegmentInteraction', () => {
  it('returns explicit interaction when provided', () => {
    expect(resolveSegmentInteraction('button', 'https://example.com')).toBe(
      'button'
    );
    expect(resolveSegmentInteraction('link', undefined, () => {})).toBe('link');
    expect(resolveSegmentInteraction('none', 'https://example.com')).toBe(
      'none'
    );
  });

  it('infers interaction from href and onClick props', () => {
    expect(resolveSegmentInteraction(undefined, 'https://example.com')).toBe(
      'link'
    );
    expect(resolveSegmentInteraction(undefined, undefined, () => {})).toBe(
      'button'
    );
    expect(resolveSegmentInteraction()).toBe('none');
  });
});

describe('resolveSegmentedChipRootClass', () => {
  it('returns default and parameterized class names', () => {
    const defaultCls = resolveSegmentedChipRootClass();
    expect(defaultCls).toContain('segmented-chip-root');
    expect(defaultCls).toContain('segmented-chip-root--outlined');
    expect(defaultCls).toContain('segmented-chip-root--medium');

    const customCls = resolveSegmentedChipRootClass(
      'custom',
      'elevated',
      'small'
    );
    expect(customCls).toContain('segmented-chip-root--elevated');
    expect(customCls).toContain('segmented-chip-root--small');
    expect(customCls).toContain('custom');
  });
});

describe('resolveSegmentItemClass', () => {
  it('applies modifiers for interaction and disabled states', () => {
    expect(resolveSegmentItemClass()).toBe('segmented-chip__segment');

    const btn = resolveSegmentItemClass(undefined, 'button');
    expect(btn).toContain('segmented-chip__segment--interactive');
    expect(btn).toContain('segmented-chip__segment--button');

    const link = resolveSegmentItemClass(undefined, 'link');
    expect(link).toContain('segmented-chip__segment--interactive');
    expect(link).toContain('segmented-chip__segment--link');

    const disabled = resolveSegmentItemClass('extra', 'none', true);
    expect(disabled).toContain('segmented-chip__segment--disabled');
    expect(disabled).toContain('extra');
  });
});

describe('resolveAriaProps and resolveSegmentAria', () => {
  it('resolves root container aria properties', () => {
    expect(resolveAriaProps().role).toBe('group');
    expect(resolveAriaProps('Tags')['aria-label']).toBe('Tags');
  });

  it('resolves segment aria labels and roles', () => {
    const basic = resolveSegmentAria({ label: 'Tags' });
    expect(basic['aria-label']).toBe('Tags');
    expect(basic.role).toBeUndefined();

    const btn = resolveSegmentAria({ label: 'Click', interaction: 'button' });
    expect(btn.role).toBe('button');

    const link = resolveSegmentAria({ label: 'Go', interaction: 'link' });
    expect(link.role).toBe('link');

    const disabled = resolveSegmentAria({ label: 'T', disabled: true });
    expect(disabled['aria-disabled']).toBe('true');
  });
});
