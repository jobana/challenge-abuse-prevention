import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button--primary');
    expect(button).toHaveClass('button--medium');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--secondary');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--danger');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--ghost');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--small');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--large');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('can be loading', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    
    const spinner = screen.getByRole('button').querySelector('.button__spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('custom-class');
  });


  it('renders children correctly', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Icon');
    expect(button).toHaveTextContent('Text');
  });

  it('renders content in button__content wrapper', () => {
    render(<Button>Test content</Button>);
    
    const content = screen.getByText('Test content');
    expect(content).toHaveClass('button__content');
  });

  it('applies full width correctly', () => {
    render(<Button fullWidth>Full width</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--full-width');
  });

  it('passes through HTML button attributes', () => {
    render(<Button type="submit" form="test-form">Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('form', 'test-form');
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<Button onFocus={handleFocus} onBlur={handleBlur}>Focus test</Button>);
    
    const button = screen.getByRole('button');
    
    fireEvent.focus(button);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(button);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('renders with all props combined', () => {
    const handleClick = jest.fn();
    render(
      <Button 
        variant="danger" 
        size="large" 
        fullWidth 
        loading 
        onClick={handleClick}
        className="custom-class"
        disabled
      >
        Complete button
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--danger');
    expect(button).toHaveClass('button--large');
    expect(button).toHaveClass('button--full-width');
    expect(button).toHaveClass('custom-class');
    expect(button).toBeDisabled();
  });
});
