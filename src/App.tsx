import React, { memo, useMemo } from 'react';
import { VerificationForm } from './components/VerificationForm';
import { ErrorFallback } from './components/ui/ErrorFallback';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Header } from './components/Header';
import { useI18n } from './hooks/useI18n';
import { getDecodedQueryParams } from './utils/queryParams';
import './styles/globals.css';

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

    // Enviar error a servicio de monitoreo en producción
    if (process.env.NODE_ENV === 'production') {

    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} resetError={this.handleRetry} />;
    }

    return this.props.children;
  }
}


interface AppProps {
  initialData?: any;
  performanceConfig?: any;
}

/**
 * Componente principal de la aplicación
 * Maneja i18n, error boundaries y el layout principal
 */
export const App: React.FC<AppProps> = memo(({ initialData, performanceConfig }) => {
  const { t, i18n } = useI18n();

  // Usar datos del servidor si están disponibles, sino extraer de query params
  const queryParams = useMemo(() => {
    // En SSR, usar datos del servidor
    if (initialData) {
      console.log('🚀 Using SSR initial data:', initialData);
      return initialData;
    }

    // En cliente, extraer de window
    if (typeof window !== 'undefined') {
      // Primero intentar obtener de window.__INITIAL_DATA__
      const windowData = (window as any).__INITIAL_DATA__;
      if (windowData) {
        console.log('🌐 Using window initial data:', windowData);
        return windowData;
      }

      // Fallback a query params
      console.log('📄 Using query params fallback');
      return getDecodedQueryParams();
    }

    return {};
  }, [initialData]);

  // Log para debugging
  console.log('🎯 App rendering with data:', queryParams);

  return (
    <AppErrorBoundary>
      <div className="app" data-locale={i18n.language}>
        <Header />

        <main className="app-main">
            <div className="verificationForm__header">
              <h1 className="verificationForm__title">
                {t('form.title')}
              </h1>
              <p className="verificationForm__description">
                {t('form.description')}
              </p>
            </div>
          <VerificationForm initialData={queryParams} />
        </main>
      </div>
    </AppErrorBoundary>
  );
});

export default App;
