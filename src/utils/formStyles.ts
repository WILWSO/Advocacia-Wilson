import { cn } from './cn';

export const getInputClasses = (hasError: boolean, isDisabled: boolean): string => {
  return cn(
    "w-full px-4 py-2 border rounded transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
    hasError ? 'border-red-300 bg-red-50' : 'border-neutral-300',
    isDisabled && 'opacity-50 cursor-not-allowed'
  );
};

export const getLabelClasses = (): string => {
  return "block text-sm font-medium text-neutral-700 mb-1";
};

export const getButtonClasses = (isSubmitting: boolean): string => {
  return cn(
    "w-full px-6 py-3 text-white rounded text-sm font-medium transition-all",
    "flex items-center justify-center",
    isSubmitting 
      ? 'bg-neutral-400 cursor-not-allowed' 
      : 'bg-primary-800 hover:bg-primary-900 active:transform active:scale-95'
  );
};
