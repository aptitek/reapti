import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';
import { resolveA11yString, A11Y_STRINGS } from '../../src/i18n/strings.ts';
import type { Locale } from '../../src/i18n/locales.ts';
import { SUPPORTED_LOCALES } from '../../src/i18n/locales.ts';
import { a11yConfig } from '../../scripts/eslint/a11y-config.js';
import { restrictedSyntaxRules } from '../../scripts/eslint/restricted-rules.js';

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [
    a11yConfig,
    {
      files: ['**/*.tsx'],
      languageOptions: {
        parser: (await import('typescript-eslint')).parser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      rules: {
        'no-restricted-syntax': ['error', ...restrictedSyntaxRules],
      },
    },
  ],
});

async function lintSnippet(code: string): Promise<string[]> {
  const results = await eslint.lintText(code, {
    filePath: 'src/TestSnippet.tsx',
  });
  return results[0]?.messages.map((m) => `${m.ruleId}: ${m.message}`) ?? [];
}

describe('ARIA Specifications Enforcement', () => {
  it('rejects invalid ARIA attribute names', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <Box aria-fakeprop="true">Content</Box>; }'
    );
    expect(errors.some((e) => e.includes('jsx-a11y/aria-props'))).toBe(true);
  });

  it('rejects invalid ARIA attribute value types', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <Box aria-hidden="not-a-boolean">Content</Box>; }'
    );
    expect(errors.some((e) => e.includes('jsx-a11y/aria-proptypes'))).toBe(
      true
    );
  });

  it('rejects invalid or abstract ARIA roles', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <Box role="fake-role">Content</Box>; }'
    );
    expect(errors.some((e) => e.includes('jsx-a11y/aria-role'))).toBe(true);
  });

  it('enforces required ARIA props for roles (role="checkbox" requires aria-checked)', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <Box role="checkbox">Option</Box>; }'
    );
    expect(
      errors.some((e) => e.includes('jsx-a11y/role-has-required-aria-props'))
    ).toBe(true);
  });

  it('rejects unsupported ARIA attributes on defined roles', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <Box role="presentation" aria-checked="true">Item</Box>; }'
    );
    expect(
      errors.some((e) => e.includes('jsx-a11y/role-supports-aria-props'))
    ).toBe(true);
  });

  it('enforces associated label or aria-label on interactive controls (M3eButton)', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <M3eButton variant="filled" />; }'
    );
    expect(
      errors.some((e) => e.includes('jsx-a11y/control-has-associated-label'))
    ).toBe(true);
  });
});

describe('Alt Text & i18n Accessibility Enforcement', () => {
  it('rejects hardcoded string literals in alt attribute (i18n enforcement)', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <Image src="/logo.png" alt="Company Logo" />; }'
    );
    expect(
      errors.some(
        (e) =>
          e.includes('no-restricted-syntax') &&
          e.includes(
            'all user-facing alt text and accessibility labels must originate from i18n content'
          )
      )
    ).toBe(true);
  });

  it('rejects hardcoded string literals in aria-label attribute (i18n enforcement)', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <M3eButton variant="filled" aria-label="Click me">Submit</M3eButton>; }'
    );
    expect(
      errors.some(
        (e) =>
          e.includes('no-restricted-syntax') &&
          e.includes(
            'all user-facing alt text and accessibility labels must originate from i18n content'
          )
      )
    ).toBe(true);
  });

  it('permits decorative empty alt="" attributes', async () => {
    const errors = await lintSnippet(
      'export function Test() { return <Image src="/bg.png" alt="" />; }'
    );
    const syntaxErrors = errors.filter((e) =>
      e.includes('no-restricted-syntax')
    );
    expect(syntaxErrors).toHaveLength(0);
  });

  it('permits localized expressions in alt and aria-label', async () => {
    const errors = await lintSnippet(
      'export function Test({ label, altText }: { label: string; altText: string }) { return <M3eButton variant="filled" aria-label={label}><Image src="/icon.png" alt={altText} /></M3eButton>; }'
    );
    expect(errors).toHaveLength(0);
  });
});

describe('Localized Accessibility Strings (i18n)', () => {
  it('provides all accessibility keys across all supported locales', () => {
    const requiredKeys = ['appMain', 'ctaAction', 'zoomIn', 'zoomOut'] as const;

    for (const loc of SUPPORTED_LOCALES) {
      for (const key of requiredKeys) {
        const resolved = resolveA11yString(loc, key);
        expect(resolved).toBeTruthy();
        expect(typeof resolved).toBe('string');
        expect(resolved.length).toBeGreaterThan(0);
      }
    }
  });

  it('falls back to default locale for unmapped or unknown locales', () => {
    const fallback = resolveA11yString(
      'unknown' as unknown as Locale,
      'appMain'
    );
    expect(fallback).toBe(A11Y_STRINGS.en.appMain);
  });
});
