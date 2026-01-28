/**
 * Sistema Centralizado de Mensajes de UI
 * 
 * Single Source of Truth (SSoT) para mensajes del sistema.
 * Cambiar aquí afecta todo el sistema.
 * 
 * @module config/messages
 */

/**
 * Mensajes de autenticación
 */
export const AUTH_MESSAGES = {
  LOGIN_REQUIRED: 'Faça login para acessar o painel administrativo',
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  LOGIN_ERROR: 'Email ou senha incorretos',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso',
  SESSION_EXPIRED: 'Sua sessão expirou. Por favor, faça login novamente',
  UNAUTHORIZED: 'Você não tem permissão para acessar esta área',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  PASSWORD_RESET_REQUIRED: 'Esqueceu sua senha? Entre em contato com o administrador'
} as const;

/**
 * Mensajes de permisos
 */
export const PERMISSION_MESSAGES = {
  ADMIN_ONLY: 'Apenas administradores podem realizar esta ação',
  ADMIN_ONLY_EDIT: 'Apenas admin pode editar',
  ADMIN_ONLY_DELETE: 'Apenas administradores podem excluir',
  ADMIN_ONLY_CREATE: 'Apenas administradores podem criar',
  ADMIN_ONLY_CHANGE: 'Somente Admin pode alterar',
  ADVOGADO_ADMIN_ONLY: 'Apenas administradores e advogados podem realizar esta ação',
  ADVOGADO_ADMIN_EDIT: 'Apenas administradores e advogados podem editar',
  READ_ONLY: 'Você tem permissão apenas para visualização',
  CANNOT_EDIT_STATUS: 'Apenas administradores e advogados podem alterar o status',
  NO_PERMISSION: 'Você não tem permissão para esta operação'
} as const;

/**
 * Mensajes de éxito
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Dados salvos com sucesso',
  CREATED: 'Registro criado com sucesso',
  UPDATED: 'Registro atualizado com sucesso',
  DELETED: 'Registro excluído com sucesso',
  UPLOADED: 'Arquivo enviado com sucesso',
  SENT: 'Enviado com sucesso',
  COPIED: 'Copiado para área de transferência'
} as const;

/**
 * Mensajes de error
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente',
  NETWORK: 'Erro de conexão. Verifique sua internet',
  NOT_FOUND: 'Registro não encontrado',
  ALREADY_EXISTS: 'Este registro já existe',
  INVALID_DATA: 'Dados inválidos',
  REQUIRED_FIELDS: 'Preencha todos os campos obrigatórios',
  SAVE_ERROR: 'Erro ao salvar dados',
  DELETE_ERROR: 'Erro ao excluir registro',
  UPLOAD_ERROR: 'Erro ao enviar arquivo',
  LOAD_ERROR: 'Erro ao carregar dados',
  VALIDATION_ERROR: 'Erro de validação. Verifique os campos'
} as const;

/**
 * Mensajes de validación
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo é obrigatório',
  EMAIL_INVALID: 'Email inválido',
  CPF_INVALID: 'CPF inválido',
  CNPJ_INVALID: 'CNPJ inválido',
  PHONE_INVALID: 'Telefone inválido',
  PASSWORD_MIN_LENGTH: 'Senha deve ter no mínimo 6 caracteres',
  PASSWORD_MISMATCH: 'As senhas não coincidem',
  FILE_TOO_LARGE: 'Arquivo muito grande. Tamanho máximo: ',
  FILE_INVALID_TYPE: 'Tipo de arquivo não permitido',
  DATE_INVALID: 'Data inválida',
  NUMBER_INVALID: 'Número inválido',
  URL_INVALID: 'URL inválida'
} as const;

/**
 * Mensajes de confirmación
 */
export const CONFIRMATION_MESSAGES = {
  DELETE: 'Tem certeza que deseja excluir este registro?',
  DELETE_MULTIPLE: 'Tem certeza que deseja excluir os registros selecionados?',
  CANCEL: 'Tem certeza que deseja cancelar? As alterações não salvas serão perdidas',
  LOGOUT: 'Tem certeza que deseja sair?',
  DISCARD_CHANGES: 'Descartar alterações não salvas?',
  OVERWRITE: 'Este arquivo já existe. Deseja sobrescrever?'
} as const;

/**
 * Mensajes de carga/loading
 */
export const LOADING_MESSAGES = {
  LOADING: 'Carregando...',
  SAVING: 'Salvando...',
  DELETING: 'Excluindo...',
  UPLOADING: 'Enviando...',
  PROCESSING: 'Processando...',
  SEARCHING: 'Buscando...',
  PLEASE_WAIT: 'Por favor, aguarde...'
} as const;

/**
 * Mensajes de estado vacío
 */
export const EMPTY_STATE_MESSAGES = {
  NO_DATA: 'Nenhum registro encontrado',
  NO_RESULTS: 'Nenhum resultado para sua busca',
  NO_CLIENTES: 'Nenhum cliente cadastrado',
  NO_PROCESSOS: 'Nenhum processo cadastrado',
  NO_USUARIOS: 'Nenhum usuário cadastrado',
  NO_POSTS: 'Nenhuma publicação disponível',
  NO_DOCUMENTS: 'Nenhum documento anexado',
  START_ADDING: 'Comece adicionando um novo registro'
} as const;

/**
 * Mensajes informativos
 */
export const INFO_MESSAGES = {
  UNSAVED_CHANGES: 'Você tem alterações não salvas',
  FILE_SIZE_LIMIT: 'Tamanho máximo do arquivo: ',
  ALLOWED_FORMATS: 'Formatos permitidos: ',
  OPTIONAL_FIELD: 'Campo opcional',
  HELP_TEXT: 'Clique no ícone de ajuda para mais informações',
  BETA_FEATURE: 'Esta funcionalidade está em fase beta'
} as const;

/**
 * Helper para obter mensaje de erro por código
 */
export const getErrorMessage = (code?: string): string => {
  const errorMap: Record<string, string> = {
    'auth/user-not-found': AUTH_MESSAGES.INVALID_CREDENTIALS,
    'auth/wrong-password': AUTH_MESSAGES.INVALID_CREDENTIALS,
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'network-error': ERROR_MESSAGES.NETWORK,
    '404': ERROR_MESSAGES.NOT_FOUND,
    '500': ERROR_MESSAGES.GENERIC
  };
  
  return errorMap[code || ''] || ERROR_MESSAGES.GENERIC;
};
