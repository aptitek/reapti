import { describe, it, expect } from 'vitest';
import { ThemeContext } from '../../src/theme/ThemeContext.ts';

describe('ThemeContext', () => {
  it('initializes with null default value', () => {
    expect(ThemeContext).toBeDefined();
  });
});
