import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, AlertCircle, CheckCircle, Clock, Eye } from 'lucide-react';
import { ProcessoJuridico } from '../../../lib/supabase';
import { useResponsive } from '../../../hooks/useResponsive';
import { cn } from '../../../utils/cn';
import AccessibleButton from '../buttons/AccessibleButton';

interface ProcessoCardProps {
  processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string };
  onEdit: (processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) => void;
  onView: (processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) => void;
  canEdit: boolean;
  index: number;
}

/**
 * Componente de card para visualização de processos judiciais
 * Extraído de AdminDashboard para melhor organização CDMF
 */
const ProcessoCard: React.FC<ProcessoCardProps> = ({ 
  processo, 
  onEdit, 
  onView, 
  canEdit, 
  index 
}) => {
  const { isMobile } = useResponsive();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_aberto': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fechado': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_aberto': return <AlertCircle size={16} />;
      case 'em_andamento': return <Clock size={16} />;
      case 'fechado': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'em_aberto': return 'Em Aberto';
      case 'em_andamento': return 'Em Andamento';
      case 'fechado': return 'Fechado';
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade?: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-300';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'media': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'baixa': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPrioridadeText = (prioridade?: string) => {
    switch (prioridade) {
      case 'urgente': return 'Urgente';
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return 'Média';
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
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-primary-900 line-clamp-2 flex-1">
            {processo.titulo}
          </h3>
          <div className="flex flex-col gap-2 items-end ml-2">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 whitespace-nowrap",
              getStatusColor(processo.status)
            )}>
              {getStatusIcon(processo.status)}
              {getStatusText(processo.status)}
            </div>
            {processo.prioridade && (
              <motion.div
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 whitespace-nowrap",
                  getPrioridadeColor(processo.prioridade),
                  processo.prioridade === 'urgente' && "shadow-lg shadow-red-300"
                )}
                animate={processo.prioridade === 'urgente' ? {
                  opacity: [1, 0.7, 1],
                  y: [0, -2, 0]
                } : {}}
                transition={processo.prioridade === 'urgente' ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              >
                {getPrioridadeText(processo.prioridade)}
              </motion.div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {processo.descricao}
        </p>

        <div className="space-y-2 mb-4">
          {processo.cliente_nome && (
            <div className="flex items-center text-sm text-gray-500">
              <User size={14} className="mr-2" />
              {processo.cliente_nome}
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-2" />
            {processo.data_criacao ? new Date(processo.data_criacao).toLocaleDateString('pt-BR') : 'N/A'}
          </div>

          {processo.usuarios && (
            <div className="flex items-center text-sm text-gray-500">
              <User size={14} className="mr-2" />
              Responsável: {processo.usuarios.nome}
            </div>
          )}
        </div>

        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col" : "flex-row"
        )}>
          <AccessibleButton
            onClick={() => onView(processo)}
            variant="ghost"
            size="md"
            leftIcon={<Eye size={16} />}
            aria-label={`Ver detalhes do processo ${processo.titulo}`}
            className="flex-1"
          >
            Ver
          </AccessibleButton>
          
          {canEdit && (
            <AccessibleButton
              onClick={() => onEdit(processo)}
              variant="primary"
              size="md"
              aria-label={`Editar processo ${processo.titulo}`}
              className="flex-1"
            >
              Editar
            </AccessibleButton>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessoCard;
