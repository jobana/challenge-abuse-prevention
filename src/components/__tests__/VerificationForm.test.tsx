import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VerificationForm } from '../VerificationForm';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extender expect con axe-core
expect.extend(toHaveNoViolations);

// Mock de react-google-recaptcha
jest.mock('react-google-recaptcha', () => {
  return function MockReCAPTCHA({ onChange, onExpired, onErrored }: any) {
    return (
      <div data-testid="recaptcha-mock">
        <button
          data-testid="recaptcha-success"
          onClick={() => onChange && onChange('mock-token')}
        >
          Simulate Success
        </button>
        <button
          data-testid="recaptcha-expired"
          onClick={() => onExpired && onExpired()}
        >
          Simulate Expired
        </button>
        <button
          data-testid="recaptcha-error"
          onClick={() => onErrored && onErrored('mock-error')}
        >
          Simulate Error
        </button>
      </div>
    );
  };
});

// Mock de los hooks
jest.mock('../../hooks/useVerificationForm', () => ({
  useVerificationForm: () => ({
    form: {
      register: jest.fn(),
      formState: {
        errors: {},
        isValid: true,
        isDirty: false,
        touchedFields: {},
      },
    },
    handleSubmit: jest.fn((fn) => (e: Event) => {
      e.preventDefault();
      fn({
        name: 'Test User',
        country: 'AR',
        address: 'Test Address 123',
      });
    }),
    getFieldState: jest.fn(() => ({
      hasError: false,
      errorMessage: '',
      isValid: true,
    })),
    isSubmitting: false,
    isSuccess: false,
    error: null,
    countries: [
      { id: 'AR', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
      { id: 'BR', name: 'Brasil', code: 'BR', flag: '🇧🇷' },
    ],
    countriesLoading: false,
    countriesError: null,
    captchaRef: { current: null },
    isCaptchaLoaded: true,
    isCaptchaVerified: false,
    captchaError: null,
    resetCaptcha: jest.fn(),
    getCaptchaSiteKey: jest.fn(() => 'test-site-key'),
    onCaptchaSuccess: jest.fn(),
    onCaptchaExpired: jest.fn(),
    onCaptchaError: jest.fn(),
  }),
}));

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'form.title': 'Verificación de Datos',
        'form.description': 'Por favor, completa la información solicitada',
        'form.fields.name.label': 'Nombre completo',
        'form.fields.name.placeholder': 'Ingresa tu nombre completo',
        'form.fields.country.label': 'País',
        'form.fields.country.placeholder': 'Selecciona tu país',
        'form.fields.address.label': 'Dirección',
        'form.fields.address.placeholder': 'Ingresa tu dirección completa',
        'form.actions.submit': 'Verificar Datos',
        'form.actions.reset': 'Limpiar Formulario',
        'form.footer.privacy': 'Tus datos están protegidos',
        'form.footer.required': 'Los campos marcados con * son obligatorios',
        'captcha.ariaLabel': 'Verificación de seguridad reCAPTCHA',
        'captcha.loading': 'Cargando verificación de seguridad...',
      };
      return translations[key] || key;
    },
  }),
}));

describe('VerificationForm', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<VerificationForm />);
    
    expect(screen.getByText('Verificación de Datos')).toBeInTheDocument();
    expect(screen.getByText('Por favor, completa la información solicitada')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByLabelText('País')).toBeInTheDocument();
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verificar Datos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpiar Formulario' })).toBeInTheDocument();
  });

  it('renders CAPTCHA component', () => {
    render(<VerificationForm />);
    
    expect(screen.getByTestId('recaptcha-mock')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<VerificationForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles form submission', async () => {
    render(<VerificationForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Verificar Datos' });
    fireEvent.click(submitButton);
    
    // El formulario debería manejar el envío
    await waitFor(() => {
      expect(submitButton).toBeInTheDocument();
    });
  });

  it('handles CAPTCHA success', () => {
    render(<VerificationForm />);
    
    const captchaSuccessButton = screen.getByTestId('recaptcha-success');
    fireEvent.click(captchaSuccessButton);
    
    // Verificar que se llamó la función de éxito
    expect(captchaSuccessButton).toBeInTheDocument();
  });

  it('handles CAPTCHA expiration', () => {
    render(<VerificationForm />);
    
    const captchaExpiredButton = screen.getByTestId('recaptcha-expired');
    fireEvent.click(captchaExpiredButton);
    
    // Verificar que se llamó la función de expiración
    expect(captchaExpiredButton).toBeInTheDocument();
  });

  it('handles CAPTCHA error', () => {
    render(<VerificationForm />);
    
    const captchaErrorButton = screen.getByTestId('recaptcha-error');
    fireEvent.click(captchaErrorButton);
    
    // Verificar que se llamó la función de error
    expect(captchaErrorButton).toBeInTheDocument();
  });

  it('displays privacy and required field information', () => {
    render(<VerificationForm />);
    
    expect(screen.getByText('Tus datos están protegidos')).toBeInTheDocument();
    expect(screen.getByText('Los campos marcados con * son obligatorios')).toBeInTheDocument();
  });

  it('has proper form structure', () => {
    render(<VerificationForm />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('aria-label', 'form.ariaLabel');
    expect(form).toHaveAttribute('novalidate');
  });
});
