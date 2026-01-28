import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthLogin } from './useAuthLogin';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: ('admin' | 'advogado' | 'assistente')[];
  redirectTo?: string;
}

/**
 * ProtectedRoute - Componente para proteger rutas que requieren autenticación
 * 
 * @param children - Componente a renderizar si está autenticado
 * @param requiredRoles - Array de roles permitidos (opcional, por defecto todos los autenticados)
 * @param redirectTo - Ruta de redirección si no está autenticado (por defecto /login)
 * 
 * Uso:
 * <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
 * <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
 */
export const ProtectedRoute = ({ 
  children, 
  requiredRoles,
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthLogin();
  const location = useLocation();

  useEffect(() => {
    // Verificar autenticación al montar el componente
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth]);

  // Mostrar loader mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary-800 mx-auto mb-4" />
          <p className="text-neutral-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    // Guardar la ruta intentada para redirigir después del login
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Verificar roles requeridos
  if (requiredRoles && requiredRoles.length > 0) {
    if (!user || !requiredRoles.includes(user.role)) {
      // Usuario autenticado pero sin permisos
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Acesso Negado
            </h2>
            <p className="text-neutral-600 mb-6">
              Você não tem permissão para acessar esta página.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-neutral-500">
                <strong>Sua função:</strong> {user?.role || 'Desconhecido'}
              </p>
              <p className="text-sm text-neutral-500">
                <strong>Funções necessárias:</strong> {requiredRoles.join(', ')}
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="mt-6 px-6 py-3 bg-primary-800 text-white rounded-lg font-medium hover:bg-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }
  }

  // Usuario autenticado y con permisos
  return <>{children}</>;
};

export default ProtectedRoute;
