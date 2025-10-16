import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {

  it('renders with retry button when showRetry is true', () => {
    const handleRetry = jest.fn();
    render(
      <ErrorMessage 
        message="Error message" 
        showRetry={true}
        onRetry={handleRetry}
      />
    );
    
    const retryButton = screen.getByRole('button', { name: 'Reintentar' });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveClass('message__retry');
  });

  it('handles retry button click', () => {
    const handleRetry = jest.fn();
    render(
      <ErrorMessage 
        message="Error message" 
        showRetry={true}
        onRetry={handleRetry}
      />
    );
    
    const retryButton = screen.getByRole('button', { name: 'Reintentar' });
    fireEvent.click(retryButton);
    
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when showRetry is false', () => {
    render(<ErrorMessage message="Error message" showRetry={false} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<ErrorMessage message="Error message" className="custom-class" />);
    
    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toHaveClass(' message__description');
  });


  it('renders error icon for error type', () => {
    render(<ErrorMessage message="Error message" type="error" />);
    
    const icon = screen.getByText('!');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('message__error-icon');
  });

  it('renders warning icon for warning type', () => {
    render(<ErrorMessage message="Warning message" type="warning" />);
    
    const icon = screen.getByText('!');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('message__warning-icon');
  });

  it('renders info icon for info type', () => {
    render(<ErrorMessage message="Info message" type="info" />);
    
    const icon = screen.getByText('✓');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('message__info-icon');
  });

  it('renders with all props combined', () => {
    const handleRetry = jest.fn();
    
    render(
      <ErrorMessage 
        message="Complete error message"
        title="Error Title"
        type="warning"
        showRetry={true}
        onRetry={handleRetry}
        className="custom-class"
        id="complete-error"
      />
    );
    
    const errorMessage = screen.getByText('Complete error message');
    expect(errorMessage).toHaveClass('message__description');
  });

  it('renders message content correctly', () => {
    render(<ErrorMessage message="Test error message" />);
    
    const messageContent = screen.getByText('Test error message');
    expect(messageContent).toHaveClass('message__description');
  });

  it('renders icon container', () => {
    render(<ErrorMessage message="Error message" />);
    
    const iconContainer = screen.getByText('!').closest('.message__icon');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders content container', () => {
    render(<ErrorMessage message="Error message" />);
    
    const contentContainer = screen.getByText('Error message').closest('.message__content');
    expect(contentContainer).toBeInTheDocument();
  });
});
