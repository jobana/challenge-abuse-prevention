import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner');
    expect(spinner).toHaveClass('spinner--medium');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(screen.getByRole('status')).toHaveClass('spinner--small');

    rerender(<LoadingSpinner size="large" />);
    expect(screen.getByRole('status')).toHaveClass('spinner--large');
  });



  it('accepts custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner');
    expect(spinner).toHaveClass('custom-class');
  });



  it('renders with different colors', () => {
    const { rerender } = render(<LoadingSpinner color="secondary" />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<LoadingSpinner color="white" />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<LoadingSpinner color="gray" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders spinner circle element', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    const circle = spinner.querySelector('.spinner__circle');
    expect(circle).toBeInTheDocument();
  });


  it('renders with all props combined', () => {
    render(
      <LoadingSpinner 
        size="large" 
        color="secondary" 
        className="custom-class"
      />
    );
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner--large');
    expect(spinner).toHaveClass('custom-class');
  });

  it('renders with primary color by default', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner--medium');
  });
});
