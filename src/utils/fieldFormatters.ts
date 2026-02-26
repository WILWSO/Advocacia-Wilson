/**
 * Utilidades para formateo de campos según el tipo de dato de la base de datos
 * 
 * REGLAS:
 * - Campos VARCHAR ingresados por usuario: Se guardan en MAYÚSCULAS
 * - Campos EMAIL: Se guardan en minúsculas (por convención)
 * - Campos TEXT (texto libre/comentarios/descripción): NO se formatean (como usuario escribe)
 * - Campos de enumeración/select predefinido: NO se formatean (ya vienen con el valor correcto)
 * - Campos DATE/TIMESTAMP: null si vacíos (PostgreSQL no acepta strings vacíos para fechas)
 * - Campos ENUM OPCIONALES: null si vacíos (PostgreSQL CHECK constraint requiere null o valor válido)
 * - Campos UUID: null si vacíos (PostgreSQL UUID no acepta strings vacíos)
 * - Campos UNIQUE OPCIONALES: null si vacíos (evitar violación de UNIQUE constraint con múltiples strings vacíos)
 */

/**
 * Campos de fecha/timestamp que deben ser null si están vacíos
 */
const DATE_FIELDS = [
  'data_nascimento',
  'data_criacao',
  'data_atualizacao',
  'created_at',
  'updated_at',
  'ultimo_contato',
  'fecha',
  'fecha_notificacion',
  'fecha_inicio',
  'fecha_fin',
  'fecha_vencimiento',
  'prazo',
  'data_encerramento',
];

/**
 * Campos UUID que deben ser null cuando están vacíos
 * (PostgreSQL UUID no acepta strings vacíos)
 */
const UUID_FIELDS = [
  'id',
  'cliente_id',
  'processo_id',
  'usuario_id',
  'advogado_id',
  'advogado_responsavel', // En procesos
  'creado_por',
  'atualizado_por',
  'created_by',
  'updated_by',
  'autor',
];

/**
 * Campos UNIQUE opcionales que deben ser null cuando están vacíos
 * (Evita error de UNIQUE constraint con múltiples strings vacíos)
 */
const UNIQUE_OPTIONAL_FIELDS = [
  'cpf_cnpj',
  'cpf',
  'cnpj',
  'rg',
  'numero_processo',
  'numero_documento',
];

/**
 * Campos de tipo ARRAY (TEXT[]) que deben ser null cuando están vacíos
 * (PostgreSQL no acepta strings vacíos para campos array)
 */
const ARRAY_FIELDS = [
  'educacao',
  'especialidades',
];

/**
 * Campos de tipo BOOLEAN que deben ser null cuando están vacíos
 * (PostgreSQL no acepta strings vacíos para campos boolean)
 */
const BOOLEAN_FIELDS = [
  'equipe',
  'ativo',
];

/**
 * Campos ENUM opcionales que deben ser null cuando están vacíos
 * (PostgreSQL no acepta strings vacíos para campos con CHECK constraints)
 */
const NULLABLE_ENUM_FIELDS = [
  'estado_civil',
  'tipo_documento',
  'modalidade',
  'forma', // audiencia
  'competencia',
  // polo removido - ahora es campo obligatorio
];

/**
 * Campos que NO deben formatearse porque son selectores/enumeraciones predefinidas
 */
const ENUM_FIELDS = [
  // Opciones predefinidas del sistema
  'status',
  'status_processo',
  'role',
  'tipo',
  'tipo_processo',
  'tipo_audiencia',
  'forma',
  'modalidade',
  'prioridade',
  'polo',
  'competencia',
  'area_direito',
  'estado_civil',
  'tipo_documento',
  'ativo',
];

/**
 * Campos VARCHAR que deben guardarse en MAYÚSCULAS
 * Solo incluye campos ingresados manualmente por el usuario
 */
const VARCHAR_FIELDS = [
  // Clientes
  'nome_completo',
  'cpf',
  'cpf_cnpj',
  'rg',
  'cnpj',
  'telefone',
  'celular',
  'telefone_alternativo',
  'endereco',
  'numero',
  'complemento',
  'bairro',
  'cidade',
  'estado',
  'pais',
  // 'cep' - NO formatear, tiene formato especial (12345-678)
  'profissao',
  'nacionalidade',
  
  // Procesos
  'numero_processo',
  // 'titulo' - NO formatear, debe quedar como usuario lo escribe
  'vara',
  'comarca',
  'uf_comarca',
  'uf',
  'municipio',
  'juiz',
  'cliente_telefone',
  
  // Audiencias
  'local',
  
  // Usuarios
  'nome',
  'sobrenome',
  'nome_completo',
  'cargo',
  'departamento',
  'numero_documento',
  'whatsapp',
  'cidade',
  // 'bio' - Campo TEXT, no formatea (texto libre)
  
  // Posts Sociais
  // 'titulo' - NO formatear en posts sociais tampoco
  'autor',
];

/**
 * Campos de EMAIL que deben guardarse en minúsculas (por convención)
 */
const EMAIL_FIELDS = [
  'email',
  'cliente_email',
];

/**
 * Campos con formato especial que NO deben ser modificados
 * (ya tienen su propio formato específico)
 */
const SPECIAL_FORMAT_FIELDS = [
  'cep', // Formato: 12345-678 (no convertir a mayúsculas)
];

/**
 * Formatea CPF brasileiro (000.000.000-00)
 */
export const formatCPF = (cpf: string | null | undefined): string => {
  if (!cpf || typeof cpf !== 'string') return '';
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Aplica formatação
  if (cleanCPF.length <= 3) return cleanCPF;
  if (cleanCPF.length <= 6) return cleanCPF.replace(/(\d{3})(\d)/, '$1.$2');
  if (cleanCPF.length <= 9) return cleanCPF.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formatea telefone brasileiro ((11) 99999-9999)
 */
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone || typeof phone !== 'string') return '';
  
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Aplica formatação
  if (cleanPhone.length <= 2) return cleanPhone;
  if (cleanPhone.length <= 6) return cleanPhone.replace(/(\d{2})(\d)/, '($1) $2');
  if (cleanPhone.length <= 10) return cleanPhone.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
  return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

/**
 * Valida CPF brasileiro
 */
export const validateCPF = (cpf: string | null | undefined): boolean => {
  if (!cpf || typeof cpf !== 'string') return false;
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  
  return digit === parseInt(cleanCPF.charAt(10));
};

/**
 * Valida email
 */
export const validateEmail = (email: string | null | undefined): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
};

/**
 * Formatea un valor a MAYÚSCULAS (para campos VARCHAR)
 * Para tiempo real: no hace trim para no molestar al usuario
 * @returns Siempre retorna string (nunca null)
 */
export const toUpperCase = (value: string | null | undefined): string => {
  if (!value || typeof value !== 'string') return '';
  return value.toUpperCase();
};

/**
 * Formatea un valor a minúsculas (para campos EMAIL)
 * Para tiempo real: no hace trim para no molestar al usuario
 * @returns Siempre retorna string (nunca null)
 */
export const toLowerCase = (value: string | null | undefined): string => {
  if (!value || typeof value !== 'string') return '';
  return value.toLowerCase();
};

/**
 * Determina si un campo es de enumeración (no debe formatearse)
 */
export const isEnumField = (fieldName: string): boolean => {
  return ENUM_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo debe formatearse solo en onBlur (como email)
 */
export const shouldFormatOnBlur = (fieldName: string): boolean => {
  return EMAIL_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo es VARCHAR (debe ir en MAYÚSCULAS)
 */
export const isVarcharField = (fieldName: string): boolean => {
  return VARCHAR_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo es EMAIL (debe ir en minúsculas)
 */
export const isEmailField = (fieldName: string): boolean => {
  return EMAIL_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo es de fecha/timestamp
 */
export const isDateField = (fieldName: string): boolean => {
  return DATE_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo es ENUM opcional que debe ser null cuando está vacío
 */
export const isNullableEnumField = (fieldName: string): boolean => {
  return NULLABLE_ENUM_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo es UUID que debe ser null cuando está vacío
 */
export const isUuidField = (fieldName: string): boolean => {
  return UUID_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo es UNIQUE opcional que debe ser null cuando está vacío
 */
export const isUniqueOptionalField = (fieldName: string): boolean => {
  return UNIQUE_OPTIONAL_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo es de tipo ARRAY que debe ser null cuando está vacío
 */
export const isArrayField = (fieldName: string): boolean => {
  return ARRAY_FIELDS.includes(fieldName);
};

/**
 * Determina si un campo es de tipo BOOLEAN que debe ser null cuando está vacío
 */
export const isBooleanField = (fieldName: string): boolean => {
  return BOOLEAN_FIELDS.includes(fieldName);
};

/**
 * Formatea automáticamente un valor según el tipo de campo
 * 
 * @param fieldName - Nombre del campo
 * @param value - Valor a formatear
 * @returns Valor formateado según el tipo de campo (siempre string, nunca null)
 */
export const formatFieldValue = (fieldName: string, value: string | null | undefined): string => {
  // Garantizar que siempre retornamos string ('' si es null/undefined)
  // Esto previene warnings de React sobre inputs controlados
  if (!value || typeof value !== 'string') return '';
  
  // NO formatear campos con formato especial (mantener tal como están)
  if (SPECIAL_FORMAT_FIELDS.includes(fieldName)) {
    return value;
  }
  
  // No formatear campos de enumeración
  if (isEnumField(fieldName)) {
    return value;
  }
  
  // Formatear campos VARCHAR a MAYÚSCULAS
  if (isVarcharField(fieldName)) {
    return toUpperCase(value);
  }
  
  // Formatear campos EMAIL a minúsculas
  if (isEmailField(fieldName)) {
    return toLowerCase(value);
  }
  
  // Campos TEXT y otros se mantienen sin cambios (como usuario escribe)
  return value;
};

/**
 * Formatea todos los campos de un objeto según sus tipos
 * 
 * @param data - Objeto con los datos a formatear
 * @returns Objeto con los valores formateados
 */
export const formatFormData = <T extends Record<string, unknown>>(data: T): T => {
  const formatted = { ...data };
  
  Object.keys(formatted).forEach((key) => {
    const value = formatted[key];
    
    // Formatear campos de tipo string
    if (typeof value === 'string') {
      const formattedValue = formatFieldValue(key, value);
      
      // Campos que deben ser null cuando están vacíos (no strings vacíos)
      if (formattedValue === '') {
        if (
          isDateField(key) || 
          isNullableEnumField(key) || 
          isUuidField(key) || 
          isUniqueOptionalField(key) ||
          isArrayField(key) ||
          isBooleanField(key)
        ) {
          (formatted as Record<string, unknown>)[key] = null;
        } else {
          (formatted as Record<string, unknown>)[key] = formattedValue;
        }
      } else {
        (formatted as Record<string, unknown>)[key] = formattedValue;
      }
    } else if (value === null || value === undefined) {
      // Para campos especiales: mantener null (PostgreSQL constraints)
      if (
        isDateField(key) || 
        isNullableEnumField(key) || 
        isUuidField(key) || 
        isUniqueOptionalField(key) ||
        isArrayField(key) ||
        isBooleanField(key)
      ) {
        (formatted as Record<string, unknown>)[key] = null;
      } else {
        // Para otros campos: string vacío para prevenir warnings de React en inputs
        (formatted as Record<string, unknown>)[key] = '';
      }
    }
  });
  
  return formatted;
};

/**
 * Hook personalizado para formatear datos antes de enviar al backend
 * Uso en hooks de formularios:
 * 
 * import { formatFormData } from '@/utils/fieldFormatters';
 * 
 * const handleSubmit = async () => {
 *   const formattedData = formatFormData(formData);
 *   await createCliente(formattedData);
 * };
 */
export const useFieldFormatter = () => {
  return {
    formatFieldValue,
    formatFormData,
    toUpperCase,
    toLowerCase,
    formatCPF,
    formatPhone,
    validateCPF,
    validateEmail,
    isVarcharField,
    isEmailField,
    isEnumField,
  };
};
