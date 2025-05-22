import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../shared/Logo';
import LoginButton from '../auth/LoginButton';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative px-2 py-2 text-sm font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gold-600 after:transition-transform hover:after:scale-x-100 ${
    isActive ? 'text-primary-300 after:scale-x-100' : isScrolled ? 'text-primary-800' : 'text-white' 
   }`; //TEXTOS DO MENU
   return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-custom py-2' : 'bg-transparent py-4' 
      }`} //TEXTOS DO MENU -
    >
      <div className="container mx-auto px-4">
        {/* Main header with logo and navigation */}
        <div className="flex items-center justify-between"> 
          <Link to="/" className="flex items-center">
            <Logo className="h-10 md:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/sobre" className={navLinkClasses}>
              Sobre
            </NavLink>
            <NavLink to="/areas-de-atuacao" className={navLinkClasses}>
              Áreas de Atuação
            </NavLink>
            <NavLink to="/equipe" className={navLinkClasses}>
              Equipe
            </NavLink>
            <NavLink to="/contato" className={navLinkClasses}>
              Contato
            </NavLink>
            <Link
              to="/contato"
              className="px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors"
            >
              Consulta
            </Link>
            <LoginButton />
          </nav>

          {/* Mobile Menu Button */}
          <div className={`sm:px-4 py-5 md:hidden flex items-center ${isScrolled ? 'text-primary-800' : 'text-white'}`}>
            <LoginButton />
            <button
              className="ml-4 p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:px-4 py-5 md:hidden bg-white border-t mt-2" //melhoria nas telas menores
          >
            <nav className= {`container mx-auto px-4 py-4 flex flex-col`}>
             {/* inclui essa div do logo */}
              <div className="flex items-center justify-between px-4">
                <Link to="/" className="flex items-center w-full">
                  <Logo className="h-10 md:h-12 max-w-full" />
                </Link>
              </div>
              {/* ...restante do código... */}

              <NavLink
                to="/"
                className="py-3 border-b border-neutral-100 text-primary-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/sobre"
                className="py-3 border-b border-neutral-100 text-primary-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </NavLink>
              <NavLink
                to="/areas-de-atuacao"
                className="py-3 border-b border-neutral-100 text-primary-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Áreas de Atuação
              </NavLink>
              <NavLink
                to="/equipe"
                className="py-3 border-b border-neutral-100 text-primary-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Equipe
              </NavLink>
              <NavLink
                to="/contato"
                className="py-3 border-b border-neutral-100 text-primary-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contato
              </NavLink>
              <Link
                to="/contato"
                className="mt-4 px-4 py-3 bg-primary-800 text-white rounded text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Agendar Consulta
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;