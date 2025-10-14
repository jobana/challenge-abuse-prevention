import React, { forwardRef } from 'react';
import styles from './Input.module.scss';

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
      styles.input,
      styles[`input--${variant}`],
      error && styles['input--error'],
      disabled && styles['input--disabled'],
      loading && styles['input--loading'],
      fullWidth && styles['input--full-width'],
      leftIcon && styles['input--with-left-icon'],
      rightIcon && styles['input--with-right-icon'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.input__container}>
        {label && (
          <label htmlFor={inputId} className={styles.input__label}>
            {label}
            {required && <span className={styles.input__required}>*</span>}
          </label>
        )}
        
        <div className={styles.input__wrapper}>
          {leftIcon && (
            <div className={styles.input__icon} data-position="left">
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
            <div className={styles.input__icon} data-position="right">
              {rightIcon}
            </div>
          )}
          
          {loading && (
            <div className={styles.input__loading} aria-hidden="true">
              <svg
                className={styles.input__loading__icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className={styles.input__loading__circle}
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
          <div id={errorId} className={styles.input__error} role="alert">
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={helperId} className={styles.input__helper}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
