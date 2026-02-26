// Validadores de formulario para seguridad del lado del cliente
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export class FormValidator {
  
  /**
   * Valida nombre completo
   */
  static validateName(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Nome é obrigatório');
    } else if (name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    } else if (name.trim().length > 100) {
      errors.push('Nome não pode exceder 100 caracteres');
    } else if (!/^[a-zA-ZÀ-ÿ\s''-]+$/.test(name.trim())) {
      errors.push('Nome deve conter apenas letras e espaços');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida email
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email || email.trim().length === 0) {
      errors.push('E-mail é obrigatório');
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        errors.push('E-mail deve ter um formato válido');
      } else if (email.length > 254) {
        errors.push('E-mail não pode exceder 254 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida telefone (opcional)
   */
  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    
    // Telefone é opcional, mas se fornecido deve ser válido
    if (phone && phone.trim().length > 0) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        errors.push('Telefone deve ter entre 10 e 15 dígitos');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida assunto
   */
  static validateSubject(subject: string): ValidationResult {
    const errors: string[] = [];
    
    if (!subject || subject.trim().length === 0) {
      errors.push('Assunto é obrigatório');
    } else {
      const validSubjects = ['Consulta', 'Contratação', 'Dúvida', 'Outro'];
      if (!validSubjects.includes(subject)) {
        errors.push('Assunto deve ser uma opção válida');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida mensagem
   */
  static validateMessage(message: string): ValidationResult {
    const errors: string[] = [];
    
    if (!message || message.trim().length === 0) {
      errors.push('Mensagem é obrigatória');
    } else if (message.trim().length < 10) {
      errors.push('Mensagem deve ter pelo menos 10 caracteres');
    } else if (message.length > 5000) {
      errors.push('Mensagem não pode exceder 5000 caracteres');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida formulário completo de contato
   */
  static validateContactForm(formData: ContactFormData): ValidationResult {
    const nameValidation = this.validateName(formData.name);
    const emailValidation = this.validateEmail(formData.email);
    const phoneValidation = this.validatePhone(formData.phone);
    const subjectValidation = this.validateSubject(formData.subject);
    const messageValidation = this.validateMessage(formData.message);

    const allErrors = [
      ...nameValidation.errors,
      ...emailValidation.errors,
      ...phoneValidation.errors,
      ...subjectValidation.errors,
      ...messageValidation.errors
    ];

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  /**
   * Valida campo requerido genérico
   */
  static validateRequired(value: string, fieldName: string = 'Campo'): ValidationResult {
    const errors: string[] = [];
    
    if (!value || value.trim().length === 0) {
      errors.push(`${fieldName} é obrigatório`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida URL
   */
  static validateURL(url: string, fieldName: string = 'Link'): ValidationResult {
    const errors: string[] = [];
    
    if (!url || url.trim().length === 0) {
      errors.push(`${fieldName} é obrigatório`);
    } else {
      try {
        new URL(url.trim());
        // Validar que sea http o https
        if (!url.trim().match(/^https?:\/\//i)) {
          errors.push(`${fieldName} deve começar com http:// ou https://`);
        }
      } catch {
        errors.push(`${fieldName} deve ser uma URL válida`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida título genérico
   */
  static validateTitulo(titulo: string, minLength: number = 3, maxLength: number = 200): ValidationResult {
    const errors: string[] = [];
    
    if (!titulo || titulo.trim().length === 0) {
      errors.push('Título é obrigatório');
    } else if (titulo.trim().length < minLength) {
      errors.push(`Título deve ter pelo menos ${minLength} caracteres`);
    } else if (titulo.length > maxLength) {
      errors.push(`Título não pode exceder ${maxLength} caracteres`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida ementa de jurisprudência
   */
  static validateEmenta(ementa: string): ValidationResult {
    const errors: string[] = [];
    
    if (!ementa || ementa.trim().length === 0) {
      errors.push('Ementa é obrigatória');
    } else if (ementa.trim().length < 10) {
      errors.push('Ementa deve ter pelo menos 10 caracteres');
    } else if (ementa.length > 5000) {
      errors.push('Ementa não pode exceder 5000 caracteres');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida CPF brasileiro
   */
  static validateCPF(cpf: string): ValidationResult {
    const errors: string[] = [];
    
    if (!cpf || cpf.trim().length === 0) {
      return { isValid: true, errors: [] }; // CPF é opcional
    }
    
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    if (cleanCPF.length !== 11) {
      errors.push('CPF deve ter 11 dígitos');
      return { isValid: false, errors };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCPF)) {
      errors.push('CPF inválido');
      return { isValid: false, errors };
    }
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    
    if (digit !== parseInt(cleanCPF.charAt(9))) {
      errors.push('CPF inválido');
      return { isValid: false, errors };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    
    if (digit !== parseInt(cleanCPF.charAt(10))) {
      errors.push('CPF inválido');
      return { isValid: false, errors };
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida CNPJ brasileiro
   */
  static validateCNPJ(cnpj: string): ValidationResult {
    const errors: string[] = [];
    
    if (!cnpj || cnpj.trim().length === 0) {
      return { isValid: true, errors: [] }; // CNPJ é opcional
    }
    
    // Remove caracteres não numéricos
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    
    if (cleanCNPJ.length !== 14) {
      errors.push('CNPJ deve ter 14 dígitos');
      return { isValid: false, errors };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCNPJ)) {
      errors.push('CNPJ inválido');
      return { isValid: false, errors };
    }
    
    // Validação do primeiro dígito verificador
    let length = cleanCNPJ.length - 2;
    let numbers = cleanCNPJ.substring(0, length);
    const digits = cleanCNPJ.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) {
      errors.push('CNPJ inválido');
      return { isValid: false, errors };
    }
    
    // Validação do segundo dígito verificador
    length = length + 1;
    numbers = cleanCNPJ.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) {
      errors.push('CNPJ inválido');
      return { isValid: false, errors };
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida CEP brasileiro
   */
  static validateCEP(cep: string): ValidationResult {
    const errors: string[] = [];
    
    if (!cep || cep.trim().length === 0) {
      return { isValid: true, errors: [] }; // CEP é opcional
    }
    
    const cleanCEP = cep.replace(/[^\d]/g, '');
    
    if (cleanCEP.length !== 8) {
      errors.push('CEP deve ter 8 dígitos');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida número de endereço
   */
  static validateNumeroEndereco(numero: string): ValidationResult {
    const errors: string[] = [];
    
    if (!numero || numero.trim().length === 0) {
      return { isValid: true, errors: [] }; // Número é opcional
    }
    
    if (numero.trim().length > 10) {
      errors.push('Número não pode exceder 10 caracteres');
    }
    
    // Solo alfanuméricos, guiones y espacios
    if (!/^[0-9A-Za-z\s\-/]*$/.test(numero.trim())) {
      errors.push('Número deve conter apenas letras, números, espaços, hífens ou barras');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida telefone/celular brasileiro
   */
  static validateTelefoneBR(telefone: string, obrigatorio: boolean = false): ValidationResult {
    const errors: string[] = [];
    
    if (!telefone || telefone.trim().length === 0) {
      if (obrigatorio) {
        errors.push('Telefone é obrigatório');
      }
      return { isValid: errors.length === 0, errors };
    }
    
    const cleanPhone = telefone.replace(/[^\d]/g, '');
    
    // Telefone fixo: 10 dígitos (XX) XXXX-XXXX
    // Celular: 11 dígitos (XX) 9XXXX-XXXX
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      errors.push('Telefone deve ter 10 dígitos (fixo) ou 11 dígitos (celular)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida estado brasileiro (UF)
   */
  static validateEstadoBR(estado: string): ValidationResult {
    const errors: string[] = [];
    
    if (!estado || estado.trim().length === 0) {
      return { isValid: true, errors: [] }; // Estado é opcional
    }
    
    const estadosValidos = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    
    if (!estadosValidos.includes(estado.toUpperCase())) {
      errors.push('Estado deve ser uma UF válida (ex: SP, RJ, MG)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida nome completo (para cliente)
   */
  static validateNomeCompleto(nome: string): ValidationResult {
    const errors: string[] = [];
    
    if (!nome || nome.trim().length === 0) {
      errors.push('Nome completo é obrigatório');
    } else if (nome.trim().length < 3) {
      errors.push('Nome completo deve ter pelo menos 3 caracteres');
    } else if (nome.trim().length > 255) {
      errors.push('Nome completo não pode exceder 255 caracteres');
    } else if (!/^[a-zA-ZÀ-ÿ\s''-]+$/.test(nome.trim())) {
      errors.push('Nome deve conter apenas letras, espaços e hífens');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida RG
   * Aceita números, letras, ponto, hífen e barra
   */
  static validateRG(rg: string): ValidationResult {
    const errors: string[] = [];
    
    if (!rg || rg.trim().length === 0) {
      return { isValid: true, errors: [] }; // RG é opcional
    }
    
    // Aceitar: números, letras (incluindo X), ponto, hífen, barra e espaços
    if (!/^[0-9A-Za-zXx\s.\-/]+$/.test(rg.trim())) {
      errors.push('RG deve conter apenas números, letras, ponto, hífen ou barra');
    }
    
    // Validar tamanho (permitir até 20 caracteres para incluir formatação)
    if (rg.trim().length > 20) {
      errors.push('RG não pode exceder 20 caracteres');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida campo de texto limitado (genérico)
   */
  static validateTextLength(text: string, fieldName: string, maxLength: number, required: boolean = false): ValidationResult {
    const errors: string[] = [];
    
    if (!text || text.trim().length === 0) {
      if (required) {
        errors.push(`${fieldName} é obrigatório`);
      }
      return { isValid: errors.length === 0, errors };
    }
    
    if (text.length > maxLength) {
      errors.push(`${fieldName} não pode exceder ${maxLength} caracteres`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}