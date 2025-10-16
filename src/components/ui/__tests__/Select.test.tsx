import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select, SelectOption } from '../Select';

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

describe('Select', () => {
  it('renders with default props', () => {
    render(<Select options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Select label="Test Label" options={mockOptions} />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Select placeholder="Select an option" options={mockOptions} />);
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('shows selected option', () => {
    render(<Select value="option1" options={mockOptions} />);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Select disabled options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('tabIndex', '-1');
  });

  it('can be required', () => {
    render(<Select required options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<Select error="This field has an error" options={mockOptions} />);
    
    expect(screen.getByText('This field has an error')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<Select helperText="This is help text" options={mockOptions} />);
    
    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<Select options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    const handleChange = jest.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    
    expect(handleChange).toHaveBeenCalledWith('option1', mockOptions[0]);
  });

  it('handles keyboard navigation', () => {
    render(<Select options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    // Arrow down should focus first option
    fireEvent.keyDown(select, { key: 'ArrowDown' });
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    
    // Arrow down again should focus second option
    fireEvent.keyDown(select, { key: 'ArrowDown' });
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('closes dropdown on Escape key', () => {
    render(<Select options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    fireEvent.keyDown(select, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('filters options when searchable', () => {
    render(<Select searchable options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    const searchInput = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(searchInput, { target: { value: 'Option 1' } });
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Select loading options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('tabIndex', '-1');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<Select className="custom-class" options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('renders with full width', () => {
    render(<Select fullWidth options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('shows no options message when filtered results are empty', () => {
    render(<Select searchable options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    const searchInput = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No se encontraron opciones')).toBeInTheDocument();
  });
});
