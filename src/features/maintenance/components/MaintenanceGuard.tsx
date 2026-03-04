/**
 * Maintenance Guard Component
 * 
 * Wrapper component that conditionally renders application or maintenance screen
 * based on maintenance mode status and user access
 * @module features/maintenance/components
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMaintenanceMode } from '../hooks/useMaintenanceMode';
import { MaintenanceScreen } from './MaintenanceScreen';
import { MAINTENANCE_CONFIG } from '../config/maintenance.config';
import type { MaintenanceGuardProps } from '../types/maintenance.types';

/**
 * Default loading component shown while checking maintenance status
 */
const DefaultLoading: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      <p className="text-gray-600 font-medium">
        {MAINTENANCE_CONFIG.MESSAGES.LOADING}
      </p>
    </div>
  </div>
);

/**
 * MaintenanceGuard Component
 * 
 * Guards the application by checking maintenance mode status.
 * Shows maintenance screen to regular users when maintenance is active.
 * Allows developers to continue working during maintenance.
 * 
 * @component
 * @example
 * ```tsx
 * // In App.tsx
 * function App() {
 *   return (
 *     <MaintenanceGuard>
 *       <Router>
 *         <Routes>
 *           ...
 *         </Routes>
 *       </Router>
 *     </MaintenanceGuard>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // With custom components
 * function App() {
 *   return (
 *     <MaintenanceGuard
 *       loadingComponent={<CustomLoader />}
 *       maintenanceScreen={<CustomMaintenanceScreen />}
 *     >
 *       <Router>...</Router>
 *     </MaintenanceGuard>
 *   );
 * }
 * ```
 */
export const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({
  children,
  loadingComponent,
  maintenanceScreen,
}) => {
  const location = useLocation();
  const { isMaintenanceMode, isDevAccess, isLoading } = useMaintenanceMode();

  // Define public routes that are always accessible (even during maintenance)
  const isPublicRoute = 
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/nossa-historia' ||
    location.pathname === '/areas-de-atuacao' ||
    location.pathname === '/equipe' ||
    location.pathname === '/contato' ||
    location.pathname === '/social' ||
    location.pathname === '/demo-ssot' ||
    location.pathname.startsWith('*'); // 404 page

  // Always allow access to public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <>{loadingComponent || <DefaultLoading />}</>;
  }

  // If maintenance mode is OFF, render app normally
  if (!isMaintenanceMode) {
    return <>{children}</>;
  }

  // If maintenance mode is ON and user has dev access, render app
  if (isDevAccess) {
    return <>{children}</>;
  }

  // If maintenance mode is ON, user does NOT have dev access, and trying to access admin routes
  // Show maintenance screen
  return <>{maintenanceScreen || <MaintenanceScreen />}</>;
};
