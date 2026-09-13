import { describe, it, expect } from 'vitest';
import {
  resolveSide,
  resolveMode,
  resolveAppBarClassName,
  resolveAriaProps,
  resolveScrollTop,
} from '../../src/components/molecules/VerticalAppBar/verticalAppBarHelpers.ts';

describe('verticalAppBarHelpers: Geometry and State', () => {
  it('resolves side correctly with left default', () => {
    expect(resolveSide('left')).toBe('left');
    expect(resolveSide('right')).toBe('right');
    expect(resolveSide(undefined)).toBe('left');
  });

  it('resolves mode correctly with compact default', () => {
    expect(resolveMode('compact')).toBe('compact');
    expect(resolveMode('expanded')).toBe('expanded');
    expect(resolveMode(undefined)).toBe('compact');
  });

  it('resolves class names with side, elevation, mode, and custom class', () => {
    expect(resolveAppBarClassName()).toBe(
      'vertical-app-bar_root vertical-app-bar_left vertical-app-bar_compact'
    );
    expect(
      resolveAppBarClassName('custom-class', 'right', {
        mode: 'compact',
        elevated: false,
      })
    ).toBe(
      'vertical-app-bar_root vertical-app-bar_right vertical-app-bar_compact custom-class'
    );
    expect(
      resolveAppBarClassName(undefined, 'left', {
        elevated: true,
        mode: 'expanded',
      })
    ).toBe(
      'vertical-app-bar_root vertical-app-bar_left vertical-app-bar_expanded vertical-app-bar_elevated'
    );
    expect(
      resolveAppBarClassName('custom', 'right', {
        elevated: true,
        mode: 'expanded',
      })
    ).toBe(
      'vertical-app-bar_root vertical-app-bar_right vertical-app-bar_expanded vertical-app-bar_elevated custom'
    );
  });
});

describe('verticalAppBarHelpers: Accessibility', () => {
  it('resolves aria props with role banner and accessible label', () => {
    const props = resolveAriaProps('Main Navigation');
    expect(props['aria-label']).toBe('Main Navigation');
    expect(props.role).toBe('banner');

    const defaultProps = resolveAriaProps();
    expect(defaultProps['aria-label']).toBe('Application bar');
    expect(defaultProps.role).toBe('banner');
  });
});

describe('verticalAppBarHelpers: Scroll Resolution', () => {
  it('handles window undefined safely', () => {
    const origWindow = (globalThis as unknown as { window?: unknown }).window;
    (globalThis as unknown as { window?: unknown }).window = undefined;
    expect(resolveScrollTop()).toBe(0);
    (globalThis as unknown as { window?: unknown }).window = origWindow;
  });

  it('reads window.scrollY or documentElement.scrollTop', () => {
    const origWindow = (globalThis as unknown as { window?: unknown }).window;
    const origDocument = (globalThis as unknown as { document?: unknown })
      .document;

    (globalThis as unknown as { window?: unknown }).window = { scrollY: 150 };
    expect(resolveScrollTop()).toBe(150);

    (globalThis as unknown as { window?: unknown }).window = { scrollY: 0 };
    (globalThis as unknown as { document?: unknown }).document = {
      documentElement: { scrollTop: 80 },
    };
    expect(resolveScrollTop()).toBe(80);

    (globalThis as unknown as { document?: unknown }).document = {
      documentElement: { scrollTop: 0 },
    };
    expect(resolveScrollTop()).toBe(0);

    (globalThis as unknown as { window?: unknown }).window = origWindow;
    (globalThis as unknown as { document?: unknown }).document = origDocument;
  });
});
