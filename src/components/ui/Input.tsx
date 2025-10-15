import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

/**
 * Componente Input reutilizable
 * Soporta diferentes variantes, estados y accesibilidad
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = 'default',
      className,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    const inputClasses = [
      'input__field',
      error && ' message--error',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="input__container">
        {label && (
          <label htmlFor={inputId} className="input__label">
            {label}
            {required && <span className="input__required">*</span>}
          </label>
        )}
        
        <div className="input__wrapper">
          {leftIcon && (
            <div className="input__icon" data-position="left">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled || loading}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            aria-required={required}
            {...props}
          />
          
          {rightIcon && (
            <div className="input__icon" data-position="right">
              {rightIcon}
            </div>
          )}
          
          {loading && (
            <div className="input__loading" aria-hidden="true">
              <svg
                className="input__loading__icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="input__loading__circle"
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
          )}
        </div>
        
        {error && (
          <div id={errorId} className="input__error" role="alert">
            <div className="input__error-icon" aria-hidden="true">
              !
            </div>
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={helperId} className="input__helper">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
