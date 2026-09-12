import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { MouseEvent, FocusEvent, ChangeEvent } from 'react';
import { useEmailField } from '../../src/components/molecules/EmailField/useEmailField.ts';
import type { EmailFieldProps } from '../../src/components/molecules/EmailField/EmailField.types.ts';

describe('useEmailField - Initialization and Controlled State', () => {
  it('initializes with default uncontrolled value and default domain', () => {
    let hookApi: ReturnType<typeof useEmailField> | null = null;
    function Probe() {
      hookApi = useEmailField({ defaultValue: 'alex.morgan' });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.normalizedDomain).toBe('example.com');
    expect(hookApi.currentLocal).toBe('alex.morgan');
    expect(hookApi.fullEmail).toBe('alex.morgan@example.com');
    expect(hookApi.hasValue).toBe(true);
    expect(hookApi.isFocused).toBe(false);
  });

  it('handles controlled value propagation and empty initial values', () => {
    let hookApi: ReturnType<typeof useEmailField> | null = null;
    function Probe(props: EmailFieldProps) {
      hookApi = useEmailField(props);
      return null;
    }

    renderToStaticMarkup(createElement(Probe, {}));
    expect(hookApi?.currentLocal).toBe('');
    expect(hookApi?.fullEmail).toBe('');

    renderToStaticMarkup(
      createElement(Probe, { value: 'first.value', domain: 'aptitek.io' })
    );
    expect(hookApi?.currentLocal).toBe('first.value');
    expect(hookApi?.fullEmail).toBe('first.value@aptitek.io');

    renderToStaticMarkup(
      createElement(Probe, { value: 'second.value', domain: 'aptitek.io' })
    );
    expect(hookApi?.currentLocal).toBe('second.value');
    expect(hookApi?.fullEmail).toBe('second.value@aptitek.io');
  });
});

describe('useEmailField - Change and Autofill Handling', () => {
  it('updates local part and invokes onEmailChange and onChange on input change', () => {
    const onEmailChange = vi.fn();
    const onChange = vi.fn();
    let hookApi: ReturnType<typeof useEmailField> | null = null;

    function Probe() {
      hookApi = useEmailField({
        domain: 'school.edu',
        onEmailChange,
        onChange,
      });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    hookApi.handleInputChange('taylor.swift');
    expect(onEmailChange).toHaveBeenCalledWith(
      'taylor.swift@school.edu',
      'taylor.swift'
    );
    expect(onChange).toHaveBeenCalledWith('taylor.swift@school.edu');

    hookApi.handleInputChange('');
    expect(onEmailChange).toHaveBeenCalledWith('', '');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('handles ChangeEvent object in handleInputChange', () => {
    const onEmailChange = vi.fn();
    let hookApi: ReturnType<typeof useEmailField> | null = null;

    function Probe() {
      hookApi = useEmailField({ onEmailChange });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    const event = {
      target: { value: 'sam.fisher' },
    } as unknown as ChangeEvent<HTMLInputElement>;
    hookApi.handleInputChange(event);
    expect(onEmailChange).toHaveBeenCalledWith(
      'sam.fisher@example.com',
      'sam.fisher'
    );
  });

  it('strips matching domain and triggers callback with composite email', () => {
    const onEmailChange = vi.fn();
    const onChange = vi.fn();
    let hookApi: ReturnType<typeof useEmailField> | null = null;

    function Probe() {
      hookApi = useEmailField({
        domain: 'example.com',
        onEmailChange,
        onChange,
      });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    hookApi.handleInputChange('user@external.com');
    expect(onEmailChange).toHaveBeenCalledWith('user@example.com', 'user');
    expect(onChange).toHaveBeenCalledWith('user@example.com');

    hookApi.handleInputChange('valid@example.com');
    expect(onEmailChange).toHaveBeenCalledWith('valid@example.com', 'valid');
  });
});

describe('useEmailField - Clear Actions', () => {
  it('handles clear action and dispatches empty callbacks', () => {
    const onEmailChange = vi.fn();
    const onChange = vi.fn();
    let hookApi: ReturnType<typeof useEmailField> | null = null;

    function Probe() {
      hookApi = useEmailField({
        defaultValue: 'sam.fisher',
        onEmailChange,
        onChange,
      });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent<HTMLElement>;

    hookApi.handleClear(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(onEmailChange).toHaveBeenCalledWith('', '');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('handles clear and change in controlled mode without callbacks', () => {
    let hookApi: ReturnType<typeof useEmailField> | null = null;
    function Probe() {
      hookApi = useEmailField({ value: 'ctrl.user' });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as MouseEvent<HTMLElement>;

    hookApi.handleClear(mockEvent);
    hookApi.handleInputChange('new.val');
  });
});

describe('useEmailField - Focus and Blur Actions', () => {
  it('provides handlers for focus and blur without erroring when omitted', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    let hookApi: ReturnType<typeof useEmailField> | null = null;

    function Probe() {
      hookApi = useEmailField({ onFocus, onBlur });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    const dummyFocusEvent = {} as FocusEvent<HTMLInputElement>;
    hookApi.handleFocus(dummyFocusEvent);
    expect(onFocus).toHaveBeenCalledWith(dummyFocusEvent);

    hookApi.handleBlur(dummyFocusEvent);
    expect(onBlur).toHaveBeenCalledWith(dummyFocusEvent);

    let noCallbackApi: ReturnType<typeof useEmailField> | null = null;
    function NoCallbackProbe() {
      noCallbackApi = useEmailField({});
      return null;
    }
    renderToStaticMarkup(createElement(NoCallbackProbe));
    noCallbackApi?.handleFocus(dummyFocusEvent);
    noCallbackApi?.handleBlur(dummyFocusEvent);
  });
});
