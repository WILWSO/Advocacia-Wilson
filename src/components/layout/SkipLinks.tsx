import React from 'react';
import { UI_LAYOUT } from '../../config/messages';
import { COMMON_BUTTON_COLORS } from '../../config/theme';
import { cn } from '../../utils/cn';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      className={cn(
        "absolute left-[-9999px] top-4 z-[9999] px-4 py-2 rounded text-sm font-medium transition-all duration-200",
        "focus:left-4 focus:outline-none focus:ring-2 focus:ring-offset-2",
        COMMON_BUTTON_COLORS.skipLink,
        COMMON_BUTTON_COLORS.skipLinkFocus,
        className
      )}
      tabIndex={0}
    >
      {children}
    </a>
  );
};

const SkipLinks: React.FC = () => {
  return (
    <nav aria-label={UI_LAYOUT.SKIP_LINKS.SKIP_NAV_LABEL} role="navigation">
      <SkipLink href="#main-content">
        {UI_LAYOUT.SKIP_LINKS.TO_MAIN_CONTENT}
      </SkipLink>
      <SkipLink href="#main-navigation">
        {UI_LAYOUT.SKIP_LINKS.TO_NAVIGATION}
      </SkipLink>
      <SkipLink href="#footer">
        {UI_LAYOUT.SKIP_LINKS.TO_FOOTER}
      </SkipLink>
    </nav>
  );
};

export { SkipLink, SkipLinks };
export default SkipLinks;