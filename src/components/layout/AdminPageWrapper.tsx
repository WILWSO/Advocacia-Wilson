/**
 * Wrapper para páginas administrativas que centraliza:
 * - Verificación de autenticación y permisos
 * - Layout estandarizado
 * - Manejo de estados de carga y error
 * - Redirección automática para usuarios sin permisos
 * 
 * Implementa Single Source of Truth (SSoT) para lógica común de páginas administrativas
 */

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthLogin } from '../../components/auth/useAuthLogin';
import { usePermissions } from '../../hooks/auth/usePermissions';
import { AdminPageLayout } from './AdminPageLayout';
import { Loader2 } from 'lucide-react';

interface AdminPageWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  headerAction?: React.ReactNode;
  className?: string;
  maxWidth?: '7xl' | '6xl' | '5xl' | 'full';
  titleSize?: 'h1' | 'h2' | 'h3';
  descriptionSize?: 'sm' | 'base' | 'lg';
  /** Nivel de permiso mínimo requerido. Por defecto requiere canEdit */
  requiredPermission?: 'authenticated' | 'canEdit' | 'isAdmin';
  /** Página personalizada de redirección si no tiene permisos */
  fallbackPath?: string;
  /** Timeout para loading state (en ms) */
  loadingTimeout?: number;
}

/**
 * Wrapper que encapsula lógica común de páginas administrativas:
 * - Verificación de autenticación
 * - Verificación de permisos
 * - Layout estandarizado
 * - Estados de carga
 * - Redirección automática
 */
export const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({
  children,
  title,
  description,
  headerAction,
  className,
  maxWidth = 'full',
  titleSize = 'h1',
  descriptionSize = 'sm',
  requiredPermission = 'canEdit',
  fallbackPath = '/login',
  loadingTimeout = 3000
}) => {
  const { isAuthenticated, user } = useAuthLogin();
  const { isAdmin, canEdit } = usePermissions();
  const [showLoading, setShowLoading] = useState(true);
  const [loadingExpired, setLoadingExpired] = useState(false);

  // Timeout para evitar loading infinito
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingExpired(true);
      setShowLoading(false);
    }, loadingTimeout);

    // Si la autenticación se resuelve antes del timeout, cancelar
    if (isAuthenticated !== undefined && user !== undefined) {
      clearTimeout(timer);
      setShowLoading(false);
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, loadingTimeout]);

  // Mostrar loading solo si no ha expirado y no tenemos información de auth
  if (showLoading && !loadingExpired && (isAuthenticated === undefined || user === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-primary-600" />
          <p className="text-neutral-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Verificar permisos
  const hasPermission = (() => {
    switch (requiredPermission) {
      case 'authenticated':
        return isAuthenticated;
      case 'canEdit':
        return canEdit;
      case 'isAdmin':
        return isAdmin;
      default:
        return isAuthenticated;
    }
  })();

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">Acesso Restrito</h1>
          <p className="text-neutral-600 mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Render page with layout
  return (
    <AdminPageLayout
      title={title}
      description={description}
      headerAction={headerAction}
      className={className}
      maxWidth={maxWidth}
      titleSize={titleSize}
      descriptionSize={descriptionSize}
    >
      {children}
    </AdminPageLayout>
  );
};