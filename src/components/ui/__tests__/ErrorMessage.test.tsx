import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extender expect con axe-core
expect.extend(toHaveNoViolations);

describe('ErrorMessage', () => {
  it('renders with default props', () => {
    render(<ErrorMessage message="Test error message" />);
    
    const errorMessage = screen.getByText('Test error message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('errorMessage');
    expect(errorMessage).toHaveClass('errorMessage--error');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<ErrorMessage message="Warning message" variant="warning" />);
    expect(screen.getByText('Warning message')).toHaveClass('errorMessage--warning');

    rerender(<ErrorMessage message="Info message" variant="info" />);
    expect(screen.getByText('Info message')).toHaveClass('errorMessage--info');

    rerender(<ErrorMessage message="Success message" variant="success" />);
    expect(screen.getByText('Success message')).toHaveClass('errorMessage--success');
  });

  it('renders with icon', () => {
    render(<ErrorMessage message="Error with icon" showIcon={true} />);
    
    const errorMessage = screen.getByText('Error with icon');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('errorMessage--withIcon');
  });

  it('renders without icon by default', () => {
    render(<ErrorMessage message="Error without icon" />);
    
    const errorMessage = screen.getByText('Error without icon');
    expect(errorMessage).not.toHaveClass('errorMessage--withIcon');
  });

  it('renders with custom icon', () => {
    const CustomIcon = () => <span data-testid="custom-icon">⚠️</span>;
    render(<ErrorMessage message="Custom icon error" icon={<CustomIcon />} />);
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom icon error')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<ErrorMessage message="Error message" title="Error Title" />);
    
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <ErrorMessage 
        message="Error message" 
        description="This is a detailed description of the error"
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('This is a detailed description of the error')).toBeInTheDocument();
  });

  it('renders with action button', () => {
    const handleAction = jest.fn();
    render(
      <ErrorMessage 
        message="Error message" 
        actionText="Retry"
        onAction={handleAction}
      />
    );
    
    const actionButton = screen.getByRole('button', { name: 'Retry' });
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveClass('errorMessage__action');
  });

  it('handles action button click', () => {
    const handleAction = jest.fn();
    render(
      <ErrorMessage 
        message="Error message" 
        actionText="Retry"
        onAction={handleAction}
      />
    );
    
    const actionButton = screen.getByRole('button', { name: 'Retry' });
    actionButton.click();
    
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders with dismiss button', () => {
    const handleDismiss = jest.fn();
    render(
      <ErrorMessage 
        message="Error message" 
        dismissible={true}
        onDismiss={handleDismiss}
      />
    );
    
    const dismissButton = screen.getByRole('button', { name: 'Cerrar' });
    expect(dismissButton).toBeInTheDocument();
    expect(dismissButton).toHaveClass('errorMessage__dismiss');
  });

  it('handles dismiss button click', () => {
    const handleDismiss = jest.fn();
    render(
      <ErrorMessage 
        message="Error message" 
        dismissible={true}
        onDismiss={handleDismiss}
      />
    );
    
    const dismissButton = screen.getByRole('button', { name: 'Cerrar' });
    dismissButton.click();
    
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('accepts custom className', () => {
    render(<ErrorMessage message="Error message" className="custom-class" />);
    
    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toHaveClass('errorMessage');
    expect(errorMessage).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ErrorMessage message="Test error message" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA attributes', () => {
    render(<ErrorMessage message="Error message" id="error-1" />);
    
    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toHaveAttribute('id', 'error-1');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<ErrorMessage message="Small error" size="small" />);
    expect(screen.getByText('Small error')).toHaveClass('errorMessage--small');

    rerender(<ErrorMessage message="Large error" size="large" />);
    expect(screen.getByText('Large error')).toHaveClass('errorMessage--large');
  });

  it('renders with inline style', () => {
    render(<ErrorMessage message="Inline error" inline />);
    
    const errorMessage = screen.getByText('Inline error');
    expect(errorMessage).toHaveClass('errorMessage--inline');
  });

  it('renders with full width', () => {
    render(<ErrorMessage message="Full width error" fullWidth />);
    
    const errorMessage = screen.getByText('Full width error');
    expect(errorMessage).toHaveClass('errorMessage--fullWidth');
  });

  it('renders with custom style object', () => {
    render(<ErrorMessage message="Styled error" style={{ marginTop: '20px' }} />);
    
    const errorMessage = screen.getByText('Styled error');
    expect(errorMessage).toHaveStyle('margin-top: 20px');
  });

  it('renders with custom data attributes', () => {
    render(<ErrorMessage message="Error message" data-testid="custom-error" />);
    
    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    const handleAction = jest.fn();
    const handleDismiss = jest.fn();
    
    render(
      <ErrorMessage 
        message="Complete error message"
        title="Error Title"
        description="This is a detailed description"
        variant="warning"
        size="large"
        showIcon={true}
        actionText="Retry"
        onAction={handleAction}
        dismissible={true}
        onDismiss={handleDismiss}
        className="custom-class"
        inline
        fullWidth
      />
    );
    
    const errorMessage = screen.getByText('Complete error message');
    expect(errorMessage).toHaveClass('errorMessage--warning');
    expect(errorMessage).toHaveClass('errorMessage--large');
    expect(errorMessage).toHaveClass('errorMessage--withIcon');
    expect(errorMessage).toHaveClass('errorMessage--inline');
    expect(errorMessage).toHaveClass('errorMessage--fullWidth');
    expect(errorMessage).toHaveClass('custom-class');
    
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('This is a detailed description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  it('renders with custom icon for different variants', () => {
    const { rerender } = render(
      <ErrorMessage message="Warning message" variant="warning" showIcon={true} />
    );
    expect(screen.getByText('Warning message')).toHaveClass('errorMessage--withIcon');

    rerender(
      <ErrorMessage message="Info message" variant="info" showIcon={true} />
    );
    expect(screen.getByText('Info message')).toHaveClass('errorMessage--withIcon');

    rerender(
      <ErrorMessage message="Success message" variant="success" showIcon={true} />
    );
    expect(screen.getByText('Success message')).toHaveClass('errorMessage--withIcon');
  });
});
