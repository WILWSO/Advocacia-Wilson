/**
 * Maintenance Screen Component
 * 
 * Full-screen UI shown to users when system is under maintenance
 * @module features/maintenance/components
 */

import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthLogin } from '../../../components/auth/useAuthLogin';
import { MAINTENANCE_CONFIG } from '../config/maintenance.config';
import type { MaintenanceScreenProps } from '../types/maintenance.types';

/**
 * MaintenanceScreen Component
 * 
 * Displays an elegant full-screen maintenance message
 * with optional customization via props
 * 
 * @component
 * @example
 * ```tsx
 * <MaintenanceScreen 
 *   title="Sistema en Mantenimiento"
 *   message="Volveremos pronto"
 *   estimatedTime="30 minutos"
 *   contactEmail="support@example.com"
 * />
 * ```
 */
export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  title = MAINTENANCE_CONFIG.MESSAGES.TITLE,
  message = MAINTENANCE_CONFIG.MESSAGES.MESSAGE,
  estimatedTime = MAINTENANCE_CONFIG.MESSAGES.ESTIMATED_TIME,
  contactEmail = MAINTENANCE_CONFIG.MESSAGES.CONTACT_EMAIL,
  logoUrl,
  showIcon = MAINTENANCE_CONFIG.UI.SHOW_ICON,
  showEstimatedTime = MAINTENANCE_CONFIG.UI.SHOW_ESTIMATED_TIME,
  showContact = MAINTENANCE_CONFIG.UI.SHOW_CONTACT,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthLogin();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo or Icon */}
        {logoUrl ? (
          <div className="flex justify-center">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-20 w-auto"
            />
          </div>
        ) : showIcon && (
          <div className="flex justify-center">
            <div className="relative">
              <Settings 
                className="w-20 h-20 text-blue-600 animate-spin" 
                style={{ 
                  animationDuration: MAINTENANCE_CONFIG.UI.ANIMATION_DURATION 
                }}
              />
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50" />
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full" />
        </div>

        {/* Main Message */}
        <p className="text-lg text-gray-600 leading-relaxed">
          {message}
        </p>

        {/* Estimated Time */}
        {showEstimatedTime && estimatedTime && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Tiempo estimado
            </p>
            <p className="text-xl font-semibold text-blue-700">
              {estimatedTime}
            </p>
          </div>
        )}

        {/* Contact Information */}
        {showContact && contactEmail && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              ¿Necesitas ayuda urgente?
            </p>
            <a 
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              {contactEmail}
            </a>
          </div>
        )}

        {/* Logout Button (if user is authenticated) */}
        {user && (
          <div className="pt-6">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="pt-8">
          <p className="text-xs text-gray-500">
            Gracias por tu paciencia mientras mejoramos el sistema
          </p>
        </div>
      </div>
    </div>
  );
};
