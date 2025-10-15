import React from 'react';

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
    'spinner',
    `spinner--${size}`,
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
      <div className="spinner__circle"></div>
      <span className="spinner__sr">{ariaLabel}</span>
    </div>
  );
};
