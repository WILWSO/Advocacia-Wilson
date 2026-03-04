/**
 * Maintenance Mode Feature - Public API
 * 
 * Centralized exports for maintenance mode feature
 * @module features/maintenance
 */

// Components
export { MaintenanceGuard } from './components/MaintenanceGuard';
export { MaintenanceScreen } from './components/MaintenanceScreen';
export { MaintenanceBadge } from './components/MaintenanceBadge';

// Hooks
export { useMaintenanceMode } from './hooks/useMaintenanceMode';

// Types
export type {
  MaintenanceMode,
  MaintenanceScreenProps,
  MaintenanceGuardProps,
  MaintenanceBadgeProps,
  UseMaintenanceModeReturn,
  MaintenanceStatus,
} from './types/maintenance.types';

// Config
export { MAINTENANCE_CONFIG } from './config/maintenance.config';

// Utils (for advanced usage)
export {
  isMaintenanceModeActive,
  parseDevEmails,
  hasDevAccess,
  getMaintenanceStatus,
  validateMaintenanceConfig,
  logMaintenanceStatus,
} from './utils/checkMaintenanceAccess';
