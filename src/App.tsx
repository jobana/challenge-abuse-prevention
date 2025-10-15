import React, { memo } from 'react';
import { VerificationForm } from './components/VerificationForm';
import { ErrorFallback } from './components/ui/ErrorFallback';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Header } from './components/Header';
import { useI18n } from './hooks/useI18n';
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
      // Aquí se podría integrar con Sentry, LogRocket, etc.
      // reportError(error, errorInfo);
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

/**
 * Componente principal de la aplicación
 * Maneja i18n, error boundaries y el layout principal
 */
export const App: React.FC = memo(() => {
  const { t, currentLanguageInfo, i18n } = useI18n();


  return (
    <AppErrorBoundary>
      <div className="app" data-locale={i18n.language}>
        <Header />

        <main className="app-main">
          <VerificationForm />
        </main>
      </div>
    </AppErrorBoundary>
  );
});

export default App;
