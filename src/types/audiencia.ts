import { BaseEntity } from './common'

export interface Audiencia extends BaseEntity {
  proceso_id: string;
  fecha: string; // ISO date format
  hora: string; // HH:mm format
  tipo: string;
  forma: 'presencial' | 'virtual' | 'hibrida';
  local?: string;
  observaciones?: string;
  link_meet?: string;
  sincronizado_google: boolean;
  google_event_id?: string;
  notificado: boolean;
  fecha_notificacion?: string;
}

export interface AudienciaFormData {
  proceso_id: string;
  fecha: string;
  hora: string;
  tipo: string;
  forma: 'presencial' | 'virtual' | 'hibrida';
  local?: string;
  observaciones?: string;
  link_meet?: string;
}

export interface AudienciaWithProcesso extends Audiencia {
  proceso?: {
    numero_processo: string;
    titulo: string;
    advogado_responsavel?: string;
  };
}

export type TipoAudiencia =
  | 'Audiência de Conciliação'
  | 'Audiência de Instrução';

export const TIPOS_AUDIENCIA: TipoAudiencia[] = [
  'Audiência de Conciliação',
  'Audiência de Instrução',
];

export type FormaAudiencia = 'presencial' | 'virtual' | 'hibrida';

export const FORMAS_AUDIENCIA: { value: FormaAudiencia; label: string }[] = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'hibrida', label: 'Híbrida' },
];
