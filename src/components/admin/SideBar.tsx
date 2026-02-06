import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getIcon } from '../../config/icons';
import { cn } from '../../utils/cn';
import { ADMIN_UI } from '../../config/messages';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: '/admin/agenda',
    label: ADMIN_UI.SIDEBAR.AGENDA,
    icon: getIcon('calendar', 20)
  },
  {
    path: '/admin/processos',
    label: ADMIN_UI.SIDEBAR.PROCESSOS,
    icon: getIcon('processos', 20)
  },
  {
    path: '/admin/clientes',
    label: ADMIN_UI.SIDEBAR.CLIENTES,
    icon: getIcon('clientes', 20)
  },
  {
    path: '/admin/usuarios',
    label: ADMIN_UI.SIDEBAR.USUARIOS,
    icon: getIcon('usuarios', 20)
  },
  {
    path: '/admin/social',
    label: ADMIN_UI.SIDEBAR.SOCIAL,
    icon: getIcon('socialAdmin', 20)
  }
];

const SideBar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/admin/agenda' && location.pathname === '/admin');
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: linkActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                (isActive || linkActive)
                  ? "bg-primary-700 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
