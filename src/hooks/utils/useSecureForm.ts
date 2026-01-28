import { useState, useCallback } from 'react';
import { FormValidator, ContactFormData } from '../../utils/FormValidator';
import { InputSanitizer } from '../../utils/InputSanitizer';
import { formRateLimiter } from '../../utils/RateLimiter';

export interface UseSecureFormReturn {
  formData: ContactFormData;
  errors: Record<string, string[]>;
  isSubmitting: boolean;
  updateField: (field: keyof ContactFormData, value: string) => void;
  submitForm: () => Promise<boolean>;
  resetForm: () => void;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};

export const useSecureForm = (): UseSecureFormReturn => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Actualiza un campo del formulario con sanitización automática
   */
  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    let sanitizedValue = '';
    
    switch (field) {
      case 'name':
        sanitizedValue = InputSanitizer.sanitizeString(value);
        break;
      case 'email':
        sanitizedValue = InputSanitizer.sanitizeEmail(value);
        break;
      case 'phone':
        sanitizedValue = InputSanitizer.sanitizePhone(value);
        break;
      case 'subject':
        sanitizedValue = InputSanitizer.sanitizeString(value);
        break;
      case 'message':
        sanitizedValue = InputSanitizer.sanitizeText(value);
        break;
      default:
        sanitizedValue = InputSanitizer.sanitizeString(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Limpiar errores del campo cuando el usuario comience a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: []
      }));
    }
  }, [errors]);

  /**
   * Valida y envía el formulario
   */
  const submitForm = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Obtener identificador único del usuario (IP simulada + user agent)
      const userFingerprint = `${navigator.userAgent.slice(0, 50)}_${window.location.hostname}`;
      
      // Verificar rate limiting
      if (!formRateLimiter.canPerformAction(userFingerprint)) {
        const timeUntilReset = formRateLimiter.getTimeUntilReset(userFingerprint);
        const minutesLeft = Math.ceil(timeUntilReset / 60000);
        
        setErrors({
          submit: [`Muitas tentativas de envio. Tente novamente em ${minutesLeft} minuto(s).`]
        });
        return false;
      }
      
      // Validación completa del formulario
      const validation = FormValidator.validateContactForm(formData);
      
      if (!validation.isValid) {
        // Organizar errores por campo
        const fieldErrors: Record<string, string[]> = {};
        
        // Validar cada campo individualmente para mapear errores
        const nameValidation = FormValidator.validateName(formData.name);
        const emailValidation = FormValidator.validateEmail(formData.email);
        const phoneValidation = FormValidator.validatePhone(formData.phone);
        const subjectValidation = FormValidator.validateSubject(formData.subject);
        const messageValidation = FormValidator.validateMessage(formData.message);
        
        if (!nameValidation.isValid) fieldErrors.name = nameValidation.errors;
        if (!emailValidation.isValid) fieldErrors.email = emailValidation.errors;
        if (!phoneValidation.isValid) fieldErrors.phone = phoneValidation.errors;
        if (!subjectValidation.isValid) fieldErrors.subject = subjectValidation.errors;
        if (!messageValidation.isValid) fieldErrors.message = messageValidation.errors;
        
        setErrors(fieldErrors);
        return false;
      }

      // Registrar intento de envío
      formRateLimiter.recordAttempt(userFingerprint);

      // Limpiar errores si la validación pasó
      setErrors({});
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setErrors({
        submit: ['Erro interno do servidor. Tente novamente.']
      });
      return false;
      
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    resetForm
  };
};