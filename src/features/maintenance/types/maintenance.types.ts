/**
 * Maintenance Mode Types
 * 
 * Type definitions for maintenance mode feature
 * @module features/maintenance/types
 */

/**
 * Maintenance mode status
 */
export interface MaintenanceMode {
  /** Whether maintenance mode is currently active */
  isActive: boolean;
  /** List of whitelisted developer emails */
  devEmails: string[];
}

/**
 * Props for MaintenanceScreen component
 */
export interface MaintenanceScreenProps {
  /** Custom title for maintenance screen */
  title?: string;
  /** Custom message to display */
  message?: string;
  /** Estimated time for maintenance completion */
  estimatedTime?: string;
  /** Contact email for urgent matters */
  contactEmail?: string;
  /** Optional logo URL to display */
  logoUrl?: string;
  /** Show animated icon */
  showIcon?: boolean;
  /** Show estimated time section */
  showEstimatedTime?: boolean;
  /** Show contact information */
  showContact?: boolean;
}

/**
 * Props for MaintenanceGuard component
 */
export interface MaintenanceGuardProps {
  /** Application content to render when maintenance is off or user is dev */
  children: React.ReactNode;
  /** Optional custom loading component */
  loadingComponent?: React.ReactNode;
  /** Optional custom maintenance screen */
  maintenanceScreen?: React.ReactNode;
}

/**
 * Props for MaintenanceBadge component
 */
export interface MaintenanceBadgeProps {
  /** Position of the badge */
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right';
  /** Custom text for the badge */
  text?: string;
  /** Show pulse animation */
  animated?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Return type for useMaintenanceMode hook
 */
export interface UseMaintenanceModeReturn {
  /** Whether maintenance mode is currently active */
  isMaintenanceMode: boolean;
  /** Whether current user has dev access */
  isDevAccess: boolean;
  /** Whether the hook is still loading */
  isLoading: boolean;
  /** Array of whitelisted dev emails (for debugging, do not expose in production) */
  devEmails: string[];
}

/**
 * Maintenance status info for debugging
 */
export interface MaintenanceStatus {
  /** Whether maintenance mode is active */
  isActive: boolean;
  /** Number of whitelisted dev emails */
  devEmailsCount: number;
  /** Timestamp when status was checked */
  timestamp: string;
}
