import { describe, it, expect } from 'vitest';
import type {
  EmailFieldVariant,
  EmailFieldSize,
  EmailFieldProps,
  EmailFieldLabels,
  EmailFieldMetrics,
} from '../../src/components/molecules/EmailField/EmailField.types.ts';

describe('EmailField Type Contract Verification', () => {
  it('supports all valid EmailFieldVariants', () => {
    const variants: EmailFieldVariant[] = ['outlined', 'filled'];
    expect(variants).toHaveLength(2);
  });

  it('supports all valid EmailFieldSizes', () => {
    const sizes: EmailFieldSize[] = ['small', 'medium'];
    expect(sizes).toHaveLength(2);
  });

  it('constructs a valid EmailFieldProps object with standard properties', () => {
    const props: EmailFieldProps = {
      id: 'test-email',
      value: 'john.doe',
      defaultValue: 'jane.doe',
      domain: 'example.com',
      onEmailChange: (full, local) => {
        expect(full).toBeDefined();
        expect(local).toBeDefined();
      },
      onChange: (full) => {
        expect(full).toBeDefined();
      },
      label: 'Email Address',
      placeholder: 'username',
      helperText: 'Enter student handle',
      error: false,
      errorText: 'Invalid email',
      disabled: false,
      readOnly: false,
      variant: 'outlined',
      size: 'medium',
      fullWidth: true,
      showClearButton: true,
      showDomainLock: true,
      clearAriaLabel: 'Clear',
      domainAriaLabel: 'Domain',
      testId: 'custom-email-field',
    };

    expect(props.domain).toBe('example.com');
    expect(props.variant).toBe('outlined');
    expect(props.size).toBe('medium');
    expect(props.fullWidth).toBe(true);
  });

  it('constructs valid EmailFieldLabels and EmailFieldMetrics objects', () => {
    const labels: EmailFieldLabels = {
      clearPrefix: 'Clear',
      fixedDomain: 'Fixed domain',
      usernamePlaceholder: 'username',
    };
    const metrics: EmailFieldMetrics = {
      iconSize: 20,
      clearBtnSize: 18,
      lockIconSize: 18,
    };

    expect(labels.usernamePlaceholder).toBe('username');
    expect(metrics.iconSize).toBe(20);
  });
});
