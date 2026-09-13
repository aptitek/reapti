import { describe, it, expect } from 'vitest';
import {
  holoGradient,
  sheenGradient,
  cardPhysicsTokens,
} from '../../src/tokens/holo.ts';
import { md3Tokens } from '../../src/tokens/md3.ts';

describe('Holo Tokens', () => {
  it('exports valid holoGradient with mouse variable bindings', () => {
    expect(holoGradient).toBeDefined();
    expect(holoGradient).toContain('radial-gradient');
    expect(holoGradient).toContain('var(--mouse-x, 50%)');
    expect(holoGradient).toContain('var(--mouse-y, 50%)');
    expect(holoGradient).toContain('rgba(220, 50, 47, 0)');
    expect(holoGradient).toContain('rgba(211, 54, 130, 0)');
  });

  it('exports valid sheenGradient for lighting overlay', () => {
    expect(sheenGradient).toBeDefined();
    expect(sheenGradient).toContain('radial-gradient');
    expect(sheenGradient).toContain('rgba(253, 246, 227, 0.15)');
    expect(sheenGradient).toContain('transparent');
  });

  it('exports standard card tilt and flip physics parameters', () => {
    expect(cardPhysicsTokens.tilt.stiffness).toBe(300);
    expect(cardPhysicsTokens.tilt.damping).toBe(30);
    expect(cardPhysicsTokens.tilt.mass).toBe(1.0);
    expect(cardPhysicsTokens.tilt.maxAngleDeg).toBe(15);
    expect(cardPhysicsTokens.flip.durationMs).toBe(600);
    expect(cardPhysicsTokens.flip.easing).toBe(
      md3Tokens.easings.emphasized.value
    );
  });
});
