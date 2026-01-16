import React from 'react';

interface ScreenReaderTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente para texto que só será lido por screen readers
 * Útil para informações contextuais adicionais
 */
const ScreenReaderText: React.FC<ScreenReaderTextProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <span className={`sr-only ${className}`}>
      {children}
    </span>
  );
};

/**
 * Componente para criar uma descrição mais rica para screen readers
 */
interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  as: Component = 'span',
  className = ''
}) => {
  return (
    <Component 
      className={`
        absolute w-px h-px p-0 -m-px overflow-hidden 
        whitespace-nowrap border-0 clip-rect-0 ${className}
      `}
    >
      {children}
    </Component>
  );
};

/**
 * Componente para anúncios dinâmicos em screen readers
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  className = ''
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  );
};

export { ScreenReaderText, VisuallyHidden, LiveRegion };
export default ScreenReaderText;