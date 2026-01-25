import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      className={`
        absolute left-[-9999px] top-4 z-[9999] px-4 py-2 
        bg-primary-900 text-white rounded text-sm font-medium
        focus:left-4 focus:outline-none focus:ring-2 focus:ring-gold-500
        transition-all duration-200
        ${className}
      `}
      tabIndex={0}
    >
      {children}
    </a>
  );
};

const SkipLinks: React.FC = () => {
  return (
    <nav aria-label="Links de navegação rápida" role="navigation">
      <SkipLink href="#main-content">
        Pular para o conteúdo principal
      </SkipLink>
      <SkipLink href="#main-navigation">
        Pular para a navegação
      </SkipLink>
      <SkipLink href="#footer">
        Pular para o rodapé
      </SkipLink>
      <SkipLink href="#contact-form">
        Pular para o formulário de contato
      </SkipLink>
    </nav>
  );
};

export { SkipLink, SkipLinks };
export default SkipLinks;