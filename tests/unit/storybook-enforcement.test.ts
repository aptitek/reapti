import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import {
  isComponentFile,
  isIgnored,
  validateStoryFile,
  validateStorybookCoverage,
} from '../../scripts/lint-storybook-coverage.mjs';

describe('Storybook Coverage Enforcement', () => {
  it('validates that 100% of repository components have valid Storybook stories', () => {
    const { errors, verified, componentFiles } = validateStorybookCoverage();
    expect(errors).toHaveLength(0);
    expect(componentFiles.length).toBeGreaterThanOrEqual(2);
    expect(verified.length).toBe(componentFiles.length);

    const componentNames = verified.map((v) => v.component);
    expect(componentNames).toContain('src/App.tsx');
    expect(componentNames).toContain('src/i18n/ContentProvider.tsx');
  });

  it('correctly identifies React component files vs non-component files', () => {
    expect(isComponentFile(resolve('src/App.tsx'))).toBe(true);
    expect(isComponentFile(resolve('src/i18n/ContentProvider.tsx'))).toBe(true);
    expect(isComponentFile(resolve('src/i18n/context.tsx'))).toBe(false);
    expect(isComponentFile(resolve('src/main.tsx'))).toBe(false);
  });

  it('filters out ignored paths like main, stories, tests, and d.ts', () => {
    expect(isIgnored('src/main.tsx')).toBe(true);
    expect(isIgnored('src/App.stories.tsx')).toBe(true);
    expect(isIgnored('src/App.test.tsx')).toBe(true);
    expect(isIgnored('src/types/mdx.d.ts')).toBe(true);
    expect(isIgnored('src/App.tsx')).toBe(false);
    expect(isIgnored('src/i18n/ContentProvider.tsx')).toBe(false);
  });

  it('validates CSF3 structure on real stories', () => {
    const appStory = validateStoryFile(resolve('src/App.stories.tsx'));
    expect(appStory.valid).toBe(true);
    expect(appStory.namedStories).toContain('Default');

    const providerStory = validateStoryFile(
      resolve('src/i18n/ContentProvider.stories.tsx')
    );
    expect(providerStory.valid).toBe(true);
    expect(providerStory.namedStories).toContain('English');
    expect(providerStory.namedStories).toContain('French');
  });

  it('detects failure when story file does not exist', () => {
    const result = validateStoryFile(resolve('src/NonExistent.stories.tsx'));
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/does not exist/);
  });
});
