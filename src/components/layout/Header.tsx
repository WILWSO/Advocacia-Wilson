import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, ChevronDown, User, LogOut } from 'lucide-react';
import Logo from '../shared/Logo';
import AuthLogin from '../auth/AuthLogin.tsx';
import { cn } from '../../utils/cn';
import { publicNavLinks, adminNavLinks, pageDropdownItems, pageSectionsDropdownItems } from '../home/NavBar';
import { DropdownMenu } from '../shared/DropdownMenu';
import { HamburgerButton } from './mobile/HamburgerButton';
import { MobileMenu } from './mobile/MobileMenu';
import { useHeader } from '../../hooks/ui/useHeader';
import { useAuthLogin } from '../auth/useAuthLogin';
import { useFeaturedPosts } from '../../hooks/features/useFeaturedPosts';
import { useMemo, useState } from 'react';
import { getUserDisplayName } from '../../utils/authHelpers';
import { getRoleBadgeColor, getRoleLabel } from '../../utils/roleHelpers';

// UN SOLO componente Header.tsx que muestra DOS menús diferentes dependiendo de dónde estés:

//Menú Público (página inicial y páginas públicas):

//Links: Início, Equipe, Página (dropdown), Áreas, Contato
//Botón "Consulta"
//Botón "Dashboard" (si está autenticado)
//AuthLogin
//Menú Administrativo (cuando estás en /admin/*):

//Links diferentes para administración
//AuthLogin
//El mismo componente detecta con location.pathname.startsWith('/admin') en qué área estás y muestra el menú correspondiente.

const Header = () => {
  const {
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    menuRef,
    buttonRef,
    location
  } = useHeader();

  const { isAuthenticated, user, logout } = useAuthLogin();
  const { hasFeaturedPosts } = useFeaturedPosts();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    logout();
    setShowUserMenu(false);
  };

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
    `relative px-1 lg:px-2 py-2 text-xs lg:text-sm font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gold-600 after:transition-transform hover:after:scale-x-100 ${
    isAdminArea || isSocialPage || isScrolled 
      ? (isActive ? 'text-primary-800 after:scale-x-100' : 'text-primary-800') 
      : (isActive ? 'text-white after:scale-x-100' : 'text-white')
   }`; //TEXTOS DO MENU
   return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full",
        // Mobile (< 768px): SIEMPRE estático
        "bg-white shadow-custom py-3",
        // Tablet y Desktop (≥ 768px): comportamiento dinámico solo para home
        isAdminArea || isSocialPage
          ? "md:bg-white md:shadow-custom md:py-2"
          : isScrolled 
            ? "md:bg-white md:shadow-custom md:py-2"
            : "md:bg-transparent md:shadow-none md:py-4",
        // Transición SOLO en tablet/desktop
        "md:transition-[background-color,box-shadow] md:duration-300"
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Main header with logo and navigation */}
        <div className="flex items-center justify-between gap-3"> 
          <Link to="/" className="flex items-center flex-shrink-0" aria-label="Ir para página inicial">
            <Logo className="h-10 md:h-11 lg:h-12" priority={true} />
          </Link>

          {/* Desktop Navigation */}
          {!isAdminArea && (
            <nav id="main-navigation" className="hidden md:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6" role="navigation" aria-label="Navegação principal">
              {/* Tablet: Dropdown compacto (640px - 1024px) */}
              <div className="md:block xl:hidden">
                <DropdownMenu 
                  label="Página"
                  items={filteredPageDropdownItems}
                  isScrolled={isScrolled || isSocialPage}
                />
              </div>
              
              {/* Desktop: Links expandidos + Dropdown de secciones (>= 1024px) */}
              <div className="hidden xl:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6">
                {publicNavLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      cn(
                        "relative px-1 xl:px-2 py-2 text-xs xl:text-sm font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gold-600 after:transition-transform hover:after:scale-x-100",
                        isActive
                          ? isScrolled || isSocialPage
                            ? "text-primary-800 after:scale-x-100"
                            : "text-gold-400 after:scale-x-100"
                          : isScrolled || isSocialPage
                          ? "text-gray-700 hover:text-primary-800"
                          : "text-white hover:text-gold-400"
                      )
                    }
                    aria-label={link.ariaLabel}
                  >
                    {link.label}
                  </NavLink>
                ))}
                
                {/* Dropdown con solo secciones del home */}
                <DropdownMenu 
                  label="Página"
                  items={pageSectionsDropdownItems}
                  isScrolled={isScrolled || isSocialPage}
                />
              </div>
              
              {/* Botones de acción */}
              <Link
                to="/contato"
                className="px-3 xl:px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors whitespace-nowrap"
                aria-label="Agendar consulta jurídica"
              >
                Consulta
              </Link>
              
              {/* Usuario autenticado: Dropdown con Dashboard y Logout */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={cn(
                      "flex items-center gap-2 px-3 lg:px-4 py-2 rounded text-sm font-medium transition-colors",
                      isScrolled || isSocialPage
                        ? "bg-gold-100 text-primary-800 hover:bg-gold-200"
                        : "bg-gold-500/20 text-white hover:bg-gold-500/30"
                    )}
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <User size={16} />
                    <span className="hidden lg:inline">{getUserDisplayName(user)}</span>
                    <ChevronDown size={16} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {user.nome_completo || getUserDisplayName(user)}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                          {user.role && (
                            <span className={cn(
                              "inline-block mt-2 text-xs px-2 py-1 rounded-full border font-medium",
                              getRoleBadgeColor(user.role)
                            )}>
                              {getRoleLabel(user.role)}
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                        </div>

                        <div className="border-t border-gray-200 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} />
                            Sair
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <AuthLogin />
              )}
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
              <AuthLogin />
            </nav>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Usuario autenticado en móvil: Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 bg-gold-100 text-primary-800 hover:bg-gold-200 rounded-lg transition-colors"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.nome_completo?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user.nome_completo || getUserDisplayName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.role && (
                          <span className={cn(
                            "inline-block mt-2 text-xs px-2 py-1 rounded-full border font-medium",
                            getRoleBadgeColor(user.role)
                          )}>
                            {getRoleLabel(user.role)}
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                      </div>

                      <div className="border-t border-gray-200 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <AuthLogin />
            )}
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