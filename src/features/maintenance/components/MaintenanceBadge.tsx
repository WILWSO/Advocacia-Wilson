/**
 * Maintenance Badge Component
 * 
 * Visual indicator shown to developers when accessing app during maintenance
 * @module features/maintenance/components
 */

import React from 'react';
import { MAINTENANCE_CONFIG } from '../config/maintenance.config';
import type { MaintenanceBadgeProps } from '../types/maintenance.types';

/**
 * Position classes for badge placement
 */
const POSITION_CLASSES = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
} as const;

/**
 * MaintenanceBadge Component
 * 
 * Shows a floating badge to indicate developer is accessing app during maintenance.
 * Helps developers remember they're in maintenance mode while regular users are blocked.
 * 
 * @component
 * @example
 * ```tsx
 * // Show badge in top-right corner
 * <MaintenanceBadge position="top-right" />
 * ```
 * 
 * @example
 * ```tsx
 * // Custom badge with animation
 * <MaintenanceBadge 
 *   position="bottom-right"
 *   text="Dev Mode Active"
 *   animated={true}
 * />
 * ```
 */
export const MaintenanceBadge: React.FC<MaintenanceBadgeProps> = ({
  position = MAINTENANCE_CONFIG.DEV_BADGE.POSITION,
  text = MAINTENANCE_CONFIG.DEV_BADGE.TEXT,
  animated = MAINTENANCE_CONFIG.DEV_BADGE.ANIMATED,
  className = '',
}) => {
  const positionClass = POSITION_CLASSES[position];

  return (
    <div 
      className={`fixed ${positionClass} z-50 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        {/* Pulse animation background (optional) */}
        {animated && (
          <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-75 animate-ping" />
        )}
        
        {/* Badge content */}
        <div className="relative bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full shadow-lg border-2 border-yellow-500 font-medium text-sm whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-yellow-900 rounded-full" />
            <span>{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
