import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { FileText, Users, User, MessageSquare } from 'lucide-react'
import AdminHeader from '../components/layout/AdminHeader'
import SideBar from '../components/admin/SideBar'
import { useResponsive } from '../hooks/ui/useResponsive'
import { cn } from '../utils/cn'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

const Dashboard: React.FC = () => {
  const { isMobile, isTablet } = useResponsive()
  const location = useLocation()

  const navItems: NavItem[] = [
    {
      path: '/admin/processos',
      label: 'Processos',
      icon: <FileText size={20} />
    },
    {
      path: '/admin/clientes',
      label: 'Clientes',
      icon: <Users size={20} />
    },
    {
      path: '/admin/usuarios',
      label: 'Usuários',
      icon: <User size={20} />
    },
    {
      path: '/admin/social',
      label: 'Social',
      icon: <MessageSquare size={20} />
    }
  ]

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path || 
                     (item.path === '/admin/processos' && location.pathname === '/admin')
    
    return (
      <NavLink
        to={item.path}
        className={({ isActive: linkActive }) => cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
          (isActive || linkActive)
            ? "bg-primary-700 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        {item.icon}
        <span className={cn(
          isMobile ? "text-xs" : "text-sm"
        )}>
          {item.label}
        </span>
      </NavLink>
    )
  }

  // Mobile: Bottom Navigation
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminHeader />
        
        {/* Content Area with bottom padding for fixed nav */}
        <main className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </main>

        {/* Fixed Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors",
                  isActive || (item.path === '/admin/processos' && location.pathname === '/admin')
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    )
  }

  // Tablet: Top Tabs
  if (isTablet) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminHeader />
        
        {/* Top Tabs Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="max-w-[1920px] mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-3">
              {navItems.map((item) => (
                <NavItemComponent key={item.path} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    )
  }

  // Desktop: Sidebar Layout
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />
      
      <div className="flex flex-1">
        {/* Sidebar Navigation - Sticky */}
        <SideBar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
