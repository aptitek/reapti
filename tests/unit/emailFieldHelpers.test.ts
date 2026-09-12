import { describe, it, expect } from 'vitest';
import {
  DEFAULT_DOMAIN,
  cleanDomainString,
  sanitizeLocalPart,
  parseAutofillInput,
  resolveHelperContent,
  isEmailClearable,
  getFieldMetrics,
  resolveTestId,
  getRootClassName,
  resolveEmailFieldConfig,
} from '../../src/components/molecules/EmailField/emailFieldHelpers.ts';

describe('emailFieldHelpers - Domain and String Sanitization', () => {
  it('returns DEFAULT_DOMAIN when undefined or blank', () => {
    expect(cleanDomainString(undefined)).toBe(DEFAULT_DOMAIN);
    expect(cleanDomainString('')).toBe(DEFAULT_DOMAIN);
    expect(cleanDomainString('   ')).toBe(DEFAULT_DOMAIN);
  });

  it('strips leading @ signs, trims whitespace and converts to lowercase', () => {
    expect(cleanDomainString('@example.com')).toBe('example.com');
    expect(cleanDomainString('@@MY-DOMAIN.ORG  ')).toBe('my-domain.org');
    expect(cleanDomainString('  institution.edu  ')).toBe('institution.edu');
  });

  it('returns clean local part without domain', () => {
    expect(sanitizeLocalPart('john.doe')).toBe('john.doe');
    expect(sanitizeLocalPart('  alice.smith  ')).toBe('alice.smith');
    expect(sanitizeLocalPart('bob.sponge@example.com')).toBe('bob.sponge');
  });
});

describe('emailFieldHelpers - Autofill Input Parsing', () => {
  it('returns cleanLocal with null errorMsg when no @ is present', () => {
    const result = parseAutofillInput('alex.morgan', 'example.com');
    expect(result.cleanLocal).toBe('alex.morgan');
    expect(result.errorMsg).toBeNull();
  });

  it('silently strips domain when entered domain matches normalized domain', () => {
    const result = parseAutofillInput('alex.morgan@example.com', 'example.com');
    expect(result.cleanLocal).toBe('alex.morgan');
    expect(result.errorMsg).toBeNull();
  });

  it('generates adjustment error when entered domain differs from institutional domain', () => {
    const result = parseAutofillInput('alex.morgan@gmail.com', 'example.com');
    expect(result.cleanLocal).toBe('alex.morgan');
    expect(result.errorMsg).toContain('adjusted to institutional domain');
  });

  it('generates warning when @ is entered without domain', () => {
    const result = parseAutofillInput('alex.morgan@', 'example.com');
    expect(result.cleanLocal).toBe('alex.morgan');
    expect(result.errorMsg).toContain("Do not enter '@'");
  });
});

describe('emailFieldHelpers - Helper Content and Clearability', () => {
  it('prioritizes autoFillError over all other texts', () => {
    const content = resolveHelperContent({
      autoFillError: 'Autofill error',
      error: true,
      errorText: 'Standard error',
    });
    expect(content).toBe('Autofill error');
  });

  it('returns errorText when error is true and no autoFillError exists', () => {
    const content = resolveHelperContent({
      error: true,
      errorText: 'Standard error',
      helperText: 'Helper',
    });
    expect(content).toBe('Standard error');
  });

  it('returns supportingText or helperText in resting valid state', () => {
    expect(
      resolveHelperContent({
        supportingText: 'Supporting',
        helperText: 'Helper',
      })
    ).toBe('Supporting');
    expect(resolveHelperContent({})).toBeUndefined();
  });

  it('evaluates clearable conditions accurately', () => {
    expect(
      isEmailClearable({ showClearButton: true, showDomainLock: false }, true)
    ).toBe(true);
    expect(isEmailClearable({ showClearButton: false }, true)).toBe(false);
    expect(isEmailClearable({}, false)).toBe(false);
    expect(isEmailClearable({ disabled: true }, true)).toBe(false);
    expect(isEmailClearable({ showDomainLock: true }, true)).toBe(false);
  });
});

describe('emailFieldHelpers - Metrics, TestId and Config', () => {
  it('returns calibrated metrics for small and medium sizes', () => {
    expect(getFieldMetrics('small').iconSize).toBe(18);
    expect(getFieldMetrics('medium').iconSize).toBe(20);
  });

  it('resolves test ids and root class names', () => {
    expect(resolveTestId({ testId: 'custom-id' })).toBe('custom-id');
    expect(resolveTestId({})).toBe('email-field');
    expect(getRootClassName()).toBe('email-field_root override-email-field');
  });

  it('resolves unified EmailFieldConfig object', () => {
    const cfg = resolveEmailFieldConfig({
      props: { errorText: 'Error', error: true },
      autoId: '123',
      hasValue: true,
      autoFillError: null,
    });
    expect(cfg.inputId).toBe('email-field-123');
    expect(cfg.isError).toBe(true);
    expect(cfg.helperText).toBe('Error');
    expect(cfg.helperSlot).toBe('error');
  });
});
