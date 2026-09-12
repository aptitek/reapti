import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { EmailField } from '../../src/components/molecules/EmailField/EmailField.tsx';

describe('EmailField Molecule - Rendering and Domain Display', () => {
  it('exports EmailField properly', () => {
    expect(EmailField).toBeDefined();
    expect(EmailField.displayName).toBe('EmailField');
  });

  it('renders with M3e form field, input, and default domain', () => {
    const html = renderToStaticMarkup(
      createElement(EmailField, {
        defaultValue: 'john.doe',
        label: 'Work Email',
        dataTestId: 'test-email',
      })
    );

    expect(html).toContain('email-field_root');
    expect(html).toContain('override-email-field');
    expect(html).toContain('m3e-form-field');
    expect(html).toContain('Work Email');
    expect(html).toContain('value="john.doe"');
    expect(html).toContain('example.com');
    expect(html).toContain('data-testid="test-email-input"');
    expect(html).toContain('data-testid="test-email-suffix"');
  });

  it('renders with custom domain and custom placeholder', () => {
    const html = renderToStaticMarkup(
      createElement(EmailField, {
        domain: 'aptitek.io',
        placeholder: 'username.handle',
      })
    );

    expect(html).toContain('aptitek.io');
    expect(html).toContain('placeholder="username.handle"');
  });
});

describe('EmailField Molecule - Adornments and Actions', () => {
  it('renders clear button when valued and clearable', () => {
    const html = renderToStaticMarkup(
      createElement(EmailField, {
        defaultValue: 'alex.morgan',
        showClearButton: true,
        showDomainLock: false,
        testId: 'clear-test',
      })
    );

    expect(html).toContain('data-testid="clear-test-clear"');
  });

  it('renders institutional lock icon when showDomainLock is enabled', () => {
    const html = renderToStaticMarkup(
      createElement(EmailField, {
        showDomainLock: true,
        showClearButton: false,
        testId: 'lock-test',
      })
    );

    expect(html).toContain('data-testid="lock-test-lock"');
  });

  it('handles custom leading icon and suppresses icon when null', () => {
    const customHtml = renderToStaticMarkup(
      createElement(EmailField, {
        leadingIcon: createElement(Box, { 'data-testid': 'custom-mail-icon' }),
      })
    );
    expect(customHtml).toContain('data-testid="custom-mail-icon"');

    const suppressedHtml = renderToStaticMarkup(
      createElement(EmailField, { leadingIcon: null })
    );
    expect(suppressedHtml).not.toContain('email-field_prefix');
  });
});

describe('EmailField Molecule - State and Error Modifiers', () => {
  it('respects disabled, size, variant, and fullWidth flags', () => {
    const html = renderToStaticMarkup(
      createElement(EmailField, {
        disabled: true,
        size: 'small',
        variant: 'filled',
        fullWidth: true,
        dataTestId: 'flags-test',
      })
    );

    expect(html).toContain('data-disabled="true"');
    expect(html).toContain('data-size="small"');
    expect(html).toContain('data-variant="filled"');
    expect(html).toContain('data-full-width="true"');
  });

  it('renders helperText in normal state and errorText in error state', () => {
    const helperHtml = renderToStaticMarkup(
      createElement(EmailField, { helperText: 'Enter university ID' })
    );
    expect(helperHtml).toContain('Enter university ID');
    expect(helperHtml).toContain('email-field_helper');

    const errorHtml = renderToStaticMarkup(
      createElement(EmailField, {
        error: true,
        errorText: 'User account not found',
      })
    );
    expect(errorHtml).toContain('User account not found');
    expect(errorHtml).toContain('data-error="true"');
  });
});
