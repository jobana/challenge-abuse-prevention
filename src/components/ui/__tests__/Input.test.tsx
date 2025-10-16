import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('input__field');
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
    expect(input).toBeRequired();
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
    expect(input).toHaveClass(' message--error');
    expect(screen.getByText('This field has an error')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<Input helperText="This is help text" />);
    
    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Input loading />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(screen.getByRole('textbox').closest('.input__wrapper')).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    const LeftIcon = () => <span data-testid="left-icon">🔍</span>;
    render(<Input leftIcon={<LeftIcon />} />);
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('left-icon').closest('[data-position="left"]')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const RightIcon = () => <span data-testid="right-icon">✓</span>;
    render(<Input rightIcon={<RightIcon />} />);
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon').closest('[data-position="right"]')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<Input className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input__field');
    expect(input).toHaveClass('custom-class');
  });


  it('associates label with input correctly', () => {
    render(<Input label="Test input" id="test-input" />);
    
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test input');
    
    expect(input).toHaveAttribute('id', 'test-input');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('handles keyboard events', () => {
    const handleKeyDown = jest.fn();
    render(<Input onKeyDown={handleKeyDown} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Input variant="filled" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(<Input variant="outlined" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with full width', () => {
    render(<Input fullWidth />);
    
    const container = screen.getByRole('textbox').closest('.input__container');
    expect(container).toBeInTheDocument();
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

  it('generates unique id when not provided', () => {
    render(<Input label="Test input" />);
    
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test input');
    
    expect(input).toHaveAttribute('id');
    expect(label).toHaveAttribute('for');
    expect(input.getAttribute('id')).toBe(label.getAttribute('for'));
  });

  it('shows error icon when error is present', () => {
    render(<Input error="Error message" />);
    
    const errorIcon = screen.getByText('!');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass('input__error-icon');
  });

  it('does not show helper text when error is present', () => {
    render(<Input error="Error message" helperText="Helper text" />);
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });
});
