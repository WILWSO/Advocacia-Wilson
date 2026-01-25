import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isScrolled: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const HamburgerButton = ({ isOpen, onClick, isScrolled, buttonRef }: HamburgerButtonProps) => {
  return (
    <button
      ref={buttonRef}
      className={cn(
        "ml-4 p-2 rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2",
        "hover:bg-white/10 active:scale-95",
        "w-10 h-10 flex items-center justify-center"
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
            backgroundColor: isScrolled ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'
          } : {
            rotate: 0,
            y: 0,
            backgroundColor: isScrolled ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'
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
          className={cn(
            "w-full h-0.5 rounded-full",
            isScrolled ? 'bg-primary-800' : 'bg-white'
          )}
        />
        <motion.span
          animate={isOpen ? {
            rotate: -45,
            y: -8,
            backgroundColor: isScrolled ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'
          } : {
            rotate: 0,
            y: 0,
            backgroundColor: isScrolled ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-0.5 rounded-full origin-center"
        />
      </div>
    </button>
  );
};
