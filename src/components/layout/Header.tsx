import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import Logo from '../shared/Logo';
import AuthButton from '../auth/AuthButton';
import { cn } from '../../utils/cn';
import { publicNavLinks, adminNavLinks, pageDropdownItems } from '../home/NavBar';
import { DropdownMenu } from '../shared/DropdownMenu';
import { HamburgerButton } from './mobile/HamburgerButton';
import { MobileMenu } from './mobile/MobileMenu';
import { useHeader } from '../../hooks/useHeader';
import { useAuthStore } from '../auth/authStore';
import { useFeaturedPosts } from '../../hooks/useFeaturedPosts';
import { useMemo } from 'react';

const Header = () => {
  const {
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    menuRef,
    buttonRef,
    location
  } = useHeader();

  const { isAuthenticated } = useAuthStore();
  const { hasFeaturedPosts } = useFeaturedPosts();

  // Filtrar items del dropdown basado en si hay posts destacados
  const filteredPageDropdownItems = useMemo(() => {
    return pageDropdownItems.filter(item => {
      // Si es el item "Destaques", solo mostrarlo si hay posts destacados
      if (item.href === '#social') {
        return hasFeaturedPosts;
      }
      return true;
    });
  }, [hasFeaturedPosts]);

  // Detectar si estamos en el dashboard o áreas administrativas
  const isAdminArea = location.pathname.startsWith('/admin');
  const isSocialPage = location.pathname === '/social';

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
              {publicNavLinks.slice(0, 2).map((link) => (
                <NavLink 
                  key={link.to}
                  to={link.to} 
                  className={navLinkClasses} 
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </NavLink>
              ))}
              <DropdownMenu 
                label="Página"
                items={filteredPageDropdownItems}
                isScrolled={isScrolled || isSocialPage}
              />
              {publicNavLinks.slice(2).map((link) => (
                <NavLink 
                  key={link.to}
                  to={link.to} 
                  className={navLinkClasses} 
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/contato"
                className="px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors"
                aria-label="Agendar consulta jurídica"
              >
                Consulta
              </Link>
              {isAuthenticated && (
                <Link
                  to="/admin"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors",
                    isScrolled || isSocialPage
                      ? "bg-gold-600 hover:bg-gold-700 text-white"
                      : "bg-gold-500 hover:bg-gold-600 text-white"
                  )}
                  aria-label="Ir para dashboard administrativo"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
              )}
              <AuthButton />
            </nav>
          )}

          {/* Dashboard Navigation - Logo e navegação administrativa */}
          {isAdminArea && (
            <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Navegação administrativa">
              {adminNavLinks.map((link) => (
                <NavLink 
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => cn(
                    navLinkClasses({ isActive }),
                    "flex items-center gap-2"
                  )}
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </NavLink>
              ))}
              <AuthButton />
            </nav>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <AuthButton />
            {!isAdminArea && (
              <HamburgerButton
                isOpen={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                isScrolled={isScrolled}
                buttonRef={buttonRef}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {!isAdminArea && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          menuRef={menuRef}
        />
      )}
    </header>
  );
};

export default Header;