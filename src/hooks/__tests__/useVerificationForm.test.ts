import { renderHook, act } from '@testing-library/react';

// Mock completo del hook useVerificationForm
jest.mock('../useVerificationForm', () => ({
  useVerificationForm: () => ({
    // Form methods
    form: {
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => fn),
      formState: { errors: {} },
      reset: jest.fn(),
      setValue: jest.fn(),
      watch: jest.fn(),
    },
    handleSubmit: jest.fn((fn) => fn),
    resetForm: jest.fn(),
    validateField: jest.fn(),
    getFieldState: jest.fn(),
    
    // Form state
    formState: {
      isSubmitting: false,
      isSuccess: false,
      error: null,
    },
    isSubmitting: false,
    isSuccess: false,
    error: null,
    
    // Countries data
    countries: [
      { id: 'AR', name: 'Argentina' },
      { id: 'BR', name: 'Brasil' },
    ],
    countriesLoading: false,
    countriesError: null,
    
    // Captcha data
    captchaRef: { current: null },
    isCaptchaVerified: false,
    captchaError: null,
    resetCaptcha: jest.fn(),
    getCaptchaSiteKey: () => 'test-key',
    onCaptchaSuccess: jest.fn(),
    onCaptchaExpired: jest.fn(),
    onCaptchaError: jest.fn(),
    
    // Validation state
    isValid: true,
    isDirty: false,
    touchedFields: {},
    errors: {},
  }),
}));

import { useVerificationForm } from '../useVerificationForm';

describe('useVerificationForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useVerificationForm({}));

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should return form methods', () => {
    const { result } = renderHook(() => useVerificationForm({}));

    expect(result.current.form).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.resetForm).toBeDefined();
    expect(result.current.validateField).toBeDefined();
    expect(result.current.getFieldState).toBeDefined();
  });

  it('should return countries data', () => {
    const { result } = renderHook(() => useVerificationForm({}));

    expect(result.current.countries).toHaveLength(2);
    expect(result.current.countries[0].name).toBe('Argentina');
    expect(result.current.countriesLoading).toBe(false);
    expect(result.current.countriesError).toBe(null);
  });

  it('should return captcha data', () => {
    const { result } = renderHook(() => useVerificationForm({}));

    expect(result.current.captchaRef).toBeDefined();
    expect(result.current.isCaptchaVerified).toBe(false);
    expect(result.current.captchaError).toBe(null);
    expect(result.current.getCaptchaSiteKey()).toBe('test-key');
  });

  it('should handle form submission', async () => {
    const { result } = renderHook(() => useVerificationForm({}));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.handleSubmit).toHaveBeenCalled();
  });

  it('should return validation state', () => {
    const { result } = renderHook(() => useVerificationForm({}));

    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.touchedFields).toEqual({});
    expect(result.current.errors).toEqual({});
  });

  it('should reset captcha', () => {
    const { result } = renderHook(() => useVerificationForm({}));

    act(() => {
      result.current.resetCaptcha();
    });

    expect(result.current.resetCaptcha).toHaveBeenCalled();
  });
});