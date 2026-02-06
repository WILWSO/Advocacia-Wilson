import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { EXTERNAL_COMPONENT_CLASSES } from '../../config/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Captura errores de React en el árbol de componentes
 * Implementa error boundary según patrón oficial de React
 * 
 * Uso:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Actualiza el estado para mostrar la UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log del error para monitoreo
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Aquí podrías enviar el error a un servicio de monitoreo
    // Ejemplo: Sentry, LogRocket, etc.
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Renderizar UI personalizada de fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8 md:p-12">
            {/* Ícono de error */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${EXTERNAL_COMPONENT_CLASSES.errorContainer}`}>
                <AlertTriangle size={40} className="text-red-600" />
              </div>
            </div>

            {/* Mensaje principal */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-900 mb-4">
                Algo deu errado
              </h1>
              <p className="text-lg text-neutral-600 mb-4">
                Desculpe, ocorreu um erro inesperado na aplicação.
              </p>
              <p className="text-sm text-neutral-500">
                Nossa equipe foi notificada e estamos trabalhando para resolver o problema.
              </p>
            </div>

            {/* Detalles del error (solo en desarrollo) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 mb-2">
                  Detalhes técnicos (apenas em desenvolvimento)
                </summary>
                <div className="mt-3 space-y-2">
                  <div className="text-xs">
                    <strong className={EXTERNAL_COMPONENT_CLASSES.errorText}>Erro:</strong>
                    <pre className={`mt-1 p-2 rounded overflow-x-auto ${EXTERNAL_COMPONENT_CLASSES.errorBg} ${EXTERNAL_COMPONENT_CLASSES.errorText}`}>
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div className="text-xs">
                      <strong className={EXTERNAL_COMPONENT_CLASSES.errorText}>Stack trace:</strong>
                      <pre className={`mt-1 p-2 rounded overflow-x-auto max-h-48 overflow-y-auto ${EXTERNAL_COMPONENT_CLASSES.errorBg} ${EXTERNAL_COMPONENT_CLASSES.errorText}`}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-primary-800 text-primary-800 rounded-lg font-medium hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <RefreshCw size={20} className="mr-2" />
                Tentar novamente
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-800 text-white rounded-lg font-medium hover:bg-primary-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Home size={20} className="mr-2" />
                Voltar à Home
              </button>
            </div>

            {/* Información de contacto */}
            <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm text-neutral-600">
                Se o problema persistir, entre em contato conosco:
              </p>
              <a
                href="mailto:contato@seuescritorio.com.br"
                className="text-sm text-primary-700 hover:text-primary-900 hover:underline transition-colors"
              >
                contato@seuescritorio.com.br
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
