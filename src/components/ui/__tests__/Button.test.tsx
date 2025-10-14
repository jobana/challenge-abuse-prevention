import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extender expect con axe-core
expect.extend(toHaveNoViolations);

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
    expect(button).toHaveClass('button--loading');
  });

  it('renders as different HTML elements', () => {
    const { rerender } = render(<Button as="a" href="/test">Link</Button>);
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');

    rerender(<Button as="div">Div</Button>);
    expect(screen.getByText('Div')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent('Ref test');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA attributes when disabled', () => {
    render(<Button disabled>Disabled button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('has proper ARIA attributes when loading', () => {
    render(<Button loading>Loading button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
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

  it('handles keyboard events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Keyboard test</Button>);
    
    const button = screen.getByRole('button');
    
    // Simular Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Simular Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('does not handle click when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies full width correctly', () => {
    render(<Button fullWidth>Full width</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--fullWidth');
  });

  it('renders with icon', () => {
    const Icon = () => <span data-testid="icon">📝</span>;
    render(<Button icon={<Icon />}>With icon</Button>);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('With icon');
  });
});
