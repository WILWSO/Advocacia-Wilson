import { Variants } from 'framer-motion';

/**
 * Variante de animación fade in con movimiento vertical
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * Variante de animación fade in sin movimiento
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

/**
 * Variante de contenedor con stagger para animar hijos secuencialmente
 */
export const containerVariants = (staggerDelay: number = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay
    }
  }
});

/**
 * Variante de item para usar dentro de containerVariants
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

/**
 * Props comunes para motion components con scroll trigger
 */
export const scrollTriggerProps = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-100px" }
};

/**
 * Transición estándar
 */
export const standardTransition = { duration: 0.6 };

/**
 * Transición con delay
 */
export const delayedTransition = (delay: number) => ({ 
  duration: 0.6, 
  delay 
});
