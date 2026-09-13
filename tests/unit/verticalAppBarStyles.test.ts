import { describe, it, expect } from 'vitest';
import { verticalAppBarStyles } from '../../src/components/molecules/VerticalAppBar/verticalAppBarStyles.ts';

describe('verticalAppBarStyles', () => {
  it('exports valid CSSResult with host and layout geometry', () => {
    expect(verticalAppBarStyles).toBeDefined();
    const cssText = verticalAppBarStyles.cssText;
    expect(cssText).toContain(':host');
    expect(cssText).toContain('position: sticky');
    expect(cssText).toContain('inset-block-start: 0');
    expect(cssText).toContain('.base');
    expect(cssText).toContain('.top-section');
    expect(cssText).toContain('.middle-section');
    expect(cssText).toContain('.bottom-section');
  });

  it('includes responsive mobile layout styles', () => {
    const cssText = verticalAppBarStyles.cssText;
    expect(cssText).toContain('@media (max-width: 768px)');
    expect(cssText).toContain('flex-direction: row');
    expect(cssText).toContain('block-size: 64px');
  });
});
