import { getIcon, SYSTEM_ICONS } from '../../config/icons';

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

// Items del menú dropdown "Página" para TABLETS - Incluye navegación principal y secciones
export const pageDropdownItems: DropdownMenuItem[] = [
  { 
    label: 'Home', 
    href: '/',
    icon: getIcon('home', 16)
  },
  { 
    label: 'Nossa História', 
    href: '/nossa-historia',
    icon: getIcon('aboutUs', 16)
  },
  { 
    label: 'Equipe', 
    href: '/equipe',
    icon: getIcon('team', 16)
  },
  { 
    label: 'Social', 
    href: '/social',
    icon: getIcon('social', 16)
  },
  // Separador visual (sin texto, solo estilos)
  { 
    label: '─────────────────', 
    href: '#separator',
    icon: null
  },
  { 
    label: 'Início', 
    href: '#hero',
    icon: getIcon('hero', 16)
  },
  { 
    label: 'Especialistas', 
    href: '#team',
    icon: getIcon('team', 16)
  },
  { 
    label: 'Sobre Nós', 
    href: '#about',
    icon: getIcon('achievements', 16)
  },
  { 
    label: 'Áreas de Atuação', 
    href: '#practice-areas',
    icon: getIcon('practiceAreas', 16)
  },
  { 
    label: 'Destaques', 
    href: '#social',
    icon: getIcon('social', 16)
  },
  { 
    label: 'Depoimentos', 
    href: '#testimonials',
    icon: getIcon('testimonials', 16)
  },
  { 
    label: 'Contato', 
    href: '#contact',
    icon: getIcon('contact', 16)
  }
];

// Items del menú dropdown "Página" para DESKTOP - Solo secciones del home
export const pageSectionsDropdownItems: DropdownMenuItem[] = [
  { 
    label: 'Início', 
    href: '#hero',
    icon: getIcon('hero', 16)
  },
  { 
    label: 'Especialistas', 
    href: '#team',
    icon: getIcon('team', 16)
  },
  { 
    label: 'Sobre Nós', 
    href: '#about',
    icon: getIcon('achievements', 16)
  },
  { 
    label: 'Áreas de Atuação', 
    href: '#practice-areas',
    icon: getIcon('practiceAreas', 16)
  },
  { 
    label: 'Destaques', 
    href: '#social',
    icon: getIcon('social', 16)
  },
  { 
    label: 'Depoimentos', 
    href: '#testimonials',
    icon: getIcon('testimonials', 16)
  },
  { 
    label: 'Contato', 
    href: '#contact',
    icon: getIcon('contact', 16)
  }
];

export const publicNavLinks: NavLink[] = [
  { 
    to: '/', 
    label: 'Home', 
    icon: SYSTEM_ICONS.home,
    ariaLabel: 'Página inicial' 
  },
  { 
    to: '/nossa-historia', 
    label: 'História', 
    icon: SYSTEM_ICONS.aboutUs,
    ariaLabel: 'História do escritório' 
  },
  // Nota: "Página" dropdown será manejado por DropdownMenu component
  { 
    to: '/equipe', 
    label: 'Equipe', 
    icon: SYSTEM_ICONS.team,
    ariaLabel: 'Conheça nossa equipe' 
  },
  { 
    to: '/social', 
    label: 'Social', 
    icon: SYSTEM_ICONS.social,
    ariaLabel: 'Responsabilidade Social e conteúdos' 
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
