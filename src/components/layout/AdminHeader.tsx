import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useSupabase'
import Logo from '../shared/Logo'

import { cn } from '../../utils/cn'

interface AdminHeaderProps {
  className?: string
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ className }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'advogado':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'assistente':
        return 'bg-green-100 text-green-700 border-green-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'advogado':
        return 'Advogado'
      case 'assistente':
        return 'Assistente'
      default:
        return 'Usuário'
    }
  }

  return (
    <header className={cn(
      "bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm",
      className
    )}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-auto" />
          </Link>

          {/* Right Section: Notifications + User Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notificações"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
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
