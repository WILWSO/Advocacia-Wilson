import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, Eye } from 'lucide-react';
import { Usuario } from '../../../lib/supabase';
import { useResponsive } from '../../../hooks/useResponsive';
import { cn } from '../../../utils/cn';
import AccessibleButton from '../buttons/AccessibleButton';

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'advogado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assistente': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'advogado': return 'Advogado';
      case 'assistente': return 'Assistente';
      default: return role;
    }
  };

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
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-base sm:text-lg text-primary-900 truncate">
                {usuario.nome}
              </h3>
              {isCurrentUser && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Você
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 truncate">
              <Mail size={14} className="flex-shrink-0" />
              <span className="truncate">{usuario.email}</span>
            </p>
          </div>
          <div className={cn(
            "px-2 sm:px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 whitespace-nowrap flex-shrink-0",
            getRoleColor(usuario.role)
          )}>
            <Shield size={14} />
            <span className="hidden sm:inline">{getRoleText(usuario.role)}</span>
            <span className="sm:hidden">{getRoleText(usuario.role).substring(0, 4)}</span>
          </div>
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
          "flex gap-2",
          isMobile ? "flex-col" : "flex-row"
        )}>
          {/* Botão Ver: Todos podem ver seus próprios dados, admin vê todos */}
          {(isAdmin || isCurrentUser) && (
            <AccessibleButton
              onClick={() => onView(usuario)}
              variant="primary"
              size="md"
              leftIcon={<Eye size={16} />}
              aria-label={`Ver detalhes de ${usuario.nome}`}
              className="flex-1"
            >
              Ver Detalhes
            </AccessibleButton>
          )}
          
          {/* Botão Senha: Admin vê em todos, usuários só no seu próprio card */}
          {(isAdmin || isCurrentUser) && (
            <AccessibleButton
              onClick={() => onChangePassword(usuario)}
              variant="warning"
              size="md"
              leftIcon={<Shield size={16} />}
              aria-label={`Alterar senha de ${usuario.nome}`}
              className="flex-1"
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
