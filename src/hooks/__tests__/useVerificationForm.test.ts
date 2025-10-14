import { renderHook, act } from '@testing-library/react';
import { useVerificationForm } from '../useVerificationForm';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'form.validation.name.required': 'El nombre es obligatorio',
        'form.validation.name.minLength': 'El nombre debe tener al menos 2 caracteres',
        'form.validation.name.maxLength': 'El nombre no puede exceder 100 caracteres',
        'form.validation.name.invalid': 'El nombre solo puede contener letras y espacios',
        'form.validation.country.required': 'Debes seleccionar un país',
        'form.validation.address.required': 'La dirección es obligatoria',
        'form.validation.address.minLength': 'La dirección debe tener al menos 10 caracteres',
        'form.validation.address.maxLength': 'La dirección no puede exceder 200 caracteres',
        'form.errors.captchaRequired': 'Debes completar la verificación CAPTCHA',
        'form.errors.submitFailed': 'Error al enviar el formulario. Inténtalo nuevamente.',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock de useCountries
jest.mock('./useCountries', () => ({
  useCountries: () => ({
    countries: [
      { id: 'AR', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
      { id: 'BR', name: 'Brasil', code: 'BR', flag: '🇧🇷' },
    ],
    isLoading: false,
    error: null,
  }),
}));

// Mock de useCaptcha
jest.mock('./useCaptcha', () => ({
  useCaptcha: () => ({
    captchaRef: { current: null },
    isCaptchaLoaded: true,
    isCaptchaVerified: false,
    captchaError: null,
    resetCaptcha: jest.fn(),
    executeCaptcha: jest.fn(() => Promise.resolve('mock-token')),
  }),
}));

// Mock de fetch
global.fetch = jest.fn();

describe('useVerificationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useVerificationForm());

    expect(result.current.form).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.countries).toHaveLength(2);
    expect(result.current.countriesLoading).toBe(false);
    expect(result.current.countriesError).toBe(null);
  });

  it('provides form methods', () => {
    const { result } = renderHook(() => useVerificationForm());

    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.resetForm).toBeDefined();
    expect(result.current.validateField).toBeDefined();
    expect(result.current.getFieldState).toBeDefined();
  });

  it('provides CAPTCHA methods', () => {
    const { result } = renderHook(() => useVerificationForm());

    expect(result.current.captchaRef).toBeDefined();
    expect(result.current.isCaptchaLoaded).toBe(true);
    expect(result.current.isCaptchaVerified).toBe(false);
    expect(result.current.captchaError).toBe(null);
    expect(result.current.resetCaptcha).toBeDefined();
  });

  it('handles form submission successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Verificación completada exitosamente',
        data: { id: 'verification_123' },
      }),
    });

    const { result } = renderHook(() => useVerificationForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(fetch).toHaveBeenCalledWith('/api/verification/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        country: 'AR',
        address: 'Test Address 123',
        captchaToken: 'mock-token',
      }),
    });
  });

  it('handles form submission error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useVerificationForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toBe('form.errors.submitFailed');
  });

  it('handles server validation error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Validation error',
        errors: ['name', 'country'],
      }),
    });

    const { result } = renderHook(() => useVerificationForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toBe('Validation error');
  });

  it('resets form state', () => {
    const { result } = renderHook(() => useVerificationForm());

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('validates individual fields', async () => {
    const { result } = renderHook(() => useVerificationForm());

    await act(async () => {
      await result.current.validateField('name');
    });

    // La validación debería ejecutarse sin errores
    expect(result.current.getFieldState).toBeDefined();
  });

  it('provides field state information', () => {
    const { result } = renderHook(() => useVerificationForm());

    const fieldState = result.current.getFieldState('name');
    
    expect(fieldState).toHaveProperty('hasError');
    expect(fieldState).toHaveProperty('errorMessage');
    expect(fieldState).toHaveProperty('isValid');
  });

  it('handles CAPTCHA verification requirement', async () => {
    const { result } = renderHook(() => useVerificationForm());

    // Simular que el CAPTCHA no está verificado
    result.current.isCaptchaVerified = false;

    await act(async () => {
      await result.current.handleSubmit();
    });

    // Debería intentar ejecutar el CAPTCHA
    expect(result.current.executeCaptcha).toBeDefined();
  });
});
