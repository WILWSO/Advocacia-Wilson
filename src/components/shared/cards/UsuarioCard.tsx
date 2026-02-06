import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, Eye } from 'lucide-react';
import { Usuario } from '../../../types/usuario';
import { useResponsive } from '../../../hooks/ui/useResponsive';
import { cn } from '../../../utils/cn';
import { getRoleBadgeColor, getRoleLabel } from '../../../utils/roleHelpers';
import AccessibleButton from '../buttons/AccessibleButton'
import { formatShortDate } from '../../../utils/dateUtils';

interface UsuarioCardProps {
  usuario: Usuario;
  currentUser: { id?: string; role?: string } | null;
  onChangePassword: (usuario: Usuario) => void;
  onView: (usuario: Usuario) => void;
  index: number;
}

/**
 * Componente de card para visualização de usuários
 * Extraído de UsuariosPage para melhor organização CDMF
 */
const UsuarioCard: React.FC<UsuarioCardProps> = ({ 
  usuario, 
  currentUser, 
  onChangePassword, 
  onView, 
  index 
}) => {
  const { isMobile } = useResponsive();
  const isCurrentUser = currentUser?.id === usuario.id;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 h-full flex flex-col"
    >
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Header reorganizado - badges arriba */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={cn(
              "px-2 sm:px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 whitespace-nowrap",
              getRoleBadgeColor(usuario.role)
            )}>
              <Shield size={12} />
              <span className="hidden sm:inline">{getRoleLabel(usuario.role)}</span>
              <span className="sm:hidden">{getRoleLabel(usuario.role).substring(0, 4)}</span>
            </div>
            {isCurrentUser && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                Você
              </span>
            )}
          </div>
        </div>
        
        {/* Nombre y email - con más espacio */}
        <div className="mb-4">
          <h3 className="font-semibold text-base sm:text-lg text-primary-900 mb-2 leading-tight">
            {usuario.nome}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 truncate">
            <Mail size={14} className="flex-shrink-0" />
            <span className="truncate">{usuario.email}</span>
          </p>
        </div>

        <div className="mb-4 pb-4 border-b border-gray-200 flex-1">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Status:</span>
            <span className={cn(
              "font-medium",
              usuario.ativo ? "text-green-600" : "text-red-600"
            )}>
              {usuario.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          {usuario.data_criacao && (
            <div className="flex items-center justify-between text-xs sm:text-sm mt-2">
              <span className="text-gray-600">Cadastrado:</span>
              <span className="text-gray-900">
                {new Date(usuario.data_criacao).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: '2-digit',
                  year: isMobile ? '2-digit' : 'numeric'
                })}
              </span>
            </div>
          )}
        </div>

        <div className={cn(
          "flex gap-2 mt-auto pt-2",
          isMobile ? "flex-col" : "flex-row justify-center"
        )}>
          {/* Botão Ver: Todos podem ver seus próprios dados, admin vê todos */}
          {(isAdmin || isCurrentUser) && (
            <AccessibleButton
              onClick={() => onView(usuario)}
              variant="primary"
              size="sm"
              leftIcon={<Eye size={14} />}
              aria-label={`Ver detalhes de ${usuario.nome}`}
              className={cn(
                "transition-all duration-200",
                isMobile ? "w-full" : "flex-1 min-w-[100px] max-w-[140px]"
              )}
            >
              {isMobile ? "Ver Detalhes" : "Ver"}
            </AccessibleButton>
          )}
          
          {/* Botão Senha: Admin vê em todos, usuários só no seu próprio card */}
          {(isAdmin || isCurrentUser) && (
            <AccessibleButton
              onClick={() => onChangePassword(usuario)}
              variant="warning"
              size="sm"
              leftIcon={<Shield size={14} />}
              aria-label={`Alterar senha de ${usuario.nome}`}
              className={cn(
                "transition-all duration-200",
                isMobile ? "w-full" : "flex-1 min-w-[100px] max-w-[140px]"
              )}
            >
              Senha
            </AccessibleButton>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UsuarioCard;
