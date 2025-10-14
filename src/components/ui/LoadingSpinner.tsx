import React from 'react';
import styles from './LoadingSpinner.module.scss';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  'aria-label'?: string;
}

/**
 * Componente LoadingSpinner reutilizable
 * Muestra un indicador de carga con diferentes tamaños y colores
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className,
  'aria-label': ariaLabel = 'Loading...',
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[`spinner--${size}`],
    styles[`spinner--${color}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={spinnerClasses}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <svg
        className={styles.spinner__icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className={styles.spinner__circle}
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
      <span className={styles.spinner__sr}>{ariaLabel}</span>
    </div>
  );
};
