import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Hook para detectar el estado de la conexión a internet
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Componente que muestra un mensaje amigable cuando no hay conexión a internet
 */
export const OfflineNotification = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] pointer-events-none px-4 w-full max-w-md"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-2xl p-4 pointer-events-auto">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <WifiOff size={24} className="animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                  Ops! Sem conexão com a internet
                </h3>
                <p className="text-sm text-white/90">
                  Parece que você está offline. Que tal dar uma conferida na sua conexão? 
                  Enquanto isso, relaxa que já voltamos!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
