import React from 'react';
import styles from './ErrorMessage.module.scss';

export interface ErrorMessageProps {
  type?: 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

/**
 * Componente ErrorMessage reutilizable
 * Muestra mensajes de error, advertencia o información con iconos
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  type = 'error',
  title,
  message,
  className,
  onRetry,
  showRetry = false,
}) => {
  const messageClasses = [
    styles.message,
    styles[`message--${type}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'info':
        return 'Información';
      default:
        return 'Error';
    }
  };

  return (
    <div
      className={messageClasses}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.message__content}>
        <div className={styles.message__icon} aria-hidden="true">
          {getIcon()}
        </div>
        
        <div className={styles.message__text}>
          {(title || getDefaultTitle()) && (
            <h3 className={styles.message__title}>
              {title || getDefaultTitle()}
            </h3>
          )}
          
          <p className={styles.message__description}>
            {message}
          </p>
        </div>
      </div>
      
      {showRetry && onRetry && (
        <div className={styles.message__actions}>
          <button
            type="button"
            className={styles.message__retry}
            onClick={onRetry}
            aria-label="Reintentar"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};
