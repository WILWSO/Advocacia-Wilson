/**
 * Hook: useClientTypeFields
 * 
 * Configuración declarativa de campos según tipo de cliente (PF/PJ)
 * 
 * @principle SRP - Solo responsable de mapear configuraciones
 * @principle SSoT - Centraliza TODA la lógica de mapeo en un lugar
 * @principle DRY - Reutilizable en cualquier formulario de cliente
 */

import { useMemo } from 'react';
import { TipoCliente } from '@/types/cliente';

/**
 * Tipo de componente para el campo
 */
export type FieldComponentType = 'CPFInput' | 'CNPJInput' | 'text' | 'date' | 'select';

/**
 * Configuración de campo dinámico
 */
export interface FieldConfig {
  label: string;
  placeholder?: string;
  component: FieldComponentType;
  required?: boolean;
  visible: boolean;
}

/**
 * Configuración de todos los campos del formulario
 */
export interface ClientFieldsConfig {
  cpf_cnpj: FieldConfig;
  nome_completo: FieldConfig;
  rg: FieldConfig;
  data_nascimento: FieldConfig;
  estado_civil: FieldConfig;
  nacionalidade: FieldConfig;
  profissao: FieldConfig;
}

/**
 * Hook para obtener configuración de campos según tipo de cliente
 * 
 * @param tipoCliente - Tipo de cliente: 'PF' (Pessoa Física) o 'PJ' (Pessoa Jurídica)
 * @returns Objeto con configuración de cada campo
 * 
 * @example
 * ```tsx
 * const fieldsConfig = useClientTypeFields(formData.tipo_cliente);
 * 
 * // Usar en JSX
 * <label>{fieldsConfig.nome_completo.label}</label>
 * 
 * // Render condicional
 * {fieldsConfig.estado_civil.visible && <select>...</select>}
 * ```
 */
export function useClientTypeFields(tipoCliente: TipoCliente): ClientFieldsConfig {
  const fieldsConfig = useMemo<ClientFieldsConfig>(() => ({
    // Campo dinámico: CPF/CNPJ
    cpf_cnpj: {
      label: tipoCliente === 'PF' ? 'CPF' : 'CNPJ',
      placeholder: tipoCliente === 'PF' ? '000.000.000-00' : '00.000.000/0000-00',
      component: tipoCliente === 'PF' ? 'CPFInput' : 'CNPJInput',
      required: false,
      visible: true,
    },
    
    // Campo dinámico: Nome Completo / Razão Social
    nome_completo: {
      label: tipoCliente === 'PF' ? 'Nome Completo' : 'Razão Social',
      placeholder: tipoCliente === 'PF' ? 'Nome completo do cliente' : 'Razão social da empresa',
      component: 'text',
      required: true,
      visible: true,
    },
    
    // Campo dinámico: RG / Inscrição Estadual
    rg: {
      label: tipoCliente === 'PF' ? 'RG' : 'Inscrição Estadual',
      placeholder: tipoCliente === 'PF' ? 'RG' : 'Inscrição Estadual',
      component: 'text',
      required: false,
      visible: true,
    },
    
    // Campo dinámico: Data de Nascimento / Início das Atividades
    data_nascimento: {
      label: tipoCliente === 'PF' ? 'Data de Nascimento' : 'Início das Atividades',
      placeholder: '',
      component: 'date',
      required: false,
      visible: true,
    },
    
    // Campo condicional: Estado Civil (SOLO PF)
    estado_civil: {
      label: 'Estado Civil',
      placeholder: 'Selecione',
      component: 'select',
      required: false,
      visible: tipoCliente === 'PF', // 🔹 SSoT: Una sola expresión define visibilidad
    },
    
    // Campo dinámico: Nacionalidade / Natureza Jurídica
    nacionalidade: {
      label: tipoCliente === 'PF' ? 'Nacionalidade' : 'Natureza Jurídica',
      placeholder: tipoCliente === 'PF' ? 'Ex: Brasileiro' : 'Ex: Sociedade Limitada',
      component: 'text',
      required: false,
      visible: true,
    },
    
    // Campo dinámico: Profissão / Atividade Principal
    profissao: {
      label: tipoCliente === 'PF' ? 'Profissão' : 'Atividade Principal',
      placeholder: tipoCliente === 'PF' ? 'Profissão' : 'Atividade principal da empresa',
      component: 'text',
      required: false,
      visible: true,
    },
  }), [tipoCliente]);
  
  return fieldsConfig;
}
