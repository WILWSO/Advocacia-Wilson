import React from 'react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false, 
  loadingText = 'Carregando...',
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    active:scale-95
  `;

  const variantClasses = {
    primary: 'bg-primary-800 hover:bg-primary-900 text-white focus:ring-primary-500',
    secondary: 'bg-gold-600 hover:bg-gold-700 text-white focus:ring-gold-500',
    outline: 'border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white focus:ring-primary-500',
    ghost: 'text-primary-800 hover:bg-primary-50 focus:ring-primary-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const isDisabled = disabled || isLoading;
  const buttonText = isLoading ? loadingText : children;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={isLoading ? 'loading-state' : undefined}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Carregando"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {leftIcon && !isLoading && (
        <span className="mr-2" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span>{buttonText}</span>
      
      {rightIcon && !isLoading && (
        <span className="ml-2" aria-hidden="true">
          {rightIcon}
        </span>
      )}
      
      {isLoading && (
        <span id="loading-state" className="sr-only">
          Processando sua solicitação, por favor aguarde.
        </span>
      )}
    </button>
  );
};

export default AccessibleButton;