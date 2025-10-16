import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorFallback } from '../ErrorFallback';

// Mock del hook useI18n
jest.mock('@hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'errors.generic': 'Error genérico',
        'errors.server': 'Error del servidor',
        'common.retry': 'Reintentar',
        'common.back': 'Volver',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock de window.location y window.history
const mockReload = jest.fn();
const mockBack = jest.fn();
const mockAssign = jest.fn();

Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
    href: '',
    assign: mockAssign,
  },
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: {
    back: mockBack,
    length: 2,
  },
  writable: true,
});

Object.defineProperty(document, 'referrer', {
  value: 'https://example.com/previous',
  writable: true,
});


describe('ErrorFallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment
    process.env.NODE_ENV = 'production';
  });

  it('renders with default props', () => {
    render(<ErrorFallback />);
    
    expect(screen.getByText('Error genérico')).toBeInTheDocument();
    expect(screen.getByText('Error del servidor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });

  it('renders with error object', () => {
    const error = new Error('Test error message');
    render(<ErrorFallback error={error} />);
    
    expect(screen.getByText('Error genérico')).toBeInTheDocument();
    expect(screen.getByText('Error del servidor')).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error message');
    error.stack = 'Error stack trace';
    
    render(<ErrorFallback error={error} />);
    
    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
    // El mensaje de error aparece en el elemento <pre>
    const errorElement = document.querySelector('.error-fallback__error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('Test error message');
  });

  it('does not show error details in production mode', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Test error message');
    
    render(<ErrorFallback error={error} />);
    
    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();
  });

  it('calls resetError when retry button is clicked and resetError is provided', () => {
    const resetError = jest.fn();
    render(<ErrorFallback resetError={resetError} />);
    
    const retryButton = screen.getByRole('button', { name: 'Reintentar' });
    fireEvent.click(retryButton);
    
    expect(resetError).toHaveBeenCalledTimes(1);
  });

  it('reloads page when retry button is clicked and no resetError is provided', () => {
    render(<ErrorFallback />);
    
    const retryButton = screen.getByRole('button', { name: 'Reintentar' });
    fireEvent.click(retryButton);
    
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('calls history.back when back button is clicked and history exists', () => {
    Object.defineProperty(window, 'history', {
      value: { back: mockBack, length: 2 },
      writable: true,
    });
    
    render(<ErrorFallback />);
    
    const backButton = screen.getByRole('button', { name: 'Volver' });
    fireEvent.click(backButton);
    
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('renders with proper CSS classes', () => {
    render(<ErrorFallback />);
    
    const container = screen.getByText('Error genérico').closest('.error-fallback');
    expect(container).toBeInTheDocument();
    
    expect(screen.getByText('Error genérico').closest('.error-fallback__title')).toBeInTheDocument();
    expect(screen.getByText('Error del servidor').closest('.error-fallback__message')).toBeInTheDocument();
  });

  it('renders help text', () => {
    render(<ErrorFallback />);
    
    expect(screen.getByText('Si el problema persiste, por favor contacta a soporte técnico.')).toBeInTheDocument();
  });

  it('renders warning icon', () => {
    render(<ErrorFallback />);
    
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });


  it('renders buttons with correct variants', () => {
    render(<ErrorFallback />);
    
    const retryButton = screen.getByRole('button', { name: 'Reintentar' });
    const backButton = screen.getByRole('button', { name: 'Volver' });
    
    expect(retryButton).toHaveClass('error-fallback__retry');
    expect(backButton).toHaveClass('error-fallback__back');
  });

  it('renders with all props combined', () => {
    const error = new Error('Complete error');
    const resetError = jest.fn();
    
    render(<ErrorFallback error={error} resetError={resetError} />);
    
    expect(screen.getByText('Error genérico')).toBeInTheDocument();
    expect(screen.getByText('Error del servidor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });

  it('handles error without stack trace in development', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error message');
    // No stack trace
    
    render(<ErrorFallback error={error} />);
    
    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
    // El mensaje de error aparece en el elemento <pre>
    const errorElement = document.querySelector('.error-fallback__error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('Test error message');
  });
});
