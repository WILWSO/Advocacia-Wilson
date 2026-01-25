import React from 'react';

interface SkeletonCardProps {
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * Componente de carga skeleton reutilizable
 * Unifica implementaciones duplicadas en UsuariosPage y AdminDashboard
 */
const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse ${className}`}>
        {/* Header con título y badges */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          </div>
          <div className="flex flex-col gap-2 items-end ml-2">
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        
        {/* Descripción */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        {/* Info items */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
        
        {/* Botones */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  // variant === 'default'
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse ${className}`}>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
