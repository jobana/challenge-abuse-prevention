import { renderHook, act } from '@testing-library/react';
import { useCaptcha } from '../useCaptcha';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'captcha.language': 'es',
        'captcha.errors.loadFailed': 'Error al cargar la verificación de seguridad',
        'captcha.errors.verificationFailed': 'Error en la verificación de seguridad',
        'captcha.errors.notLoaded': 'La verificación de seguridad no está disponible',
        'captcha.errors.noToken': 'No se pudo obtener el token de verificación',
        'captcha.errors.executionFailed': 'Error al ejecutar la verificación de seguridad',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock de document.createElement
const mockScript = {
  src: '',
  async: false,
  defer: false,
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
};

const mockCreateElement = jest.fn(() => mockScript);
const mockAppendChild = jest.fn();

// Mock de window.grecaptcha
const mockGrecaptcha = {
  ready: jest.fn((callback: () => void) => callback()),
  execute: jest.fn(() => Promise.resolve('mock-token')),
  render: jest.fn(() => 1),
  reset: jest.fn(),
  getResponse: jest.fn(() => 'mock-response'),
};

describe('useCaptcha', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock document methods
    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
      writable: true,
    });
    
    Object.defineProperty(document.head, 'appendChild', {
      value: mockAppendChild,
      writable: true,
    });
    
    // Mock window.grecaptcha
    Object.defineProperty(window, 'grecaptcha', {
      value: mockGrecaptcha,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up
    delete (window as any).grecaptcha;
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useCaptcha());

    expect(result.current.isCaptchaLoaded).toBe(false);
    expect(result.current.isCaptchaVerified).toBe(false);
    expect(result.current.captchaError).toBe(null);
    expect(result.current.captchaToken).toBe(null);
    expect(result.current.isCaptchaReady).toBe(false);
  });

  it('loads CAPTCHA script when grecaptcha is not available', () => {
    delete (window as any).grecaptcha;
    
    renderHook(() => useCaptcha());

    expect(mockCreateElement).toHaveBeenCalledWith('script');
    expect(mockAppendChild).toHaveBeenCalledWith(mockScript);
    expect(mockScript.src).toBe('https://www.google.com/recaptcha/api.js?render=explicit&hl=es');
    expect(mockScript.async).toBe(true);
    expect(mockScript.defer).toBe(true);
  });

  it('sets loaded state when grecaptcha is already available', () => {
    const { result } = renderHook(() => useCaptcha());

    expect(result.current.isCaptchaLoaded).toBe(true);
    expect(result.current.isCaptchaReady).toBe(true);
  });

  it('handles script load success', () => {
    delete (window as any).grecaptcha;
    
    const { result } = renderHook(() => useCaptcha());

    // Simular carga exitosa del script
    act(() => {
      if (mockScript.onload) {
        mockScript.onload();
      }
    });

    expect(result.current.isCaptchaLoaded).toBe(true);
    expect(result.current.isCaptchaReady).toBe(true);
  });

  it('handles script load error', () => {
    delete (window as any).grecaptcha;
    
    const { result } = renderHook(() => useCaptcha());

    // Simular error en la carga del script
    act(() => {
      if (mockScript.onerror) {
        mockScript.onerror();
      }
    });

    expect(result.current.captchaError).toBe('captcha.errors.loadFailed');
  });

  it('handles CAPTCHA success', () => {
    const { result } = renderHook(() => useCaptcha());

    act(() => {
      result.current.onCaptchaSuccess('test-token');
    });

    expect(result.current.isCaptchaVerified).toBe(true);
    expect(result.current.captchaToken).toBe('test-token');
    expect(result.current.captchaError).toBe(null);
  });

  it('handles CAPTCHA expiration', () => {
    const { result } = renderHook(() => useCaptcha());

    // Primero establecer un estado verificado
    act(() => {
      result.current.onCaptchaSuccess('test-token');
    });

    expect(result.current.isCaptchaVerified).toBe(true);

    // Luego simular expiración
    act(() => {
      result.current.onCaptchaExpired();
    });

    expect(result.current.isCaptchaVerified).toBe(false);
    expect(result.current.captchaToken).toBe(null);
  });

  it('handles CAPTCHA error', () => {
    const { result } = renderHook(() => useCaptcha());

    act(() => {
      result.current.onCaptchaError('test-error');
    });

    expect(result.current.isCaptchaVerified).toBe(false);
    expect(result.current.captchaToken).toBe(null);
    expect(result.current.captchaError).toBe('test-error');
  });

  it('executes CAPTCHA successfully', async () => {
    const { result } = renderHook(() => useCaptcha());

    // Simular que el CAPTCHA está cargado
    act(() => {
      result.current.onCaptchaSuccess('initial-token');
    });

    const token = await act(async () => {
      return await result.current.executeCaptcha();
    });

    expect(token).toBe('mock-token');
    expect(result.current.isCaptchaVerified).toBe(true);
    expect(result.current.captchaToken).toBe('mock-token');
  });

  it('handles CAPTCHA execution error when not loaded', async () => {
    delete (window as any).grecaptcha;
    
    const { result } = renderHook(() => useCaptcha());

    await act(async () => {
      try {
        await result.current.executeCaptcha();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('captcha.errors.notLoaded');
      }
    });
  });

  it('resets CAPTCHA state', () => {
    const { result } = renderHook(() => useCaptcha());

    // Establecer un estado verificado
    act(() => {
      result.current.onCaptchaSuccess('test-token');
    });

    expect(result.current.isCaptchaVerified).toBe(true);
    expect(result.current.captchaToken).toBe('test-token');

    // Resetear
    act(() => {
      result.current.resetCaptcha();
    });

    expect(result.current.isCaptchaVerified).toBe(false);
    expect(result.current.captchaToken).toBe(null);
    expect(result.current.captchaError).toBe(null);
  });

  it('provides correct site key', () => {
    const { result } = renderHook(() => useCaptcha());

    const siteKey = result.current.getCaptchaSiteKey();
    
    // Debería usar la clave de prueba si no hay variable de entorno
    expect(siteKey).toBe('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
  });

  it('handles environment variable for site key', () => {
    // Mock de import.meta.env
    const originalEnv = import.meta.env;
    (import.meta as any).env = {
      ...originalEnv,
      VITE_RECAPTCHA_SITE_KEY: 'custom-site-key',
    };

    const { result } = renderHook(() => useCaptcha());

    const siteKey = result.current.getCaptchaSiteKey();
    expect(siteKey).toBe('custom-site-key');

    // Restaurar
    (import.meta as any).env = originalEnv;
  });
});
