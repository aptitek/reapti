import { describe, it, expect } from 'vitest';
import { md3Tokens, md3SemanticTokens } from '../../src/tokens/md3.ts';

describe('MD3 Tokens Specification', () => {
  it('defines all required semantic color roles with light/dark conditions', () => {
    const roles = [
      'primary',
      'onPrimary',
      'primaryContainer',
      'onPrimaryContainer',
      'secondary',
      'surface',
      'onSurface',
      'outline',
      'error',
    ] as const;

    for (const role of roles) {
      const token = md3SemanticTokens.colors[role];
      expect(token).toBeDefined();
      expect(token.value._light).toBeDefined();
      expect(token.value._dark).toBeDefined();
      expect(typeof token.value._light).toBe('string');
      expect(typeof token.value._dark).toBe('string');
    }
  });

  it('defines 6 elevation levels from 0 to 5', () => {
    for (let level = 0; level <= 5; level++) {
      const key = `elevation${level}` as keyof typeof md3SemanticTokens.shadows;
      const elevation = md3SemanticTokens.shadows[key];
      expect(elevation).toBeDefined();
      expect(typeof elevation.value).toBe('string');
    }
  });

  it('defines 8dp baseline spacing lattice and shape scales', () => {
    expect(md3Tokens.spacing['1'].value).toBe('4px');
    expect(md3Tokens.spacing['2'].value).toBe('8px');
    expect(md3Tokens.radii.full.value).toBe('9999px');
    expect(md3Tokens.borderWidths.thick.value).toBe('3px');
    expect(md3Tokens.borderWidths.medium.value).toBe('2px');
    expect(md3Tokens.durations.short1.value).toBe('50ms');
    expect(md3Tokens.easings.standard.value).toBeDefined();
  });
});
