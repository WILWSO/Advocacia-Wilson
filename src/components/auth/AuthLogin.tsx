import React, { useState } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthLogin } from './useAuthLogin';
import { AnimatePresence, motion } from 'framer-motion';
import { getUserDisplayName } from '../../utils/authHelpers';

interface AuthLoginProps {
  /**
   * Si true, muestra modal de login inline
   * Si false, navega a la página /login
   */
  withModal?: boolean;
  /**
   * Callback ejecutado después de login exitoso
   */
  onLoginSuccess?: () => void;
}

/**
 * AuthLogin - Componente unificado para autenticación
 * 
 * Unifica la funcionalidad de AuthButton y LoginButton siguiendo SSoT
 * 
 * @param withModal - false: navega a /login | true: muestra modal
 * @param onLoginSuccess - callback después de login exitoso
 * 
 * Uso:
 * <AuthLogin withModal={false} /> // Header público
 * <AuthLogin withModal={true} /> // Mobile menu
 */
const AuthLogin = ({ withModal = false, onLoginSuccess }: AuthLoginProps) => {
  const { isAuthenticated, user, login, logout } = useAuthLogin();
  const navigate = useNavigate();
  
  // Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  const handleLoginClick = () => {
    if (withModal) {
      setShowModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      setShowModal(false);
      setEmail('');
      setPassword('');
      setError('');
      
      // Callback personalizado o redirección default
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate('/admin');
      }
    } catch {
      setError('Login falhou. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-stretch gap-1.5 sm:gap-2">
          {/* Nombre de usuario - visible solo en dispositivos más grandes */}
          {user && (
            <div className="hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 bg-primary-100 text-primary-800 rounded text-xs sm:text-sm h-9 sm:h-10">
              <User size={14} className="sm:hidden" />
              <User size={16} className="hidden sm:block" />
              <span className="truncate max-w-[100px] sm:max-w-none font-medium">{getUserDisplayName(user)}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-2.5 sm:px-3 md:px-4 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-10 min-w-[36px]"
            title="Sair da conta"
            aria-label="Sair da conta"
          >
            <LogOut size={14} className="sm:hidden" />
            <LogOut size={16} className="hidden sm:block" />
            <span className="hidden xs:inline">Sair</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleLoginClick}
          className="px-2.5 sm:px-3 md:px-4 bg-gold-600 hover:bg-gold-700 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-10"
          title="Fazer login"
          aria-label="Fazer login"
        >
          <LogIn size={14} className="sm:hidden" />
          <LogIn size={16} className="hidden sm:block" />
          <span>Entrar</span>
        </button>
      )}

      {/* Modal de Login (solo si withModal=true) */}
      <AnimatePresence>
        {showModal && withModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
            >
              <h2 className="text-2xl font-bold text-primary-900 mb-6">Login</h2>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded flex items-center disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <LogIn size={16} className="mr-2" />
                        Entrar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthLogin;
