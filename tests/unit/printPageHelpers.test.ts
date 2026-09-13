import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createElement, Fragment } from 'react';
import {
  isPlaywrightEnvironment,
  clampPage,
  formatPageIndicator,
  extractPagesFromChildren,
} from '../../src/components/organisms/PrintPage/printPageHelpers.ts';

describe('printPageHelpers - isPlaywrightEnvironment', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(isPlaywrightEnvironment()).toBe(false);
  });

  it('returns false in normal window environment without print flags', () => {
    vi.stubGlobal('window', { location: { search: '' } });
    vi.stubGlobal('document', {
      documentElement: {
        getAttribute: () => null,
      },
    });
    expect(isPlaywrightEnvironment()).toBe(false);
  });

  it('returns true when print=true query param is present', () => {
    vi.stubGlobal('window', { location: { search: '?print=true' } });
    expect(isPlaywrightEnvironment()).toBe(true);
  });

  it('returns true when pdf=true or exportPdf=true is present', () => {
    vi.stubGlobal('window', { location: { search: '?mode=dark&pdf=true' } });
    expect(isPlaywrightEnvironment()).toBe(true);

    vi.stubGlobal('window', { location: { search: '?exportPdf=true' } });
    expect(isPlaywrightEnvironment()).toBe(true);
  });

  it('returns true when __PLAYWRIGHT_PDF__ flag is set on window', () => {
    vi.stubGlobal('window', {
      location: { search: '' },
      __PLAYWRIGHT_PDF__: true,
    });
    expect(isPlaywrightEnvironment()).toBe(true);
  });

  it('returns true when documentElement has data-playwright-pdf attribute', () => {
    vi.stubGlobal('window', { location: { search: '' } });
    vi.stubGlobal('document', {
      documentElement: {
        getAttribute: (attr: string) =>
          attr === 'data-playwright-pdf' ? 'true' : null,
      },
    });
    expect(isPlaywrightEnvironment()).toBe(true);
  });
});

describe('printPageHelpers - clampPage and formatPageIndicator', () => {
  it('clamps pages between 1 and totalPages', () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(-10, 5)).toBe(1);
    expect(clampPage(3, 5)).toBe(3);
    expect(clampPage(5, 5)).toBe(5);
    expect(clampPage(10, 5)).toBe(5);
  });

  it('handles non-integer and boundary inputs safely', () => {
    expect(clampPage(2.8, 5)).toBe(2);
    expect(clampPage(1, 0)).toBe(1);
    expect(clampPage(1, -5)).toBe(1);
  });

  it('formats 1-based page indicator strings correctly', () => {
    expect(formatPageIndicator(1, 4)).toBe('1 / 4');
    expect(formatPageIndicator(3, 10)).toBe('3 / 10');
    expect(formatPageIndicator(10, 5)).toBe('5 / 5');
  });
});

describe('printPageHelpers - extractPagesFromChildren', () => {
  it('returns empty array for null or undefined children', () => {
    expect(extractPagesFromChildren(null)).toEqual([]);
    expect(extractPagesFromChildren(undefined)).toEqual([]);
  });

  it('extracts flat elements', () => {
    const el1 = createElement('span', { key: '1' }, 'Page 1');
    const el2 = createElement('span', { key: '2' }, 'Page 2');
    const result = extractPagesFromChildren([el1, el2]);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(el1);
    expect(result[1]).toBe(el2);
  });

  it('unwraps nested React fragments', () => {
    const el1 = createElement('span', { key: '1' }, 'Page 1');
    const el2 = createElement('span', { key: '2' }, 'Page 2');
    const frag = createElement(Fragment, null, el1, el2);
    const result = extractPagesFromChildren(frag);
    expect(result).toHaveLength(2);
  });

  it('handles primitive values and ignores booleans/nulls', () => {
    const result = extractPagesFromChildren(['Text 1', false, null, 'Text 2']);
    expect(result).toEqual(['Text 1', 'Text 2']);
  });
});
