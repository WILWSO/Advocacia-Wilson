import { LogIn, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './authStore';

const AuthButton = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Obtener nombre del usuario
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
          onClick={handleLogin}
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
    </>
  );
};

export default AuthButton;
