/**
 * Loading Fallback Component
 * 
 * Componente optimizado para mostrar durante lazy loading de rutas.
 * Mantiene la estructura del layout para evitar CLS (Cumulative Layout Shift).
 */

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-800 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Texto */}
        <p className="text-primary-800 font-medium animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
};

/**
 * Loading Fallback minimalista para componentes pequeños
 */
export const ComponentLoader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
    </div>
  );
};
