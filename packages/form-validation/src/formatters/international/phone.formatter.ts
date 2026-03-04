/**
 * International Phone Formatter
 * 
 * Formatea números de teléfono en formato internacional universal.
 * NO realiza validaciones, solo formateo visual.
 * 
 * Formato objetivo: +[código país] [código área] [número]
 * 
 * Ejemplos:
 * - Brasil: +55 11 98765-4321
 * - USA: +1 212 555-1234
 * - España: +34 91 123-4567
 * - Argentina: +54 11 4567-8901
 * 
 * @module formatters/international/phone
 */

export interface InternationalPhoneFormatterConfig {
  /**
   * Incluir símbolo + al inicio
   * @default true
   */
  includeCountryCode?: boolean;

  /**
   * Separador entre grupos (espacio, guion, etc)
   * @default ' '
   */
  separator?: string;

  /**
   * Formato de salida personalizado
   * Si no se proporciona, usa formato automático
   */
  customFormat?: (digits: string) => string;
}

/**
 * Limpia un número de teléfono removiendo todos los caracteres no numéricos
 * excepto el símbolo + inicial si existe
 */
function cleanPhoneNumber(value: string): { hasPlus: boolean; digits: string } {
  if (!value) {
    return { hasPlus: false, digits: '' };
  }

  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith('+');
  
  // Remover todo excepto dígitos
  const digits = trimmed.replace(/\D/g, '');
  
  return { hasPlus, digits };
}

/**
 * Detecta el formato basado en la longitud y patrón del número
 * Aplica formateo visual sin validación
 */
function detectAndFormat(digits: string, includeCountryCode: boolean, separator: string): string {
  if (digits.length === 0) {
    return '';
  }

  // Para números muy cortos (< 7), retornar sin formateo
  if (digits.length < 7) {
    return includeCountryCode ? `+${digits}` : digits;
  }

  // Intentar detectar código de país común
  let countryCode = '';
  let areaCode = '';
  let number = '';

  // Patrones de códigos de país comunes (1-3 dígitos)
  if (digits.length >= 10) {
    // Código país de 2 dígitos (BR: 55, AR: 54, ES: 34, etc.)
    if (digits.startsWith('55') || digits.startsWith('54') || 
        digits.startsWith('34') || digits.startsWith('52') || 
        digits.startsWith('56') || digits.startsWith('57')) {
      countryCode = digits.substring(0, 2);
      const rest = digits.substring(2);
      
      // Área code típicamente 2 dígitos
      if (rest.length >= 4) {
        areaCode = rest.substring(0, 2);
        number = rest.substring(2);
      } else {
        number = rest;
      }
    }
    // Código país de 1 dígito (USA/Canada: 1)
    else if (digits.startsWith('1')) {
      countryCode = digits.substring(0, 1);
      const rest = digits.substring(1);
      
      // Área code típicamente 3 dígitos para USA
      if (rest.length >= 7) {
        areaCode = rest.substring(0, 3);
        number = rest.substring(3);
      } else {
        number = rest;
      }
    }
    // Código país de 3 dígitos (menos común)
    else if (digits.length >= 12) {
      countryCode = digits.substring(0, 3);
      const rest = digits.substring(3);
      
      if (rest.length >= 4) {
        areaCode = rest.substring(0, 2);
        number = rest.substring(2);
      } else {
        number = rest;
      }
    }
  }

  // Si no detectamos código de país, tratarlo como número local
  if (!countryCode) {
    // Números de 10-11 dígitos sin código país (probablemente Brasil sin 55)
    if (digits.length === 10 || digits.length === 11) {
      areaCode = digits.substring(0, 2);
      number = digits.substring(2);
    } else {
      number = digits;
    }
  }

  // Formatear el número principal con guiones
  let formattedNumber = number;
  if (number.length > 4) {
    // Para números largos, dividir en grupos: XXXX-XXXX o XXXXX-XXXX
    const firstPart = number.substring(0, number.length - 4);
    const lastPart = number.substring(number.length - 4);
    formattedNumber = `${firstPart}-${lastPart}`;
  }

  // Construir resultado final
  const parts: string[] = [];
  
  if (countryCode && includeCountryCode) {
    parts.push(`+${countryCode}`);
  }
  
  if (areaCode) {
    parts.push(areaCode);
  }
  
  parts.push(formattedNumber);

  return parts.join(separator);
}

/**
 * Formatea un número de teléfono en formato internacional
 * 
 * NO realiza validaciones, acepta cualquier entrada numérica
 * Solo aplica formateo visual para mejor legibilidad
 * 
 * @param value - Valor del input (puede contener cualquier carácter)
 * @param config - Configuración de formateo
 * @returns Número formateado visualmente
 * 
 * @example
 * ```typescript
 * formatInternationalPhone('5511987654321')
 * // Returns: '+55 11 98765-4321'
 * 
 * formatInternationalPhone('12125551234')
 * // Returns: '+1 212 555-1234'
 * 
 * formatInternationalPhone('+34911234567')
 * // Returns: '+34 91 123-4567'
 * 
 * formatInternationalPhone('(55) 33 9-6333/2211')
 * // Returns: '+55 33 9633-2211'
 * ```
 */
export function formatInternationalPhone(
  value: string,
  config: InternationalPhoneFormatterConfig = {}
): string {
  const {
    includeCountryCode = true,
    separator = ' ',
    customFormat,
  } = config;

  // Limpiar entrada
  const { hasPlus, digits } = cleanPhoneNumber(value);

  // Si el usuario proporcionó un formato custom, usarlo
  if (customFormat) {
    return customFormat(digits);
  }

  // Detectar y formatear automáticamente
  // Si el valor original tenía +, mantener el formato internacional
  const shouldIncludeCode = includeCountryCode || hasPlus;
  
  return detectAndFormat(digits, shouldIncludeCode, separator);
}

/**
 * Crea un formateador de teléfono internacional con configuración pregrabada
 * 
 * @param config - Configuración del formateador
 * @returns Formatter completo con config, format, getName, getDescription
 * 
 * @example
 * ```typescript
 * const formatter = createInternationalPhoneFormatter({ separator: '-' });
 * const formatted = formatter.format('5511987654321');
 * // Returns: '+55-11-98765-4321'
 * ```
 */
export function createInternationalPhoneFormatter(
  userConfig: InternationalPhoneFormatterConfig = {}
) {
  const formatterConfig = {
    name: 'international-phone',
    description: 'Format international phone numbers',
    format: (value: string): string => {
      if (typeof value !== 'string') {
        return String(value);
      }
      return formatInternationalPhone(value, userConfig);
    },
  };

  return {
    config: formatterConfig,
    format: formatterConfig.format,
    getName: () => formatterConfig.name,
    getDescription: () => formatterConfig.description,
  };
}

/**
 * Variante sin código de país (solo número local)
 * Útil para inputs donde el país está seleccionado por separado
 */
export function formatLocalPhone(value: string): string {
  return formatInternationalPhone(value, { includeCountryCode: false });
}

/**
 * Extrae solo los dígitos de un número de teléfono
 * Útil para guardar en base de datos
 * 
 * @param value - Número de teléfono formateado
 * @returns Solo dígitos
 * 
 * @example
 * ```typescript
 * extractPhoneDigits('+55 11 98765-4321')
 * // Returns: '5511987654321'
 * ```
 */
export function extractPhoneDigits(value: string): string {
  return cleanPhoneNumber(value).digits;
}
