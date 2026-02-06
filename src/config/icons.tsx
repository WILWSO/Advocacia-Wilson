/**
 * Sistema Centralizado de Iconos
 * 
 * Este archivo mantiene todos los iconos del sistema en un solo lugar.
 * Cambiar un icono aquí actualizará automáticamente todas las referencias en el sistema.
 * 
 * Uso:
 * import { SYSTEM_ICONS, getIcon } from '@/config/icons';
 * 
 * Opción 1: Usar helper
 * {getIcon('social', 16)}
 * 
 * Opción 2: Importar directamente
 * const SocialIcon = SYSTEM_ICONS.social;
 * <SocialIcon size={16} />
 */

import React from 'react';
import { 
  Home,
  Users,
  Scale,
  Briefcase,
  Share2,
  Phone,
  FileText,
  MessageCircle,
  Award,
  Newspaper,
  LayoutDashboard,
  UserCog,
  ShieldCheck,
  Upload,
  Download,
  Trash2,
  Eye,
  Loader2,
  Lock,
  X,
  Edit2,
  Plus,
  Image as ImageIcon,
  Video,
  Youtube,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Menu,
  Settings,
  MapPin,
  Gavel,
  UserRound,
  Send,
  ArrowRight
} from 'lucide-react';

/**
 * Mapa de iconos del sistema
 * Organizado por categorías para fácil navegación
 */
export const SYSTEM_ICONS = {
  // ==================== NAVEGACIÓN PÚBLICA ====================
  home: Home,
  contact: Phone,
  aboutUs: FileText,
  team: Users,
  practiceAreas: Scale,
  briefcase: Briefcase,
  
  // ==================== PÁGINAS/SECCIONES ====================
  social: Newspaper,           // Cambiar aquí afecta todo el sistema
  testimonials: MessageCircle,
  achievements: Award,
  hero: Home,
  
  // ==================== ÁREA ADMINISTRATIVA ====================
  dashboard: LayoutDashboard,
  processos: FileText,
  clientes: Users,             // Clientes (público)
  usuarios: ShieldCheck,       // Usuarios del sistema (admin)
  socialAdmin: Newspaper,      // Social en admin (mismo que social)
  
  // ==================== ACCIONES/CRUD ====================
  create: Plus,
  edit: Edit2,
  delete: Trash2,
  view: Eye,
  close: X,
  save: CheckCircle,
  send: Send,
  submit: ArrowRight,
  
  // ==================== ARCHIVOS/MEDIA ====================
  upload: Upload,
  download: Download,
  file: FileText,
  image: ImageIcon,
  video: Video,
  youtube: Youtube,
  
  // ==================== UI/ESTADOS ====================
  loading: Loader2,
  locked: Lock,
  alert: AlertCircle,
  success: CheckCircle,
  info: Info,
  search: Search,
  filter: Filter,
  
  // ==================== FECHA/TIEMPO ====================
  calendar: Calendar,
  clock: Clock,
  
  // ==================== NAVEGACIÓN/CONTROLES ====================
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  menu: Menu,
  
  // ==================== USUARIO/AUTH ====================
  user: User,
  userSettings: UserCog,
  logout: LogOut,
  settings: Settings,
  
  // ==================== NUEVOS ICONOS ESPECÍFICOS ====================
  mapPin: MapPin,           // Local/Ubicación (audiencias)
  gavel: Gavel,             // Procesos jurídicos/Justicia
  userRound: UserRound,     // Presencial/Persona física
  
} as const;

/**
 * Helper para renderizar iconos con tamaño consistente
 * Incluye validación defensiva para prevenir errores de recursión en Firefox
 * 
 * @param iconName - Nombre del icono del mapa SYSTEM_ICONS
 * @param size - Tamaño del icono en píxeles (default: 16)
 * @param className - Clases CSS adicionales (opcional)
 * @returns Componente JSX del icono
 * 
 * @example
 * {getIcon('social', 20)}
 * {getIcon('clientes')} // usa tamaño default de 16
 * {getIcon('info', 20, 'text-blue-600')}
 */
export const getIcon = (
  iconName: keyof typeof SYSTEM_ICONS, 
  size = 16, 
  className?: string
) => {
  const Icon = SYSTEM_ICONS[iconName];
  
  // Validación defensiva para prevenir recursión infinita
  if (!Icon) {
    console.warn(`Icon "${iconName}" not found in SYSTEM_ICONS`);
    return null;
  }
  
  try {
    return <Icon size={size} className={className} strokeWidth={1.5} />;
  } catch (error) {
    console.error(`Error rendering icon "${iconName}":`, error);
    return null;
  }
};

/**
 * Type helper para asegurar que los nombres de iconos sean válidos
 */
export type SystemIconName = keyof typeof SYSTEM_ICONS;
