import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FileText, Users, User, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

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
];

const SideBar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/admin/processos' && location.pathname === '/admin');
          
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
