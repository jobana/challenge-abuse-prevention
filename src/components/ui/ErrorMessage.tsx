import React from 'react';

export interface ErrorMessageProps {
  type?: 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
  id?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

/**
 * Componente ErrorMessage reutilizable
 * Muestra mensajes de error, advertencia o información con iconos
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  type = 'error',
  message,
  className,
  id,
  onRetry,
  showRetry = false,
}) => {
  const messageClasses = [
    'message',
    `message--${type}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <div className="message__error-icon" aria-hidden="true">
            !
          </div>
        );
      case 'warning':
        return (
          <div className="message__warning-icon" aria-hidden="true">
            !
          </div>
        );
      case 'info':
        return (
          <div className="message__info-icon" aria-hidden="true">
            i
          </div>
        );
      default:
        return (
          <div className="message__error-icon" aria-hidden="true">
            !
          </div>
        );
    }
  };



  return (
    <div
      id={id}
      className={messageClasses}
      role="alert"
      aria-live="polite"
    >
      <div className="message__content">
        <div className="message__icon" aria-hidden="true">
          {getIcon()}
        </div>
          <p className="message__description">
            {message}
          </p>
      </div>
      
      {showRetry && onRetry && (
        <div className="message__actions">
          <button
            type="button"
            className="message__retry"
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
