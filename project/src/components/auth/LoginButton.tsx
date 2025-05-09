import React, { useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const LoginButton = () => {
  const { isAuthenticated, login, logout } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setShowModal(false);
      setEmail('');
      setPassword('');
      setError('');
    } catch (error) {
      setError('Login falhou. Verifique suas credenciais.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <button
        onClick={isAuthenticated ? handleLogout : () => setShowModal(true)}
        className="ml-4 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded text-sm font-medium transition-colors flex items-center"
      >
        {isAuthenticated ? (
          <>
            <LogOut size={16} className="mr-2" />
            Sair
          </>
        ) : (
          <>
            <LogIn size={16} className="mr-2" />
            Entrar
          </>
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
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
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton;