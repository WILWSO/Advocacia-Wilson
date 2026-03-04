/**
 * Maintenance Mode Hook
 * 
 * React hook for checking maintenance mode status and user access
 * @module features/maintenance/hooks
 */

import { useMemo } from 'react';
import { useAuthLogin } from '../../../components/auth/useAuthLogin';
import { 
  isMaintenanceModeActive, 
  parseDevEmails, 
  hasDevAccess 
} from '../utils/checkMaintenanceAccess';
import type { UseMaintenanceModeReturn } from '../types/maintenance.types';

/**
 * Hook for checking maintenance mode status
 * 
 * This hook determines:
 * - If maintenance mode is currently active
 * - If the current user has developer access
 * - Loading state while authentication is being checked
 * 
 * @returns {UseMaintenanceModeReturn} Maintenance mode status and user access info
 * 
 * @example
 * ```typescript
 * function MaintenanceGuard({ children }) {
 *   const { isMaintenanceMode, isDevAccess, isLoading } = useMaintenanceMode();
 * 
 *   if (isLoading) {
 *     return <LoadingScreen />;
 *   }
 * 
 *   if (isMaintenanceMode && !isDevAccess) {
 *     return <MaintenanceScreen />;
 *   }
 * 
 *   return <>{children}</>;
 * }
 * ```
 */
export function useMaintenanceMode(): UseMaintenanceModeReturn {
  // Get authentication state from Zustand store
  const { user, isLoading: authLoading } = useAuthLogin();

  // Check if maintenance mode is active (from ENV)
  const isMaintenanceMode = useMemo(() => {
    return isMaintenanceModeActive();
  }, []); // Only check once on mount, ENV doesn't change at runtime

  // Parse developer emails from ENV
  const devEmails = useMemo(() => {
    return parseDevEmails();
  }, []); // Only parse once on mount, ENV doesn't change at runtime

  // Check if current user has developer access
  const isDevAccess = useMemo(() => {
    if (!user || !user.email) {
      return false;
    }

    return hasDevAccess(user.email);
  }, [user]); // Recheck when user changes

  return {
    isMaintenanceMode,
    isDevAccess,
    isLoading: authLoading,
    devEmails, // Include for debugging (use carefully in production)
  };
}
