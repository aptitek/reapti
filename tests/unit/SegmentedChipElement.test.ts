import { describe, it, expect, vi } from 'vitest';
import { LitElement } from 'lit';
import {
  SegmentedChipElement,
  ChipSegmentElement,
  M3eSegmentedChip,
  M3eChipSegment,
  registerSegmentedChipElements,
} from '../../src/components/atoms/SegmentedChip/SegmentedChipElement.ts';

describe('SegmentedChipElement Registry & Instantiation', () => {
  it('extends LitElement and registers custom elements', () => {
    expect(SegmentedChipElement.prototype instanceof LitElement).toBe(true);
    expect(ChipSegmentElement.prototype instanceof LitElement).toBe(true);

    expect(customElements.get('segmented-chip')).toBe(SegmentedChipElement);
    expect(customElements.get('chip-segment')).toBe(ChipSegmentElement);

    expect(M3eSegmentedChip).toBeDefined();
    expect(M3eChipSegment).toBeDefined();
  });

  it('initializes default properties', () => {
    const el = new SegmentedChipElement();
    expect(el.variant).toBe('outlined');
    expect(el.size).toBe('medium');
    expect(el.disabled).toBe(false);

    const segment = new ChipSegmentElement();
    expect(segment.disabled).toBe(false);
  });
});

describe('SegmentedChipElement Boundary & Lifecycle', () => {
  it('updates segment boundaries with data-first and data-last', () => {
    const el = new SegmentedChipElement();
    const seg1 = { toggleAttribute: vi.fn() };
    const seg2 = { toggleAttribute: vi.fn() };
    const seg3 = { toggleAttribute: vi.fn() };

    el.querySelectorAll = vi
      .fn()
      .mockReturnValue([
        seg1,
        seg2,
        seg3,
      ]) as unknown as typeof el.querySelectorAll;

    el.updateSegmentBoundaries();

    expect(seg1.toggleAttribute).toHaveBeenCalledWith('data-first', true);
    expect(seg1.toggleAttribute).toHaveBeenCalledWith('data-last', false);
    expect(seg2.toggleAttribute).toHaveBeenCalledWith('data-first', false);
    expect(seg2.toggleAttribute).toHaveBeenCalledWith('data-last', false);
    expect(seg3.toggleAttribute).toHaveBeenCalledWith('data-first', false);
    expect(seg3.toggleAttribute).toHaveBeenCalledWith('data-last', true);
  });

  it('handles slot change event by invoking updateSegmentBoundaries', () => {
    const el = new SegmentedChipElement();
    const spy = vi.spyOn(el, 'updateSegmentBoundaries');
    el.handleSlotChange();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('handles connectedCallback with and without document', () => {
    const el = new SegmentedChipElement();
    const updateSpy = vi.spyOn(el, 'updateSegmentBoundaries');
    const superConnect = vi
      .spyOn(LitElement.prototype, 'connectedCallback')
      .mockImplementation(() => {});

    el.connectedCallback();
    expect(updateSpy).toHaveBeenCalledTimes(1);

    const g = globalThis as unknown as { document?: unknown };
    g.document = {};
    el.connectedCallback();
    expect(superConnect).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledTimes(2);
    delete g.document;

    superConnect.mockRestore();
    updateSpy.mockRestore();
  });

  it('updates boundaries correctly for a single child segment', () => {
    const el = new SegmentedChipElement();
    const seg = { toggleAttribute: vi.fn() };
    el.querySelectorAll = vi
      .fn()
      .mockReturnValue([seg]) as unknown as typeof el.querySelectorAll;

    el.updateSegmentBoundaries();
    expect(seg.toggleAttribute).toHaveBeenCalledWith('data-first', true);
    expect(seg.toggleAttribute).toHaveBeenCalledWith('data-last', true);
  });

  it('safely handles updateSegmentBoundaries when querySelectorAll is unavailable', () => {
    const bare = Object.create(SegmentedChipElement.prototype);
    expect(() => bare.updateSegmentBoundaries()).not.toThrow();
  });
});

describe('ChipSegmentElement Rendering & Registration Guards', () => {
  it('renders slot templates for both elements', () => {
    const el = new SegmentedChipElement();
    expect(el.render()).toBeDefined();

    const segment = new ChipSegmentElement();
    expect(segment.render()).toBeDefined();
    segment.icon = 'star';
    segment.trailingIcon = 'close';
    segment.href = 'https://example.com';
    segment.target = '_blank';
    expect(segment.icon).toBe('star');
    expect(segment.trailingIcon).toBe('close');
    expect(segment.href).toBe('https://example.com');
    expect(segment.target).toBe('_blank');
  });

  it('handles re-registration and environment when customElements is undefined', () => {
    expect(() => registerSegmentedChipElements()).not.toThrow();

    const g = globalThis as unknown as { customElements?: unknown };
    const origCustomElements = g.customElements;
    delete g.customElements;
    expect(() => registerSegmentedChipElements()).not.toThrow();
    g.customElements = origCustomElements;
  });
});
