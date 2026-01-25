import { Home, Users, Scale, Briefcase, Share2, Phone, FileText, MessageCircle, Award } from 'lucide-react';

export interface NavLink {
  to: string;
  label: string;
  icon?: any;
  end?: boolean;
  ariaLabel?: string;
}

export interface DropdownMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Items del menú dropdown "Página"
export const pageDropdownItems: DropdownMenuItem[] = [
  { 
    label: 'Início', 
    href: '#hero',
    icon: <Home size={16} />
  },
  { 
    label: 'Especialistas', 
    href: '#team',
    icon: <Users size={16} />
  },
  { 
    label: 'Sobre Nós', 
    href: '#about',
    icon: <FileText size={16} />
  },
  { 
    label: 'Áreas de Atuação', 
    href: '#practice-areas',
    icon: <Scale size={16} />
  },
  { 
    label: 'Destaques', 
    href: '#social',
    icon: <Share2 size={16} />
  },
  { 
    label: 'Depoimentos', 
    href: '#testimonials',
    icon: <MessageCircle size={16} />
  },
  { 
    label: 'Contato', 
    href: '#contact',
    icon: <Phone size={16} />
  }
];

export const publicNavLinks: NavLink[] = [
  { 
    to: '/', 
    label: 'Home', 
    icon: Home,
    ariaLabel: 'Página inicial' 
  },
  { 
    to: '/nossa-historia', 
    label: 'História', 
    icon: Users,
    ariaLabel: 'História do escritório' 
  },
  // Nota: "Página" dropdown será manejado por DropdownMenu component
  { 
    to: '/equipe', 
    label: 'Equipe', 
    icon: Briefcase,
    ariaLabel: 'Conheça nossa equipe' 
  },
  { 
    to: '/social', 
    label: 'Social', 
    icon: Share2,
    ariaLabel: 'Notícias e conteúdos' 
  },

];

export const adminNavLinks: NavLink[] = [
  { 
    to: '/admin/clientes', 
    label: 'Clientes',
    ariaLabel: 'Gestão de clientes' 
  },
  { 
    to: '/admin/usuarios', 
    label: 'Usuários',
    ariaLabel: 'Gestão de usuários' 
  },
  { 
    to: '/admin', 
    label: 'Processos',
    end: true,
    ariaLabel: 'Dashboard principal' 
  },
  { 
    to: '/admin-social', 
    label: 'Social',
    ariaLabel: 'Administrar conteúdo social' 
  }
];

export const footerQuickLinks: NavLink[] = [
  { to: '/', label: 'Início' },
  { to: '/sobre', label: 'Sobre Nós' },
  { to: '/areas-atuacao', label: 'Áreas de Atuação' },
  { to: '/equipe', label: 'Equipe' },
  { to: '/contato', label: 'Contato' }
];
