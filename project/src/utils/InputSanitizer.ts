// Utilitarios de sanitización de inputs para prevenir ataques XSS
export class InputSanitizer {
  
  /**
   * Sanitiza strings básicos removiendo caracteres peligrosos
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      // Remover caracteres de control
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
      // Escapar caracteres HTML básicos
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      // Limitar longitud máxima
      .substring(0, 1000);
  }

  /**
   * Sanitiza email removendo caracteres no permitidos
   */
  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') return '';
    
    return email
      .trim()
      .toLowerCase()
      // Solo permitir caracteres válidos para email
      .replace(/[^a-z0-9@._-]/g, '')
      .substring(0, 254); // RFC 5321 limit
  }

  /**
   * Sanitiza números de teléfono
   */
  static sanitizePhone(phone: string): string {
    if (typeof phone !== 'string') return '';
    
    return phone
      .trim()
      // Solo permitir números, espacios, paréntesis y guiones
      .replace(/[^0-9\s()\-+]/g, '')
      .substring(0, 20);
  }

  /**
   * Sanitiza texto libre (mensajes, comentarios)
   */
  static sanitizeText(text: string): string {
    if (typeof text !== 'string') return '';
    
    return text
      .trim()
      // Remover caracteres de control excepto line breaks
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/g, '')
      // Escapar HTML básico pero preservar line breaks
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      // Limitar longitud
      .substring(0, 5000);
  }
}