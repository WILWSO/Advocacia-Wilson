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
  COPIED: 'Copiado para área de transferência',
  
  // Mensajes específicos por entidad
  clientes: {
    CREATED: 'Cliente criado com sucesso',
    UPDATED: 'Cliente atualizado com sucesso',
    DELETED: 'Cliente excluído com sucesso',
  },
  processos: {
    CREATED: 'Processo criado com sucesso',
    UPDATED: 'Processo atualizado com sucesso',
    DELETED: 'Processo excluído com sucesso',
    LINK_ADDED: 'Link adicionado com sucesso',
    LINK_UPDATED: 'Link atualizado com sucesso',
    LINK_DELETED: 'Link excluído com sucesso',
    JURISPRUDENCIA_ADDED: 'Jurisprudência adicionada com sucesso',
    JURISPRUDENCIA_UPDATED: 'Jurisprudência atualizada com sucesso',
    JURISPRUDENCIA_DELETED: 'Jurisprudência excluída com sucesso',
  },
  usuarios: {
    CREATED: 'Usuário criado com sucesso',
    UPDATED: 'Usuário atualizado com sucesso',
    DELETED: 'Usuário excluído com sucesso',
    PASSWORD_CHANGED: 'Senha alterada com sucesso',
    PHOTO_UPLOADED: 'Foto de perfil atualizada com sucesso',
  },
  posts: {
    CREATED: 'Publicação criada com sucesso',
    UPDATED: 'Publicação atualizada com sucesso',
    DELETED: 'Publicação excluída com sucesso',
    PUBLISHED: 'Conteúdo publicado!',
    UNPUBLISHED: 'Conteúdo despublicado!',
  },
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
  VALIDATION_ERROR: 'Erro de validação. Verifique os campos',
  
  // Errores específicos por entidad
  clientes: {
    SAVE_ERROR: 'Erro ao salvar cliente',
    DELETE_ERROR: 'Erro ao deletar cliente',
    CREATE_ERROR: 'Erro ao criar cliente. Por favor, tente novamente.',
    UPDATE_ERROR: 'Erro ao atualizar cliente',
    LOAD_ERROR: 'Erro ao carregar clientes',
  },
  processos: {
    SAVE_ERROR: 'Erro ao salvar processo',
    DELETE_ERROR: 'Erro ao deletar processo',
    CREATE_ERROR: 'Erro ao criar processo',
    UPDATE_ERROR: 'Erro ao atualizar processo',
    LOAD_ERROR: 'Erro ao carregar processos',
  },
  usuarios: {
    SAVE_ERROR: 'Erro ao salvar usuário',
    DELETE_ERROR: 'Erro ao deletar usuário',
    CREATE_ERROR: 'Erro ao criar usuário',
    UPDATE_ERROR: 'Erro ao atualizar usuário',
    PASSWORD_REQUIRED: 'Senha é obrigatória para criar usuário',
    PASSWORD_UPDATE_ERROR: 'Erro ao atualizar senha',
    PHOTO_UPLOAD_ERROR: 'Erro ao enviar foto. Tente novamente.',
    PHOTO_REMOVE_ERROR: 'Erro ao remover foto',
    LOAD_ERROR: 'Erro ao carregar usuários',
  },
  audiencias: {
    SAVE_ERROR: 'Erro ao salvar audiência',
    DELETE_ERROR: 'Erro ao excluir audiência',
    CREATE_ERROR: 'Erro ao criar audiência',
    UPDATE_ERROR: 'Erro ao atualizar audiência',
    LOAD_ERROR: 'Erro ao carregar audiências',
  },
  posts: {
    SAVE_ERROR: 'Erro ao salvar publicação',
    DELETE_ERROR: 'Erro ao excluir post',
    CREATE_ERROR: 'Erro ao criar post',
    UPDATE_ERROR: 'Erro ao atualizar post',
    LOAD_ERROR: 'Erro ao carregar posts',
  },
  comentarios: {
    LOAD_ERROR: 'Erro ao carregar comentários',
    ADD_ERROR: 'Erro ao adicionar comentário',
  },
  comments: {
    LOAD_ERROR: 'Error loading comments',
    SUBMIT_ERROR: 'Error submitting comment',
  },
  auth: {
    LOGIN_ERROR: 'Erro ao fazer login. Tente novamente.',
    CONNECTION_ERROR: 'Erro de conexão. Verifique sua internet.',
  },
  form: {
    INTERNAL_SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  },
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
  URL_INVALID: 'URL inválida',
  
  // Validaciones específicas
  LINK_TITULO_REQUIRED: 'Por favor, preencha o título do link',
  LINK_URL_REQUIRED: 'Por favor, preencha a URL do link',
  LINK_INVALID: 'Por favor, preencha o título e o link',
  EMENTA_REQUIRED: 'Por favor, preencha a ementa',
  JURISPRUDENCIA_INVALID: 'Por favor, preencha a ementa e o link',
  AUDIENCIA_INVALID: 'Por favor, preencha todos os campos obrigatórios da audiência',
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
  OVERWRITE: 'Este arquivo já existe. Deseja sobrescrever?',
  
  // Confirmaciones específicas por entidad
  clientes: {
    DELETE: 'Tem certeza que deseja excluir este cliente?',
    DELETE_TITLE: 'Excluir Cliente',
    CANCEL_EDIT: 'Descartar alterações no cliente?',
  },
  processos: {
    DELETE: 'Tem certeza que deseja excluir este processo?',
    DELETE_TITLE: 'Excluir Processo',
    CANCEL_EDIT: 'Descartar alterações no processo?',
    DELETE_LINK: 'Tem certeza que deseja excluir este link?',
    DELETE_JURISPRUDENCIA: 'Tem certeza que deseja excluir esta jurisprudência?',
    DELETE_AUDIENCIA: 'Tem certeza que deseja excluir esta audiência?',
  },
  usuarios: {
    DELETE: 'Tem certeza que deseja excluir este usuário?',
    DELETE_TITLE: 'Excluir Usuário',
    CANCEL_EDIT: 'Descartar alterações no usuário?',
    CHANGE_PASSWORD: 'Deseja alterar a senha do usuário?',
  },
  posts: {
    DELETE: 'Tem certeza que deseja excluir esta publicação?',
    DELETE_TITLE: 'Excluir Publicação',
    CANCEL_EDIT: 'Descartar alterações na publicação?',
    TOGGLE_PUBLISH: 'Deseja alterar o status de publicação?',
  },
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
 * Mensajes de Google Calendar
 */
export const GOOGLE_CALENDAR_MESSAGES = {
  NOT_CONFIGURED: 'Google Calendar não está configurado. Verifique as variáveis de ambiente',
  TOKEN_EXCHANGE_ERROR: 'Erro ao trocar código por tokens',
  TOKEN_REFRESH_ERROR: 'Erro ao renovar token de acesso',
  NO_VALID_TOKEN: 'Não há token válido para Google Calendar',
  AUTH_SUCCESS: 'Autenticação com Google Calendar realizada com sucesso',
  EVENT_CREATE_SUCCESS: 'Evento criado no Google Calendar',
  EVENT_CREATE_ERROR: 'Erro ao criar evento no Google Calendar',
  EVENT_UPDATE_SUCCESS: 'Evento atualizado no Google Calendar',
  EVENT_UPDATE_ERROR: 'Erro ao atualizar evento no Google Calendar',
  EVENT_DELETE_SUCCESS: 'Evento excluído do Google Calendar',
  EVENT_DELETE_ERROR: 'Erro ao excluir evento do Google Calendar',
  DISCONNECTED: 'Google Calendar desconectado com sucesso',
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

/**
 * Mensajes de Layout y UI
 * ✅ SSoT: Textos de navegación, headers, footers y componentes de layout
 */
export const UI_LAYOUT = {
  HEADER: {
    CONSULTATION_BUTTON: 'Consulta',
    SCHEDULE_CONSULTATION: 'Agendar consulta jurídica',
    DASHBOARD_BUTTON: 'Dashboard',
    PAGE_DROPDOWN: 'Página',
    NOTIFICATIONS: 'Notificações',
    VIEW_NOTIFICATIONS: 'Ver notificações',
    MY_PROFILE: 'Meu Perfil',
    SETTINGS: 'Configurações',
    LOGOUT: 'Sair',
    GO_TO_HOME: 'Ir para página inicial',
    CLOSE_MENU: 'Fechar menu',
    OPEN_MENU: 'Abrir menu de navegação',
    CLOSE_NAV_MENU: 'Fechar menu de navegação'
  },
  MOBILE_MENU: {
    CONSULTATION_CTA: 'Agende sua consulta gratuita hoje mesmo',
    SCHEDULE_BUTTON: 'Agendar Consulta',
    CONTACT_LINK: '/contato'
  },
  FOOTER: {
    QUICK_LINKS_TITLE: 'Links Rápidos',
    PRACTICE_AREAS_TITLE: 'Áreas de Atuação',
    CONTACT_TITLE: 'Contato',
    COPYRIGHT: 'Todos os direitos reservados.',
    PRIVACY_POLICY: 'Política de Privacidade',
    TERMS_OF_USE: 'Termos de Uso',
    VISIT_SOCIAL: 'Visite nosso'
  },
  SKIP_LINKS: {
    TO_MAIN_CONTENT: 'Pular para o conteúdo principal',
    TO_NAVIGATION: 'Pular para a navegação',
    TO_FOOTER: 'Pular para o rodapé',
    SKIP_NAV_LABEL: 'Links de navegação rápida'
  }
} as const;

/**
 * Mensajes de secciones Home
 * ✅ SSoT: Textos de las secciones principales de la página home
 */
export const HOME_SECTIONS = {
  HERO: {
    CTA_CONSULTATION: 'Agende uma Consulta',
    CTA_AREAS: 'Áreas de Atuação',
    CTA_AREAS_ARIA: 'Conhecer todas as áreas de atuação jurídica do escritório',
  },
  ABOUT: {
    OVERLINE: 'Sobre Nós',
    TITLE: 'O que é Advocacia Integral em Serviços Jurídicos?',
    CTA_HISTORY: 'Conheça Nossa História',
  },
  TEAM: {
    OVERLINE: 'Nossa Equipe',
    TITLE: 'Conheça Nossos Especialistas',
    DESCRIPTION: 'Contamos com uma equipe de profissionais altamente qualificados e experientes, comprometidos em oferecer o melhor atendimento e as soluções mais eficazes.',
    CTA_ALL_TEAM: 'Conheça toda nossa equipe',
  },
  PRACTICE_AREAS: {
    OVERLINE: 'Nossos Serviços',
    TITLE: 'Áreas de Atuação',
    DESCRIPTION: 'Oferecemos soluções jurídicas completas em diversas áreas do Direito, combinando conhecimento técnico, experiência e visão estratégica.',
    LINK_MORE: 'Saiba mais',
  },
  TESTIMONIALS: {
    OVERLINE: 'Depoimentos',
    TITLE: 'O Que Nossos Clientes Dizem',
    DESCRIPTION: 'A satisfação de nossos clientes é o reflexo do nosso compromisso com a excelência e dedicação em cada caso.',
    ARIA_PREV: 'Depoimento anterior',
    ARIA_NEXT: 'Próximo depoimento',
    ARIA_GO_TO: 'Ir para o depoimento',
  },
  CONTACT: {
    OVERLINE: 'Contato',
    TITLE: 'Entre em Contato Conosco',
    DESCRIPTION: 'Estamos à disposição para esclarecer suas dúvidas e auxiliar com as melhores soluções jurídicas para suas necessidades.',
    INFO_TITLE: 'Informações de Contato',
  }
} as const;

/**
 * Textos de componentes de autenticación
 * ✅ SSoT: Mensajes de login, logout y rutas protegidas
 */
export const AUTH_UI = {
  LOGIN: {
    BUTTON_LABEL: 'Entrar',
    BUTTON_TITLE: 'Fazer login',
    BUTTON_ARIA: 'Fazer login',
    MODAL_TITLE: 'Login',
    EMAIL_LABEL: 'Email',
    PASSWORD_LABEL: 'Senha',
    SUBMIT_BUTTON: 'Entrar',
    CANCEL_BUTTON: 'Cancelar',
    LOADING_TEXT: 'Entrando...',
    ERROR_MESSAGE: 'Login falhou. Verifique suas credenciais.',
  },
  LOGOUT: {
    BUTTON_LABEL: 'Sair',
    BUTTON_TITLE: 'Sair da conta',
    BUTTON_ARIA: 'Sair da conta',
  },
  PROTECTED_ROUTE: {
    LOADING_MESSAGE: 'Verificando autenticação...',
    ACCESS_DENIED_TITLE: 'Acesso Negado',
    ACCESS_DENIED_MESSAGE: 'Você não tem permissão para acessar esta página.',
    YOUR_ROLE: 'Sua função:',
    REQUIRED_ROLES: 'Funções necessárias:',
    UNKNOWN_ROLE: 'Desconhecido',
    BACK_BUTTON: 'Voltar',
  },
} as const;

/**
 * Textos de componentes de agenda/calendario
 * ✅ SSoT: Mensajes de vistas de calendario (mes, semana, día, lista)
 */
export const AGENDA_UI = {
  EMPTY_STATE: {
    NO_HEARINGS_TITLE: 'Nenhuma audiência agendada',
    NO_HEARINGS_MESSAGE: 'Clique em "Nova Audiência" para criar sua primeira audiência',
    NO_HEARINGS_DAY: 'Sem audiências programadas',
    NO_HEARINGS_DAY_MESSAGE: 'Este dia não tem audiências agendadas',
    NO_HEARINGS_WEEK: 'Sem audiências',
  },
  LABELS: {
    TODAY: 'Hoje',
    TOMORROW: 'Amanhã',
    PROCESS: 'Processo',
    PROCESS_JURIDICO: 'Processo Jurídico',
    LOCAL: 'Local',
    OBSERVATIONS: 'Observações',
    EDIT: 'Editar',
    DELETE: 'Eliminar',
    JOIN_MEETING: 'Entrar na reunião',
    MEETING_LINK: 'Link da reunião',
    MORE_ITEMS: 'mais',
    HEARING: 'audiência',
    HEARINGS: 'audiências',
  },
  WEEK_DAYS_SHORT: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const,
} as const;

/**
 * Textos de componentes administrativos
 * ✅ SSoT: Mensajes de modales, formularios y gestión CRUD del área admin
 */
export const ADMIN_UI = {
  POST: {
    MODAL_TITLE_CREATE: 'Criar Novo Conteúdo',
    MODAL_TITLE_EDIT: 'Editar Conteúdo',
    SUBMIT_CREATE: 'Criar',
    SUBMIT_UPDATE: 'Atualizar',
    CANCEL: 'Cancelar',
    TYPE_LABEL: 'Tipo de Conteúdo',
    TITLE_LABEL: 'Título',
    TITLE_REQUIRED: 'Título *',
    TITLE_PLACEHOLDER: 'Digite o título do conteúdo...',
    CONTENT_LABEL: 'Conteúdo',
    CONTENT_REQUIRED: 'Conteúdo *',
    CONTENT_PLACEHOLDER: 'Escreva o conteúdo aqui...',
    IMAGE_URL_LABEL: 'URL da Imagem',
    IMAGE_URL_PLACEHOLDER: 'Cole a URL da imagem aqui...',
    VIDEO_URL_LABEL: 'URL do Vídeo (YouTube)',
    VIDEO_URL_PLACEHOLDER: 'https://www.youtube.com/watch?v=... ou https://youtu.be/...',
    VIDEO_URL_HELPER: 'Suporta links do YouTube (youtube.com e youtu.be)',
    TAGS_LABEL: 'Tags (separadas por vírgula)',
    TAGS_PLACEHOLDER: 'direito, civil, penal, trabalhista...',
    FEATURED_LABEL: 'Conteúdo em destaque',
    PUBLISH_LABEL: 'Publicar imediatamente',
  },
  POST_TYPES: {
    article: 'Artigo',
    video: 'Vídeo',
    image: 'Imagem',
    announcement: 'Anúncio',
  } as const,
  CRUD: {
    ADD_BUTTON: 'Adicionar',
    VIEW_BUTTON: 'Ver',
    SAVE_BUTTON: 'Salvar',
    CANCEL_BUTTON: 'Cancelar',
    EDIT_BUTTON: 'Editar',
    DELETE_BUTTON: 'Excluir',
    EMPTY_TEXT: 'Nenhum item adicionado',
    REQUIRED_FIELDS_ERROR: 'Por favor, preencha todos os campos obrigatórios',
    DELETE_TITLE: 'Excluir Item',
    DELETE_CONFIRM: 'Deseja realmente remover este item?',
    SELECT_PLACEHOLDER: 'Selecione...',
    CLOSE_MODAL: 'Fechar modal',
  },
  DOCUMENT: {
    UPLOAD_BUTTON: 'Adicionar Documento',
    UPLOADING: 'Enviando...',
    ERROR_FILE_TOO_LARGE: 'O arquivo é muito grande. Tamanho máximo: {maxSize}MB',
    ERROR_FILE_TYPE: 'Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, JPG, PNG',
    ERROR_UPLOAD: 'Erro ao fazer upload do arquivo',
    SUCCESS_UPLOAD: 'Documento enviado com sucesso!',
    ERROR_SEND: 'Erro ao enviar documento. Tente novamente.',
    ERROR_VIEW: 'Erro ao visualizar documento. Verifique as permissões no Supabase Storage.',
    SUCCESS_DOWNLOAD: 'Download iniciado com sucesso!',
    ERROR_DOWNLOAD: 'Erro ao baixar documento. Tente novamente.',
    DELETE_TITLE: 'Excluir Documento',
    DELETE_MESSAGE: 'Deseja realmente remover o documento "{name}"? Esta ação não pode ser desfeita.',
    DELETE_CONFIRM: 'Excluir',
    DELETE_CANCEL: 'Cancelar',
    SUCCESS_DELETE: 'Documento removido com sucesso!',
    ERROR_DELETE: 'Erro ao remover documento. Tente novamente.',
    EMPTY_TEXT: 'Nenhum documento anexado',
    VIEW_ARIA: 'Visualizar {name}',
    DOWNLOAD_ARIA: 'Baixar {name}',
    DELETE_ARIA: 'Remover {name}',
  },
  AUDIENCIA: {
    MODAL_TITLE_CREATE: 'Nova Audiência',
    MODAL_TITLE_EDIT: 'Editar Audiência',
    TIP_MESSAGE: 'Dica: Para audiências virtuais ou híbridas, não esqueça de adicionar o link da reunião.',
    PROCESS_LABEL: 'Processo',
    PROCESS_REQUIRED: 'Processo *',
    PROCESS_PLACEHOLDER: 'Selecione um processo',
    DATE_LABEL: 'Data',
    DATE_REQUIRED: 'Data *',
    TIME_LABEL: 'Hora',
    TIME_REQUIRED: 'Hora *',
    TYPE_LABEL: 'Tipo de Audiência',
    TYPE_REQUIRED: 'Tipo de Audiência *',
    FORM_LABEL: 'Forma',
    FORM_REQUIRED: 'Forma *',
    LOCAL_LABEL: 'Local / Vara',
    LOCAL_PLACEHOLDER: 'Ex: 1ª Vara Cível, Sala 205',
    LINK_LABEL: 'Link da Reunião Virtual',
    LINK_PLACEHOLDER: 'https://meet.google.com/...',
    OBSERVATIONS_LABEL: 'Observações',
    OBSERVATIONS_PLACEHOLDER: 'Observações adicionais sobre a audiência...',
  },
  RESTRICTED_FIELD: {
    DEFAULT_MESSAGE: 'Você não tem permissão para editar este campo',
  },
  SIDEBAR: {
    AGENDA: 'Agenda',
    PROCESSOS: 'Processos',
    CLIENTES: 'Clientes',
    USUARIOS: 'Usuários',
    SOCIAL: 'Social',
  },
} as const;

/**
 * Textos de páginas administrativas
 * ✅ SSoT: Mensajes, filtros, estadísticas y estados vacíos de páginas
 */
export const PAGES_UI = {
  // Estadísticas comunes
  STATS: {
    TOTAL: 'Total',
    ATIVOS: 'Ativos',
    INATIVOS: 'Inativos',
    PUBLICADOS: 'Publicados',
    RASCUNHOS: 'Rascunhos',
    DESTAQUES: 'Destaques',
  },
  
  // ClientesPage
  CLIENTES: {
    TITLE: 'Gestão de Clientes',
    DESCRIPTION: 'Gerencie cadastro e informações dos clientes',
    NEW_BUTTON: 'Novo Cliente',
    STATS: {
      TOTAL: 'Total de Clientes',
      POTENCIAIS: 'Potenciais',
    },
    FILTERS: {
      SEARCH_PLACEHOLDER: 'Buscar por nome, email, CPF/CNPJ ou telefone...',
      ALL_STATUS: 'Todos os Status',
      STATUS_ATIVO: 'Ativos',
      STATUS_POTENCIAL: 'Potenciais',
      STATUS_INATIVO: 'Inativos',
    },
    EMPTY: {
      TITLE: 'Nenhum cliente encontrado',
      LOADING: 'Carregando clientes...',
      NO_DATA: 'Comece cadastrando seu primeiro cliente',
      TRY_FILTERS: 'Tente ajustar os filtros de busca',
    },
  },
  
  // UsuariosPage
  USUARIOS: {
    TITLE: 'Gestão de Usuários',
    DESCRIPTION: 'Gerencie os usuários do sistema',
    NEW_BUTTON: 'Novo Usuário',
    STATS: {
      ADMINS: 'Admins',
      ADVOGADOS: 'Advogados',
      ASSISTENTES: 'Assistentes',
    },
    FILTERS: {
      SEARCH_LABEL: 'Buscar',
      SEARCH_PLACEHOLDER: 'Nome ou email...',
      ROLE_LABEL: 'Role',
      STATUS_LABEL: 'Status',
      ALL: 'Todos',
      ADMIN: 'Administrador',
      ADVOGADO: 'Advogado',
      ASSISTENTE: 'Assistente',
    },
    EMPTY: {
      TITLE: 'Nenhum usuário encontrado',
    },
    MODAL: {
      EDIT_TITLE: 'Editar Usuário',
      SAVE: 'Salvar',
      EDIT_BUTTON: 'Editar',
      DELETE_BUTTON: 'Excluir',
    },
  },
  
  // ProcessosPage
  PROCESSOS: {
    TITLE: 'Gestão de Processos',
    NEW_BUTTON: 'Novo Processo',
    MODAL: {
      TITLE_EDIT: 'Editar Processo',
      TITLE_NEW: 'Novo Processo',
      SUBMIT_UPDATE: 'Atualizar',
      SUBMIT_SAVE: 'Salvar',
      CANCEL: 'Cancelar',
    },
    PERMISSIONS: {
      ADMIN_ONLY: 'Apenas admin pode editar',
      ADMIN_LAWYER: 'Apenas admin e advogado podem editar',
      STATUS_RESTRICTION: 'Apenas administradores e advogados podem alterar o status',
    },
    SECTIONS: {
      DOCUMENTS: 'Adicionar Documento',
      LINKS: 'Adicionar Link',
      JURISPRUDENCIA: 'Adicionar Jurisprudência',
    },
    EMPTY: {
      TITLE: 'Nenhum processo encontrado',
    },
  },
  
  // SocialPage
  SOCIAL: {
    TITLE: 'Administração Social',
    DESCRIPTION: 'Gerencie notícias, vídeos e conteúdos importantes',
    NEW_BUTTON: 'Novo Conteúdo',
    FILTERS: {
      SEARCH_PLACEHOLDER: 'Buscar por título ou conteúdo...',
    },
    EMPTY: {
      TITLE: 'Nenhum conteúdo encontrado',
      LOADING: 'Carregando conteúdos...',
    },
  },
} as const;
