import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useAuthLogin } from '../auth/useAuthLogin'
import Logo from '../shared/Logo'
import { getRoleBadgeColor, getRoleLabel } from '../../utils/roleHelpers'
import { cn } from '../../utils/cn'

interface AdminHeaderProps {
  className?: string
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ className }) => {
  const { user, signOut } = useAuthLogin()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className={cn(
      "bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm safe-top",
      className
    )}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <Logo className="h-6 sm:h-8 w-auto" />
          </Link>

          {/* Right Section: Notifications + User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-touch-target"
              title="Notificações"
              aria-label="Ver notificações"
            >
              <Bell size={18} className="sm:hidden" />
              <Bell size={20} className="hidden sm:block" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors min-touch-target"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.nome_completo?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {user?.nome_completo || 'Usuário'}
                    </p>
                    <span className={cn(
                      "inline-block text-xs px-2 py-0.5 rounded-full border font-medium",
                      getRoleBadgeColor(user?.role || '')
                    )}>
                      {getRoleLabel(user?.role || '')}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-500 hidden md:block" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.nome_completo || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <span className={cn(
                        "inline-block mt-2 text-xs px-2 py-1 rounded-full border font-medium",
                        getRoleBadgeColor(user?.role || '')
                      )}>
                        {getRoleLabel(user?.role || '')}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/admin/usuarios"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} />
                        Meu Perfil
                      </Link>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings size={16} />
                        Configurações
                      </button>
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
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
