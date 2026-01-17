import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, Users, Scale, Briefcase, Share2, Phone } from 'lucide-react';
import Logo from '../shared/Logo';
import LoginButton from '../auth/LoginButton';
import { cn } from '../../utils/cn';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Detectar si estamos en el dashboard o áreas administrativas
  const isAdminArea = location.pathname.startsWith('/admin');
  const isSocialPage = location.pathname === '/social';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Cerrar menú con ESC y manejar clicks fuera
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative px-2 py-2 text-sm font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gold-600 after:transition-transform hover:after:scale-x-100 ${
    isAdminArea || isSocialPage || isScrolled 
      ? (isActive ? 'text-primary-800 after:scale-x-100' : 'text-primary-800') 
      : (isActive ? 'text-white after:scale-x-100' : 'text-white')
   }`; //TEXTOS DO MENU
   return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-custom py-2' : 'bg-transparent py-4' 
      }`} //TEXTOS DO MENU -
      role="banner"
    >
      <div className="container mx-auto px-4">
        {/* Main header with logo and navigation */}
        <div className="flex items-center justify-between"> 
          <Link to="/" className="flex items-center" aria-label="Ir para página inicial">
            <Logo className="h-10 md:h-12" priority={true} />
          </Link>

          {/* Desktop Navigation */}
          {!isAdminArea && (
            <nav id="main-navigation" className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Navegação principal">
              <NavLink to="/" className={navLinkClasses} aria-label="Página inicial">
                Home
              </NavLink>
              <NavLink to="/sobre" className={navLinkClasses} aria-label="Sobre o escritório">
                Sobre
              </NavLink>
              <NavLink to="/areas-de-atuacao" className={navLinkClasses} aria-label="Áreas de atuação jurídica">
                Áreas de Atuação
              </NavLink>
              <NavLink to="/equipe" className={navLinkClasses} aria-label="Conheça nossa equipe">
                Equipe
              </NavLink>
              <NavLink to="/social" className={navLinkClasses} aria-label="Notícias e conteúdos">
                Social
              </NavLink>
              <NavLink to="/contato" className={navLinkClasses} aria-label="Entre em contato conosco">
                Contato
              </NavLink>
              <Link
                to="/contato"
                className="px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors"
                aria-label="Agendar consulta jurídica"
              >
                Consulta
              </Link>
              <LoginButton />
            </nav>
          )}

          {/* Dashboard Navigation - Logo e navegação administrativa */}
          {isAdminArea && (
            <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Navegação administrativa">
              <NavLink 
                to="/admin/clientes" 
                className={({ isActive }) => cn(
                  navLinkClasses({ isActive }),
                  "flex items-center gap-2"
                )}
                aria-label="Gestão de clientes"
              >
                Clientes
              </NavLink>
              <NavLink 
                to="/admin/usuarios" 
                className={({ isActive }) => cn(
                  navLinkClasses({ isActive }),
                  "flex items-center gap-2"
                )}
                aria-label="Gestão de usuários"
              >
                Usuários
              </NavLink>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => cn(
                  navLinkClasses({ isActive }),
                  "flex items-center gap-2"
                )}
                aria-label="Dashboard principal"
              >
                Processos
              </NavLink>
              <NavLink 
                to="/admin-social" 
                className={({ isActive }) => cn(
                  navLinkClasses({ isActive }),
                  "flex items-center gap-2"
                )}
                aria-label="Administrar conteúdo social"
              >
                Social
              </NavLink>
              <LoginButton />
            </nav>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <LoginButton />
            {!isAdminArea && (
              <button
                ref={buttonRef}
                className={cn(
                  "ml-4 p-2 rounded-lg transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2",
                  "hover:bg-white/10 active:scale-95",
                  "w-10 h-10 flex items-center justify-center"
                )}
                onClick={() => {
                  setIsMenuAnimating(true);
                  setMobileMenuOpen(!mobileMenuOpen);
                  setTimeout(() => setIsMenuAnimating(false), 300);
                }}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              >
                {/* Ícone hamburguesa animado */}
                <div className="w-6 h-5 flex flex-col justify-between relative">
                  <motion.span
                    animate={mobileMenuOpen ? {
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
                    animate={mobileMenuOpen ? {
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
                    animate={mobileMenuOpen ? {
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
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && !isAdminArea && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Logo className="h-8" priority={true} />
                </Link>
                <button
                  className="p-2 text-neutral-500 hover:text-primary-800 hover:bg-neutral-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
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
                {[
                  { to: '/', label: 'Home', icon: Home },
                  { to: '/sobre', label: 'Sobre', icon: Users },
                  { to: '/areas-de-atuacao', label: 'Áreas de Atuação', icon: Scale },
                  { to: '/equipe', label: 'Equipe', icon: Briefcase },
                  { to: '/social', label: 'Social', icon: Share2 },
                  { to: '/contato', label: 'Contato', icon: Phone }
                ].map((link) => (
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
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <link.icon size={20} className="mr-3 text-current" aria-hidden="true" />
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
              <div className="px-6 pb-6">
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
                    onClick={() => setMobileMenuOpen(false)}
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
    </header>
  );
};

export default Header;