import React, { forwardRef } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Componente Button reutilizable
 * Soporta diferentes variantes, tamaños y estados
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      fullWidth && styles['button--full-width'],
      loading && styles['button--loading'],
      disabled && styles['button--disabled'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={styles.button__spinner} aria-hidden="true">
            <svg
              className={styles.button__spinner__icon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.button__spinner__circle}
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
          </span>
        )}
        <span className={styles.button__content}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
