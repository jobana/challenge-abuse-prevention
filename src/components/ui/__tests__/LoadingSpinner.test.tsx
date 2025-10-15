import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extender expect con axe-core
expect.extend(toHaveNoViolations);

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('loadingSpinner');
    expect(spinner).toHaveClass('loadingSpinner--medium');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(screen.getByRole('status')).toHaveClass('loadingSpinner--small');

    rerender(<LoadingSpinner size="large" />);
    expect(screen.getByRole('status')).toHaveClass('loadingSpinner--large');
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading data...');
  });

  it('renders with default text when no text provided', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Cargando...');
  });

  it('accepts custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loadingSpinner');
    expect(spinner).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LoadingSpinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA attributes', () => {
    render(<LoadingSpinner text="Loading content" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });

  it('renders with inline style', () => {
    render(<LoadingSpinner inline />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loadingSpinner--inline');
  });

  it('renders with overlay style', () => {
    render(<LoadingSpinner overlay />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loadingSpinner--overlay');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color="primary" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loadingSpinner--primary');
  });

  it('renders with different colors', () => {
    const { rerender } = render(<LoadingSpinner color="secondary" />);
    expect(screen.getByRole('status')).toHaveClass('loadingSpinner--secondary');

    rerender(<LoadingSpinner color="success" />);
    expect(screen.getByRole('status')).toHaveClass('loadingSpinner--success');

    rerender(<LoadingSpinner color="danger" />);
    expect(screen.getByRole('status')).toHaveClass('loadingSpinner--danger');
  });

  it('renders with custom speed', () => {
    render(<LoadingSpinner speed="slow" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loadingSpinner--slow');
  });

  it('renders with different speeds', () => {
    const { rerender } = render(<LoadingSpinner speed="fast" />);
    expect(screen.getByRole('status')).toHaveClass('loadingSpinner--fast');

    rerender(<LoadingSpinner speed="normal" />);
    expect(screen.getByRole('status')).toHaveClass('loadingSpinner--normal');
  });

  it('renders with custom size in pixels', () => {
    render(<LoadingSpinner size={32} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loadingSpinner--custom');
  });

  it('renders with multiple modifiers', () => {
    render(
      <LoadingSpinner 
        size="large" 
        color="primary" 
        speed="fast" 
        inline 
        text="Custom loading"
      />
    );
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loadingSpinner--large');
    expect(spinner).toHaveClass('loadingSpinner--primary');
    expect(spinner).toHaveClass('loadingSpinner--fast');
    expect(spinner).toHaveClass('loadingSpinner--inline');
    expect(spinner).toHaveAttribute('aria-label', 'Custom loading');
  });

  it('renders with custom children', () => {
    render(
      <LoadingSpinner>
        <div data-testid="custom-content">Custom content</div>
      </LoadingSpinner>
    );
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('renders with both text and children', () => {
    render(
      <LoadingSpinner text="Loading...">
        <div data-testid="custom-content">Custom content</div>
      </LoadingSpinner>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('renders with custom data attributes', () => {
    render(<LoadingSpinner data-testid="custom-spinner" />);
    
    expect(screen.getByTestId('custom-spinner')).toBeInTheDocument();
  });

  it('renders with custom style object', () => {
    render(<LoadingSpinner style={{ marginTop: '20px' }} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('margin-top: 20px');
  });

  it('renders with custom id', () => {
    render(<LoadingSpinner id="loading-spinner" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('id', 'loading-spinner');
  });
});
