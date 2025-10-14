import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extender expect con axe-core
expect.extend(toHaveNoViolations);

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('input');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with label', () => {
    render(<Input label="Test Label" />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('renders with different types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
  });

  it('can be required', () => {
    render(<Input required />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
  });

  it('can be disabled', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('can be read-only', () => {
    render(<Input readOnly />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('shows error state', () => {
    render(<Input error="This field has an error" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input--error');
    expect(screen.getByText('This field has an error')).toBeInTheDocument();
  });

  it('shows success state', () => {
    render(<Input success />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input--success');
  });

  it('accepts custom className', () => {
    render(<Input className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Input label="Test input" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Input 
        label="Test input"
        aria-describedby="help-text"
        aria-invalid="true"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'help-text');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates label with input correctly', () => {
    render(<Input label="Test input" id="test-input" />);
    
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test input');
    
    expect(input).toHaveAttribute('id', 'test-input');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('renders with help text', () => {
    render(<Input helpText="This is help text" />);
    
    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const Icon = () => <span data-testid="icon">🔍</span>;
    render(<Input icon={<Icon />} />);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('handles keyboard events', () => {
    const handleKeyDown = jest.fn();
    render(<Input onKeyDown={handleKeyDown} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Input size="small" />);
    expect(screen.getByRole('textbox')).toHaveClass('input--small');

    rerender(<Input size="large" />);
    expect(screen.getByRole('textbox')).toHaveClass('input--large');
  });

  it('renders with prefix and suffix', () => {
    render(
      <Input 
        prefix="$" 
        suffix="USD"
        value="100"
      />
    );
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });

  it('handles controlled value', () => {
    const { rerender } = render(<Input value="initial" />);
    
    const input = screen.getByDisplayValue('initial');
    expect(input).toHaveValue('initial');
    
    rerender(<Input value="updated" />);
    expect(input).toHaveValue('updated');
  });

  it('handles uncontrolled value with defaultValue', () => {
    render(<Input defaultValue="default" />);
    
    const input = screen.getByDisplayValue('default');
    expect(input).toHaveValue('default');
  });
});
