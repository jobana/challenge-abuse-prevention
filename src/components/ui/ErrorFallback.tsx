import React from 'react';
import { Button } from './Button';
import { useI18n } from '@hooks/useI18n';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

/**
 * Componente de fallback para errores
 * Se muestra cuando hay un error no manejado en la aplicación
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError 
}) => {
  const { t } = useI18n();

  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      // Si no hay función de reset, recargar la página
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Si no hay historial, ir a la página anterior
      window.location.href = document.referrer || '/';
    }
  };

  return (
    <div className="error-fallback">
      <div className="error-fallback__content">
        <div className="error-fallback__icon">
          ⚠️
        </div>
        
        <h2 className="error-fallback__title">
          {t('errors.generic')}
        </h2>
        
        <p className="error-fallback__message">
          {t('errors.server')}
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="error-fallback__details">
            <summary>Error Details (Development)</summary>
            <pre className="error-fallback__error">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="error-fallback__actions">
          <Button
            variant="primary"
            onClick={handleRetry}
            className="error-fallback__retry"
          >
            {t('common.retry')}
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleGoBack}
            className="error-fallback__back"
          >
            {t('common.back')}
          </Button>
        </div>
        
        <div className="error-fallback__help">
          <p>
            Si el problema persiste, por favor contacta a soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};
