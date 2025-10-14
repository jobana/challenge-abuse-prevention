import React, { forwardRef, useState, useRef, useEffect } from 'react';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  loading?: boolean;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  fullWidth?: boolean;
  onChange?: (value: string, option: SelectOption | null) => void;
}

/**
 * Componente Select reutilizable
 * Soporta búsqueda, estados de error y accesibilidad completa
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      loading = false,
      options,
      placeholder = 'Seleccionar...',
      searchable = false,
      fullWidth = false,
      className,
      id,
      disabled,
      required,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    // Filtrar opciones basado en la búsqueda
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Encontrar la opción seleccionada
    const selectedOption = options.find(option => option.value === value);
    
    const selectClasses = [
      styles.select,
      error && styles['select--error'],
      disabled && styles['select--disabled'],
      loading && styles['select--loading'],
      fullWidth && styles['select--full-width'],
      isOpen && styles['select--open'],
      className,
    ]
      .filter(Boolean)
      .join(' ');
    
    const handleToggle = () => {
      if (disabled || loading) return;
      setIsOpen(!isOpen);
      if (!isOpen && searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    };
    
    const handleOptionSelect = (option: SelectOption) => {
      if (option.disabled) return;
      
      onChange?.(option.value, option);
      setIsOpen(false);
      setSearchQuery('');
      setFocusedIndex(-1);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleOptionSelect(filteredOptions[focusedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
          break;
      }
    };
    
    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    return (
      <div className={styles.select__container}>
        {label && (
          <label htmlFor={selectId} className={styles.select__label}>
            {label}
            {required && <span className={styles.select__required}>*</span>}
          </label>
        )}
        
        <div className={styles.select__wrapper} ref={dropdownRef}>
          <div
            className={selectClasses}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={disabled || loading ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            aria-required={required}
            aria-label={label}
          >
            <span className={styles.select__value}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            
            <div className={styles.select__icon}>
              {loading ? (
                <div className={styles.select__loading}>
                  <svg
                    className={styles.select__loading__icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className={styles.select__loading__circle}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="60"
                      strokeDashoffset="60"
                    />
                  </svg>
                </div>
              ) : (
                <svg
                  className={`${styles.select__arrow} ${isOpen ? styles['select__arrow--open'] : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
          
          {isOpen && (
            <div className={styles.select__dropdown} role="listbox">
              {searchable && (
                <div className={styles.select__search}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={styles.select__search__input}
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
              
              <div className={styles.select__options}>
                {filteredOptions.length === 0 ? (
                  <div className={styles.select__no-options}>
                    No se encontraron opciones
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={[
                        styles.select__option,
                        option.disabled && styles['select__option--disabled'],
                        index === focusedIndex && styles['select__option--focused'],
                        option.value === value && styles['select__option--selected'],
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => handleOptionSelect(option)}
                      role="option"
                      aria-selected={option.value === value}
                      aria-disabled={option.disabled}
                    >
                      {option.label}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div id={errorId} className={styles.select__error} role="alert">
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={helperId} className={styles.select__helper}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
