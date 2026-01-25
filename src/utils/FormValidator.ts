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
}