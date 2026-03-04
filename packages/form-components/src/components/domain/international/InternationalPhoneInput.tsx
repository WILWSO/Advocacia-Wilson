/**
 * InternationalPhoneInput Component
 * 
 * Universal phone input for international numbers
 * NO VALIDATIONS - accepts any phone format from any country
 * Only applies visual formatting for better readability
 * 
 * @module components/domain/international
 */

import React, { forwardRef, useState, useEffect } from 'react';
import { createInternationalPhoneFormatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

/**
 * Country configuration
 */
export interface CountryConfig {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  placeholder: string;
}

/**
 * Common countries with phone codes
 */
export const COUNTRIES: CountryConfig[] = [
  { code: 'BR', name: 'Brasil', dialCode: '55', flag: '🇧🇷', placeholder: '(11) 98765-4321' },
  { code: 'US', name: 'United States', dialCode: '1', flag: '🇺🇸', placeholder: '(212) 555-1234' },
  { code: 'AR', name: 'Argentina', dialCode: '54', flag: '🇦🇷', placeholder: '(11) 4567-8901' },
  { code: 'ES', name: 'España', dialCode: '34', flag: '🇪🇸', placeholder: '91 123 4567' },
  { code: 'PT', name: 'Portugal', dialCode: '351', flag: '🇵🇹', placeholder: '21 234 5678' },
  { code: 'MX', name: 'México', dialCode: '52', flag: '🇲🇽', placeholder: '55 1234 5678' },
  { code: 'CL', name: 'Chile', dialCode: '56', flag: '🇨🇱', placeholder: '2 2123 4567' },
  { code: 'CO', name: 'Colombia', dialCode: '57', flag: '🇨🇴', placeholder: '1 234 5678' },
  { code: 'PE', name: 'Perú', dialCode: '51', flag: '🇵🇪', placeholder: '1 234 5678' },
  { code: 'UY', name: 'Uruguay', dialCode: '598', flag: '🇺🇾', placeholder: '2 123 4567' },
  { code: 'PY', name: 'Paraguay', dialCode: '595', flag: '🇵🇾', placeholder: '21 123 456' },
  { code: 'BO', name: 'Bolivia', dialCode: '591', flag: '🇧🇴', placeholder: '2 234 5678' },
  { code: 'VE', name: 'Venezuela', dialCode: '58', flag: '🇻🇪', placeholder: '212 123 4567' },
  { code: 'EC', name: 'Ecuador', dialCode: '593', flag: '🇪🇨', placeholder: '2 234 5678' },
  { code: 'GB', name: 'United Kingdom', dialCode: '44', flag: '🇬🇧', placeholder: '20 7123 4567' },
  { code: 'FR', name: 'France', dialCode: '33', flag: '🇫🇷', placeholder: '1 42 34 56 78' },
  { code: 'DE', name: 'Germany', dialCode: '49', flag: '🇩🇪', placeholder: '30 12345678' },
  { code: 'IT', name: 'Italy', dialCode: '39', flag: '🇮🇹', placeholder: '06 1234 5678' },
  { code: 'CA', name: 'Canada', dialCode: '1', flag: '🇨🇦', placeholder: '(613) 555-1234' },
  { code: 'AU', name: 'Australia', dialCode: '61', flag: '🇦🇺', placeholder: '2 1234 5678' },
];

/**
 * InternationalPhoneInput props
 */
export interface InternationalPhoneInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter' | 'onChange'> {
  /**
   * Show country selector dropdown
   * @default true
   */
  showCountrySelector?: boolean;

  /**
   * Default country code
   * @default 'BR'
   */
  defaultCountry?: string;

  /**
   * Include country code prefix (+XX) in formatted output
   * @default true
   */
  includeCountryCode?: boolean;

  /**
   * Separator between number groups
   * @default ' ' (space)
   * 
   * @example
   * - ' ' → +55 11 98765-4321
   * - '-' → +55-11-98765-4321
   */
  separator?: string;

  /**
   * Custom format function
   * If provided, overrides automatic formatting
   */
  customFormat?: (digits: string) => string;

  /**
   * Change handler - receives raw value, formatted value, and clean value (only digits)
   */
  onChange?: (rawValue: string, formattedValue: string, cleanValue: string) => void;

  /**
   * Country change handler
   */
  onCountryChange?: (country: CountryConfig) => void;
}

/**
 * Find country by code with guaranteed return value
 */
function findCountry(code: string): CountryConfig {
  const found = COUNTRIES.find(c => c.code === code);
  if (found) return found;
  
  // Fallback to first country (Brasil)
  const fallback = COUNTRIES[0];
  if (!fallback) {
    throw new Error('COUNTRIES array must contain at least one country');
  }
  return fallback;
}

/**
 * InternationalPhoneInput component
 * 
 * Universal phone input sin validaciones estrictas.
 * Acepta números de cualquier país y longitud.
 * Solo aplica formateo visual para mejorar la legibilidad.
 * 
 * Incluye selector de código de país (opcional).
 * El cleanValue (solo dígitos) está disponible automáticamente
 * via FieldGroup y es ideal para guardar en la base de datos.
 * 
 * @example
 * ```tsx
 * import { InternationalPhoneInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   const [phone, setPhone] = useState('');
 * 
 *   return (
 *     <InternationalPhoneInput
 *       name="phone"
 *       label="Teléfono"
 *       showCountrySelector
 *       defaultCountry="BR"
 *       initialValue={phone}
 *       onChange={(raw, formatted, clean) => {
 *         console.log('Raw:', raw);           // "+55 (11) 9-8765/4321"
 *         console.log('Formatted:', formatted); // "+55 11 98765-4321"
 *         console.log('Clean:', clean);        // "5511987654321"
 *         setPhone(clean); // Guardar solo dígitos en DB
 *       }}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Con selector de país
 * <InternationalPhoneInput
 *   name="phone"
 *   label="Celular"
 *   showCountrySelector
 *   defaultCountry="BR"
 *   placeholder="(11) 98765-4321"
 * />
 * 
 * @example
 * // Sin selector de país (modo simple)
 * <InternationalPhoneInput
 *   name="phone"
 *   label="Teléfono"
 *   showCountrySelector={false}
 *   placeholder="+55 11 98765-4321"
 * />
 */
export const InternationalPhoneInput = forwardRef<HTMLInputElement, InternationalPhoneInputProps>(
  ({ 
    showCountrySelector = true,
    defaultCountry = 'BR',
    includeCountryCode = true, 
    separator = ' ', 
    customFormat,
    onChange,
    onCountryChange,
    label,
    name,
    required,
    initialValue = '',
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    errorClassName = '',
    helpText,
    helpTextClassName = '',
    ...fieldGroupProps
  }, ref) => {
    // Find default country - guaranteed to have at least one country
    const defaultCountryConfig = findCountry(defaultCountry);
    
    // State
    const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(defaultCountryConfig);
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    // Initialize phone number from initialValue
    useEffect(() => {
      if (initialValue) {
        // Extract country code and number from initialValue
        const digits = initialValue.replace(/\D/g, '');
        
        // Try to match country code
        let matchedCountry: CountryConfig = defaultCountryConfig;
        for (const country of COUNTRIES) {
          if (digits.startsWith(country.dialCode)) {
            matchedCountry = country;
            break;
          }
        }
        
        setSelectedCountry(matchedCountry);
        
        // Remove country code from number
        const numberWithoutCode = digits.startsWith(matchedCountry.dialCode) 
          ? digits.slice(matchedCountry.dialCode.length)
          : digits;
        
        setPhoneNumber(numberWithoutCode);
      }
    }, [initialValue, defaultCountryConfig]);

    // Handle country change
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const countryCode = e.target.value;
      const country = findCountry(countryCode);
      setSelectedCountry(country);
      
      if (onCountryChange) {
        onCountryChange(country);
      }

      // Trigger onChange with updated country code
      const fullNumber = country.dialCode + phoneNumber.replace(/\D/g, '');
      if (onChange) {
        onChange(fullNumber, fullNumber, fullNumber);
      }
    };

    // Create formatter with config
    const formatter = React.useMemo(
      () => createInternationalPhoneFormatter({
        includeCountryCode,
        separator,
        customFormat,
      }),
      [includeCountryCode, separator, customFormat]
    );

    // No-op validator - siempre válido (no validations)
    const noValidator = React.useMemo(
      () => ({
        validate: () => ({ isValid: true }),
      }),
      []
    );

    // Handle phone number change
    const handlePhoneChange = (_raw: string, _formatted: string, clean: string) => {
      setPhoneNumber(clean);
      
      // Combine country code with phone number
      const fullNumber = selectedCountry.dialCode + clean;
      
      if (onChange) {
        onChange(fullNumber, `+${fullNumber}`, fullNumber);
      }
    };

    // Render without country selector (simple mode)
    if (!showCountrySelector) {
      return (
        <FieldGroup
          ref={ref}
          name={name}
          label={label}
          required={required}
          validator={noValidator as any}
          formatter={formatter as any}
          initialValue={initialValue}
          onChange={onChange}
          containerClassName={containerClassName}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
          errorClassName={errorClassName}
          helpText={helpText}
          helpTextClassName={helpTextClassName}
          {...fieldGroupProps}
        />
      );
    }

    // Render with country selector
    return (
      <div className={containerClassName || 'mb-4'}>
        {label && (
          <label className={labelClassName || 'block text-sm font-medium text-neutral-700 mb-2'}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="flex gap-2">
          {/* Country Selector */}
          <div className="flex-shrink-0" style={{ width: '140px' }}>
            <select
              value={selectedCountry.code}
              onChange={handleCountryChange}
              className={inputClassName || 'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white'}
              style={{ height: '42px' }}
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} +{country.dialCode}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number Input */}
          <div className="flex-1">
            <FieldGroup
              ref={ref}
              name={name}
              required={required}
              validator={noValidator as any}
              formatter={formatter as any}
              initialValue={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={selectedCountry.placeholder}
              inputClassName={inputClassName || 'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'}
              errorClassName={errorClassName || 'text-sm text-red-600 mt-1'}
              showErrorOnBlur
              {...fieldGroupProps}
            />
          </div>
        </div>

        {helpText && (
          <p className={helpTextClassName || 'text-sm text-neutral-500 mt-1'}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

InternationalPhoneInput.displayName = 'InternationalPhoneInput';

export default InternationalPhoneInput;
