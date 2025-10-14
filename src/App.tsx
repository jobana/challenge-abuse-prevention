import React, { Suspense, ErrorBoundary } from 'react';
import { VerificationForm } from './components/VerificationForm';
import { ErrorFallback } from './components/ui/ErrorFallback';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useI18n } from './hooks/useI18n';
import './styles/globals.scss';

interface AppProps {
  initialData?: {
    referrer?: string;
    token?: string;
    step?: string;
    customerData?: any;
    shippingData?: any;
    billingData?: any;
    paymentData?: any;
    orderData?: any;
    locale?: string;
  };
  performanceConfig?: {
    CAPTCHA_LOAD_TIMEOUT?: number;
    FORM_SUBMIT_TIMEOUT?: number;
    API_TIMEOUT?: number;
  };
}

/**
 * Componente principal de la aplicación
 * Maneja i18n, error boundaries y el layout principal
 */
export const App: React.FC<AppProps> = ({ 
  initialData, 
  performanceConfig 
}) => {
  const { t, ready, currentLanguageInfo } = useI18n();

  // Mostrar loading mientras i18n se inicializa
  if (!ready) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('App Error:', error, errorInfo);
        // Aquí podrías enviar el error a un servicio de monitoreo
      }}
    >
      <div className="app" data-locale={currentLanguageInfo.locale}>
        <header className="app-header">
          <div className="app-header__content">
            <h1 className="app-header__title">
              {t('form.title')}
            </h1>
            <p className="app-header__subtitle">
              {t('form.description')}
            </p>
          </div>
        </header>

        <main className="app-main">
          <Suspense 
            fallback={
              <div className="app-suspense">
                <LoadingSpinner size="medium" />
                <p>{t('common.loading')}</p>
              </div>
            }
          >
            <VerificationForm />
          </Suspense>
        </main>

        <footer className="app-footer">
          <div className="app-footer__content">
            <div className="app-footer__security">
              <span className="app-footer__security-icon">🔒</span>
              <span>{t('security.secure_connection')}</span>
            </div>
            <div className="app-footer__links">
              <a href="#" className="app-footer__link">
                {t('security.privacy_policy')}
              </a>
              <a href="#" className="app-footer__link">
                {t('security.terms_conditions')}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

/**
 * Error Boundary personalizado para la aplicación
 */
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    
    // Aquí podrías enviar el error a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default App;
