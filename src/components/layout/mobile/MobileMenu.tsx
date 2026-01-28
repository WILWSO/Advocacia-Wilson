import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import Logo from '../../shared/Logo';
import { cn } from '../../../utils/cn';
import { publicNavLinks, pageDropdownItems } from '../../home/NavBar';
import { useFeaturedPosts } from '../../../hooks/features/useFeaturedPosts';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
}

export const MobileMenu = ({ isOpen, onClose, menuRef }: MobileMenuProps) => {
  const [paginaExpanded, setPaginaExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasFeaturedPosts } = useFeaturedPosts();

  // Filtrar items del dropdown basado en si hay posts destacados
  const filteredPageDropdownItems = useMemo(() => {
    return pageDropdownItems.filter(item => {
      if (item.href === '#social') {
        return hasFeaturedPosts;
      }
      return true;
    });
  }, [hasFeaturedPosts]);

  const handleSectionClick = (href: string) => {
    onClose();
    
    // Smooth scroll a sección
    if (href.startsWith('#')) {
      const isHome = location.pathname === '/';
      
      if (!isHome) {
        // Si no estamos en Home, navegar a Home con el hash
        navigate('/' + href);
      } else {
        // Si ya estamos en Home, hacer scroll instantáneo después de cerrar el menú
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo(0, offsetPosition);
          }
        }, 100);
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Menu Content */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 200,
              duration: 0.3 
            }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            id="mobile-navigation"
            role="navigation"
            aria-label="Navegação móvel"
          >
            {/* Header do Menu */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <Link 
                to="/" 
                className="flex items-center"
                aria-label="Ir para página inicial"
                onClick={onClose}
              >
                <Logo className="h-8" priority={true} />
              </Link>
              <button
                className="p-2 text-neutral-500 hover:text-primary-800 hover:bg-neutral-50 rounded-lg transition-colors"
                onClick={onClose}
                aria-label="Fechar menu"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-6 space-y-1">
              {publicNavLinks.slice(0, 2).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group",
                    "hover:bg-primary-50 hover:text-primary-800",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                    isActive 
                      ? 'bg-primary-100 text-primary-800 font-semibold' 
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                  onClick={onClose}
                >
                  <span className="flex items-center">
                    {link.icon && <link.icon size={20} className="mr-3 text-current" aria-hidden="true" />}
                    <span className="font-medium">{link.label}</span>
                  </span>
                  <ChevronRight 
                    size={16} 
                    className="text-neutral-400 group-hover:text-primary-600 transition-colors" 
                    aria-hidden="true"
                  />
                </NavLink>
              ))}

              {/* Dropdown "Página" */}
              <div className="space-y-1">
                <button
                  onClick={() => setPaginaExpanded(!paginaExpanded)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group hover:bg-primary-50 hover:text-primary-800 text-neutral-700"
                >
                  <span className="font-medium">Página</span>
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "text-neutral-400 group-hover:text-primary-600 transition-all",
                      paginaExpanded && "rotate-180"
                    )}
                  />
                </button>
                
                {paginaExpanded && (
                  <div className="pl-4 space-y-1">
                    {filteredPageDropdownItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSectionClick(item.href);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                      >
                        <span className="text-primary-600">{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {publicNavLinks.slice(2).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group",
                    "hover:bg-primary-50 hover:text-primary-800",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                    isActive 
                      ? 'bg-primary-100 text-primary-800 font-semibold' 
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                  onClick={onClose}
                >
                  <span className="flex items-center">
                    {link.icon && <link.icon size={20} className="mr-3 text-current" aria-hidden="true" />}
                    <span className="font-medium">{link.label}</span>
                  </span>
                  <ChevronRight 
                    size={16} 
                    className="text-neutral-400 group-hover:text-primary-600 transition-colors" 
                    aria-hidden="true"
                  />
                </NavLink>
              ))}
            </nav>

            {/* CTA Section */}
            <div className="px-6 pb-6 space-y-3">
              <div className="p-4 bg-gradient-to-br from-primary-50 to-gold-50 rounded-xl border border-primary-100">
                <h3 className="text-sm font-semibold text-primary-800 mb-2">
                  Precisa de ajuda jurídica?
                </h3>
                <p className="text-xs text-neutral-600 mb-3">
                  Agende sua consulta gratuita hoje mesmo
                </p>
                <Link
                  to="/contato"
                  className="block w-full px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white text-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={onClose}
                >
                  Agendar Consulta
                </Link>
              </div>
            </div>

            {/* Contact Info Footer */}
            <div className="px-6 pb-6 border-t border-neutral-100 pt-6">
              <div className="text-center">
                <p className="text-xs text-neutral-500 mb-2">
                  Santos & Nascimento Advogados
                </p>
                <p className="text-xs text-neutral-400">
                  Advocacia Integral • Palmas - TO
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
