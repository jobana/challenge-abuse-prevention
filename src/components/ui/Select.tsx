import React, { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import '../../styles/components.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  name?: string;
  error?: string;
  helperText?: string;
  loading?: boolean;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string, option: SelectOption | null) => void;
}

/**
 * Componente Select reutilizable
 * Soporta búsqueda, estados de error y accesibilidad completa
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      name,
      error,
      helperText,
      loading = false,
      options = [],
      placeholder = 'Seleccionar...',
      searchable = false,
      fullWidth = false,
      className,
      id,
      disabled = false,
      required = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const selectId = useMemo(() => id || `select-${Math.random().toString(36).substr(2, 9)}`, [id]);
    const errorId = useMemo(() => error ? `${selectId}-error` : undefined, [error, selectId]);
    const helperId = useMemo(() => helperText ? `${selectId}-helper` : undefined, [helperText, selectId]);
    const describedBy = useMemo(() => [errorId, helperId].filter(Boolean).join(' ') || undefined, [errorId, helperId]);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    // Filtrar opciones basado en la búsqueda
    const filteredOptions = useMemo(() =>
      options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      ), [options, searchQuery]
    );

    // Encontrar la opción seleccionada
    const selectedOption = useMemo(() =>
      options.find(option => option.value === value), [options, value]
    );

    const selectClasses = useMemo(() => [
      'select__field',
      error && 'select__field--error',
      fullWidth && 'select--full-width',
      disabled && 'select--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' '), [error, fullWidth, disabled, className]);

    const handleToggle = useCallback(() => {
      if (disabled || loading) return;

      const newOpenState = !isOpen;
      setIsOpen(newOpenState);

      if (newOpenState) {
        setFocusedIndex(-1);
        if (searchable) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      } else {
        setSearchQuery('');
        setFocusedIndex(-1);
        triggerRef.current?.focus();
      }
    }, [disabled, loading, isOpen, searchable]);

    const handleOptionSelect = useCallback((option: SelectOption) => {
      if (option.disabled) return;

      onChange?.(option.value, option);
      setIsOpen(false);
      setSearchQuery('');
      setFocusedIndex(-1);

      // Devolver el foco al trigger
      setTimeout(() => triggerRef.current?.focus(), 0);
    }, [onChange]);
    
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (disabled || loading) return;

      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
            return nextIndex;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
            return nextIndex;
          });
          break;

        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            const selectedOption = filteredOptions[focusedIndex];
            if (!selectedOption.disabled) {
              handleOptionSelect(selectedOption);
            }
          }
          break;

        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;

        case 'Tab':
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
          break;

        case 'Home':
          if (filteredOptions.length > 0) {
            e.preventDefault();
            setFocusedIndex(0);
          }
          break;

        case 'End':
          if (filteredOptions.length > 0) {
            e.preventDefault();
            setFocusedIndex(filteredOptions.length - 1);
          }
          break;
      }
    }, [disabled, loading, isOpen, filteredOptions, focusedIndex, handleOptionSelect]);
    
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
      <div ref={ref} className="select__container">
        {label && (
          <label id={`${selectId}-label`} className="select__label">
            {label}
            {required && <span className="select__required" aria-label="requerido">*</span>}
          </label>
        )}
        
        <div className="select__wrapper" ref={dropdownRef}>
          {/* Input hidden para compatibilidad con formularios */}
          {name && (
            <input
              type="hidden"
              name={name}
              value={value || ''}
            />
          )}

          <div
            ref={triggerRef}
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
            aria-label={label || 'Seleccionar opción'}
            aria-labelledby={label ? selectId + '-label' : undefined}
            aria-activedescendant={
              isOpen && focusedIndex >= 0
                ? `${selectId}-option-${focusedIndex}`
                : undefined
            }
            data-name={name}
            {...props}
          >
            <span
              className={`select__value ${!selectedOption ? 'select__value--placeholder' : ''}`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            
            <div className="select__icon">
              {loading ? (
                <div className="select__loading">
                  <svg
                    className="select__loading__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="select__loading__circle"
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
                <svg className={`select__arrow ${isOpen ? 'select__arrow--open' : ''}`} aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="rgba(0, 0, 0, 0.9)"><path d="M9.35229 3.70447L6.00004 7.05672L2.64779 3.70447L1.85229 4.49996L6.00004 8.64771L10.1478 4.49996L9.35229 3.70447Z" fill="rgba(0, 0, 0, 0.9)"></path></svg>
              )}
            </div>
          </div>
          
          {isOpen && (
            <div className="select__dropdown" role="listbox">
              {searchable && (
                <div className="select__search">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="select__search__input"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
              
              <div className="select__options">
                {filteredOptions.length === 0 ? (
                  <div className="select__no-options">
                    No se encontraron opciones
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      id={`${selectId}-option-${index}`}
                      className={[
                        'select__option',
                        option.disabled && 'select__option--disabled',
                        index === focusedIndex && 'select__option--focused',
                        option.value === value && 'select__option--selected',
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
          <div id={errorId} className="select__error" role="alert">
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={helperId} className="select__helper">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
