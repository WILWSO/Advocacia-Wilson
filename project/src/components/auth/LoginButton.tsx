import React, { useState } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const LoginButton = () => {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      setShowModal(false);
      setEmail('');
      setPassword('');
      setError('');
      // Redirecionar automaticamente para o dashboard
      navigate('/admin');
    } catch (error) {
      setError('Login falhou. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    logout();
    navigate('/'); // Redirecionar para home depois do logout
  };

  // Obtener nome do usuário
  const getUserName = () => {
    return user?.name || user?.email || '';
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="ml-4 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded text-sm font-medium transition-colors flex items-center"
        >
          <LogIn size={16} className="mr-2" />
          Entrar
        </button>
      )}

      {isAuthenticated && user && (
        <div className="ml-2 px-3 py-2 bg-primary-100 text-primary-800 rounded text-sm flex items-center">
          <User size={16} className="mr-2" />
          {getUserName()}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
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
            <form onSubmit={handleLogin}>
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

export default LoginButton;