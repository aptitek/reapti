import { describe, it, expect, vi } from 'vitest';
import type { KeyboardEvent } from 'react';
import { ChipSegment } from '../../src/components/atoms/SegmentedChip/SegmentedChip.tsx';

interface RenderedBox {
  props: {
    onClick?: () => void;
    onKeyDown?: (e: KeyboardEvent) => void;
  };
}

function getSegmentBox(element: unknown): RenderedBox {
  return element as RenderedBox;
}

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
