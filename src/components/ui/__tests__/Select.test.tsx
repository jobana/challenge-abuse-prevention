import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../Select';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extender expect con axe-core
expect.extend(toHaveNoViolations);

describe('Select', () => {
  it('renders with default props', () => {
    render(<Select />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveClass('select');
  });

  it('renders with label', () => {
    render(<Select label="Test Label" />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Select placeholder="Select an option" />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('placeholder', 'Select an option');
  });

  it('renders with options', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    // Verificar que las opciones están presentes
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('can be required', () => {
    render(<Select required />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('required');
  });

  it('can be disabled', () => {
    render(<Select disabled />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(
      <Select onChange={handleChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue('option2');
  });

  it('shows error state', () => {
    render(<Select error="This field has an error" />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('select--error');
    expect(screen.getByText('This field has an error')).toBeInTheDocument();
  });

  it('shows success state', () => {
    render(<Select success />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('select--success');
  });

  it('accepts custom className', () => {
    render(<Select className="custom-class" />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('select');
    expect(select).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<Select ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Select label="Test select">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Select 
        label="Test select"
        aria-describedby="help-text"
        aria-invalid="true"
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-describedby', 'help-text');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates label with select correctly', () => {
    render(<Select label="Test select" id="test-select" />);
    
    const select = screen.getByRole('combobox');
    const label = screen.getByText('Test select');
    
    expect(select).toHaveAttribute('id', 'test-select');
    expect(label).toHaveAttribute('for', 'test-select');
  });

  it('renders with help text', () => {
    render(<Select helpText="This is help text" />);
    
    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const Icon = () => <span data-testid="icon">🔽</span>;
    render(<Select icon={<Icon />} />);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('handles keyboard events', () => {
    const handleKeyDown = jest.fn();
    render(<Select onKeyDown={handleKeyDown} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Select size="small" />);
    expect(screen.getByRole('combobox')).toHaveClass('select--small');

    rerender(<Select size="large" />);
    expect(screen.getByRole('combobox')).toHaveClass('select--large');
  });

  it('handles controlled value', () => {
    const { rerender } = render(
      <Select value="option1">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    
    const select = screen.getByDisplayValue('Option 1');
    expect(select).toHaveValue('option1');
    
    rerender(
      <Select value="option2">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    expect(select).toHaveValue('option2');
  });

  it('handles uncontrolled value with defaultValue', () => {
    render(
      <Select defaultValue="option1">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    
    const select = screen.getByDisplayValue('Option 1');
    expect(select).toHaveValue('option1');
  });

  it('renders with multiple selection', () => {
    render(
      <Select multiple>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
    );
    
    const select = screen.getByRole('listbox');
    expect(select).toHaveAttribute('multiple');
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<Select onFocus={handleFocus} onBlur={handleBlur} />);
    
    const select = screen.getByRole('combobox');
    
    fireEvent.focus(select);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(select);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('renders with disabled options', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
        <option value="option2" disabled>Option 2 (Disabled)</option>
        <option value="option3">Option 3</option>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    
    expect(options[1]).toHaveAttribute('disabled');
  });
});
