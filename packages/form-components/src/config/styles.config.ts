/**
 * Field Style Configuration
 * Single Source of Truth for form component styling with Tailwind CSS
 */

/**
 * Field validation states
 */
export type ValidationState = 'default' | 'valid' | 'invalid' | 'disabled';

/**
 * Field size variants
 */
export type FieldSize = 'sm' | 'md' | 'lg';

/**
 * Responsive breakpoints following Tailwind defaults
 */
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Field style configuration by component part
 */
export interface FieldStyleConfig {
  /** Container wrapper styles */
  container: string;
  /** Label styles */
  label: string;
  /** Input base styles */
  input: string;
  /** Input state styles */
  inputStates: Record<ValidationState, string>;
  /** Input size variants */
  inputSizes: Record<FieldSize, string>;
  /** Error message styles */
  error: string;
  /** Help text styles */
  help: string;
  /** Required indicator styles */
  required: string;
}

/**
 * Default Tailwind CSS styles for form fields
 * These provide a consistent, responsive design out of the box
 */
export const DEFAULT_FIELD_STYLES: FieldStyleConfig = {
  container: 'w-full mb-4',
  
  label: [
    'block',
    'text-sm',
    'font-medium',
    'text-gray-700',
    'dark:text-gray-300',
    'mb-1.5',
    'transition-colors',
    'duration-200',
  ].join(' '),
  
  input: [
    // Base styles
    'w-full',
    'px-3',
    'py-2',
    'rounded-md',
    'border',
    'border-gray-300',
    'dark:border-gray-600',
    'bg-white',
    'dark:bg-gray-800',
    'text-gray-900',
    'dark:text-gray-100',
    'placeholder-gray-400',
    'dark:placeholder-gray-500',
    
    // Focus styles
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:border-blue-500',
    'dark:focus:ring-blue-400',
    'dark:focus:border-blue-400',
    
    // Transitions
    'transition-all',
    'duration-200',
    
    // Typography
    'text-sm',
    'leading-tight',
    
    // Responsive
    'sm:text-base',
  ].join(' '),
  
  inputStates: {
    default: '',
    valid: [
      'border-green-500',
      'dark:border-green-400',
      'focus:ring-green-500',
      'focus:border-green-500',
      'dark:focus:ring-green-400',
      'dark:focus:border-green-400',
    ].join(' '),
    invalid: [
      'border-red-500',
      'dark:border-red-400',
      'focus:ring-red-500',
      'focus:border-red-500',
      'dark:focus:ring-red-400',
      'dark:focus:border-red-400',
      'bg-red-50',
      'dark:bg-red-900/10',
    ].join(' '),
    disabled: [
      'bg-gray-100',
      'dark:bg-gray-700',
      'text-gray-500',
      'dark:text-gray-400',
      'cursor-not-allowed',
      'opacity-60',
    ].join(' '),
  },
  
  inputSizes: {
    sm: 'px-2 py-1 text-xs sm:text-sm',
    md: 'px-3 py-2 text-sm sm:text-base',
    lg: 'px-4 py-3 text-base sm:text-lg',
  },
  
  error: [
    'block',
    'mt-1.5',
    'text-xs',
    'sm:text-sm',
    'text-red-600',
    'dark:text-red-400',
    'font-medium',
    'animate-fade-in',
  ].join(' '),
  
  help: [
    'block',
    'mt-1',
    'text-xs',
    'sm:text-sm',
    'text-gray-500',
    'dark:text-gray-400',
  ].join(' '),
  
  required: [
    'text-red-500',
    'dark:text-red-400',
    'ml-1',
    'font-medium',
  ].join(' '),
};

/**
 * Modal style configuration
 */
export interface ModalStyleConfig {
  overlay: string;
  container: string;
  header: string;
  body: string;
  footer: string;
}

export const DEFAULT_MODAL_STYLES: ModalStyleConfig = {
  overlay: [
    'fixed',
    'inset-0',
    'z-50',
    'bg-black/50',
    'dark:bg-black/70',
    'backdrop-blur-sm',
    'animate-fade-in',
  ].join(' '),
  
  container: [
    'fixed',
    'inset-0',
    'z-50',
    'flex',
    'items-center',
    'justify-center',
    'p-4',
    'sm:p-6',
    'md:p-8',
  ].join(' '),
  
  header: [
    'flex',
    'items-center',
    'justify-between',
    'px-6',
    'py-4',
    'border-b',
    'border-gray-200',
    'dark:border-gray-700',
  ].join(' '),
  
  body: [
    'px-6',
    'py-4',
    'max-h-[60vh]',
    'overflow-y-auto',
  ].join(' '),
  
  footer: [
    'flex',
    'items-center',
    'justify-end',
    'gap-3',
    'px-6',
    'py-4',
    'border-t',
    'border-gray-200',
    'dark:border-gray-700',
    'bg-gray-50',
    'dark:bg-gray-800',
  ].join(' '),
};

/**
 * Notification/Toast style configuration
 */
export interface NotificationStyleConfig {
  container: string;
  variants: Record<'info' | 'success' | 'warning' | 'error', string>;
  icon: string;
  message: string;
  closeButton: string;
}

export const DEFAULT_NOTIFICATION_STYLES: NotificationStyleConfig = {
  container: [
    'flex',
    'items-start',
    'gap-3',
    'p-4',
    'rounded-lg',
    'shadow-lg',
    'border',
    'max-w-md',
    'animate-slide-in',
  ].join(' '),
  
  variants: {
    info: [
      'bg-blue-50',
      'dark:bg-blue-900/20',
      'border-blue-200',
      'dark:border-blue-800',
      'text-blue-800',
      'dark:text-blue-200',
    ].join(' '),
    success: [
      'bg-green-50',
      'dark:bg-green-900/20',
      'border-green-200',
      'dark:border-green-800',
      'text-green-800',
      'dark:text-green-200',
    ].join(' '),
    warning: [
      'bg-yellow-50',
      'dark:bg-yellow-900/20',
      'border-yellow-200',
      'dark:border-yellow-800',
      'text-yellow-800',
      'dark:text-yellow-200',
    ].join(' '),
    error: [
      'bg-red-50',
      'dark:bg-red-900/20',
      'border-red-200',
      'dark:border-red-800',
      'text-red-800',
      'dark:text-red-200',
    ].join(' '),
  },
  
  icon: 'flex-shrink-0 w-5 h-5',
  
  message: 'flex-1 text-sm font-medium',
  
  closeButton: [
    'flex-shrink-0',
    'p-1',
    'rounded',
    'hover:bg-black/10',
    'dark:hover:bg-white/10',
    'transition-colors',
    'duration-200',
  ].join(' '),
};

/**
 * Form style configuration
 */
export interface FormStyleConfig {
  container: string;
  header: string;
  body: string;
  footer: string;
  submitButton: string;
  cancelButton: string;
}

export const DEFAULT_FORM_STYLES: FormStyleConfig = {
  container: [
    'w-full',
    'bg-white',
    'dark:bg-gray-900',
    'rounded-lg',
    'shadow-md',
    'border',
    'border-gray-200',
    'dark:border-gray-700',
  ].join(' '),
  
  header: [
    'px-6',
    'py-4',
    'border-b',
    'border-gray-200',
    'dark:border-gray-700',
  ].join(' '),
  
  body: [
    'px-6',
    'py-6',
    'space-y-4',
  ].join(' '),
  
  footer: [
    'flex',
    'items-center',
    'justify-end',
    'gap-3',
    'px-6',
    'py-4',
    'border-t',
    'border-gray-200',
    'dark:border-gray-700',
    'bg-gray-50',
    'dark:bg-gray-800',
  ].join(' '),
  
  submitButton: [
    'px-4',
    'py-2',
    'text-sm',
    'font-medium',
    'text-white',
    'bg-blue-600',
    'hover:bg-blue-700',
    'dark:bg-blue-500',
    'dark:hover:bg-blue-600',
    'rounded-md',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-offset-2',
    'dark:focus:ring-offset-gray-900',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'transition-colors',
    'duration-200',
  ].join(' '),
  
  cancelButton: [
    'px-4',
    'py-2',
    'text-sm',
    'font-medium',
    'text-gray-700',
    'dark:text-gray-300',
    'bg-white',
    'dark:bg-gray-800',
    'border',
    'border-gray-300',
    'dark:border-gray-600',
    'hover:bg-gray-50',
    'dark:hover:bg-gray-700',
    'rounded-md',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-gray-500',
    'focus:ring-offset-2',
    'dark:focus:ring-offset-gray-900',
    'transition-colors',
    'duration-200',
  ].join(' '),
};
