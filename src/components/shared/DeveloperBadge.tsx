import React from 'react';
import { cn } from '../../utils/cn';

interface DeveloperBadgeProps {
  className?: string;
  logoClassName?: string;
  showText?: boolean;
}

/**
 * SSoT: Badge "Developed by WSOlutions" usado em Footer e MaintenanceScreen.
 * Fonte única para imagem e texto do desenvolvedor.
 */
const DeveloperBadge: React.FC<DeveloperBadgeProps> = ({
  className,
  logoClassName,
  showText = true,
}) => (
  <div className={cn('flex items-center gap-2', className)}>
    {showText && (
      <span className="text-neutral-400 text-xs">Developed by</span>
    )}
    <img
      src="/Logo_WSOlutions.jpg"
      alt="WSOlutions"
      className={cn(
        'h-6 object-contain rounded-sm hover:scale-110 transition-transform duration-300',
        logoClassName
      )}
    />
  </div>
);

export default DeveloperBadge;
