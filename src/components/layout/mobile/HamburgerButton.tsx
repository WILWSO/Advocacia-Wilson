import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isScrolled: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const HamburgerButton = ({ isOpen, onClick, isScrolled, buttonRef }: HamburgerButtonProps) => {
  // En mobile siempre hay fondo blanco, así que siempre usamos colores oscuros
  // En desktop, depende de isScrolled
  const isDarkBackground = false; // Nunca fondo oscuro porque mobile siempre es blanco y desktop varía
  const barColor = 'rgb(17, 24, 39)'; // Siempre oscuro para contrastar con fondo blanco
  
  return (
    <button
      ref={buttonRef}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2",
        "hover:bg-primary-50 active:scale-95",
        "min-w-[44px] min-h-[44px] flex items-center justify-center",
        "touch-manipulation"
      )}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
      aria-label={isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
    >
      {/* Ícone hamburguesa animado */}
      <div className="w-6 h-5 flex flex-col justify-between relative">
        <motion.span
          animate={isOpen ? {
            rotate: 45,
            y: 8,
            backgroundColor: barColor
          } : {
            rotate: 0,
            y: 0,
            backgroundColor: barColor
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-0.5 rounded-full origin-center"
        />
        <motion.span
          animate={isOpen ? {
            opacity: 0,
            x: -20
          } : {
            opacity: 1,
            x: 0
          }}
          transition={{ duration: 0.2 }}
          className="w-full h-0.5 rounded-full bg-primary-800"
        />
        <motion.span
          animate={isOpen ? {
            rotate: -45,
            y: -8,
            backgroundColor: barColor
          } : {
            rotate: 0,
            y: 0,
            backgroundColor: barColor
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-0.5 rounded-full origin-center"
        />
      </div>
    </button>
  );
};
