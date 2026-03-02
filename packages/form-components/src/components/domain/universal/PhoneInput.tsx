/**
 * PhoneInput Component
 * 
 * Universal phone input with country code selector
 * Supports multiple countries with automatic validation and formatting
 */

import React, { forwardRef, useState, useCallback, useMemo } from 'react';
import { 
  createBrazilianPhoneValidator,
  createBrazilianPhoneFormatter
} from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

/**
 * Supported countries for phone input
 */
export type PhoneCountry = 'BR' | 'AR' | 'US' | 'ES' | 'PT';

/**
 * Country configuration
 */
interface CountryConfig {
  code: string;
  name: string;
  dialCode: string;
  placeholder: string;
}

/**
 * Country configurations
 */
const COUNTRY_CONFIGS: Record<PhoneCountry, CountryConfig> = {
  BR: {
    code: 'BR',
    name: 'Brasil',
    dialCode: '+55',
    placeholder: '(00) 00000-0000'
  },
  AR: {
    code: 'AR',
    name: 'Argentina',
    dialCode: '+54',
    placeholder: '(011) 0000-0000'
  },
  US: {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    placeholder: '(000) 000-0000'
  },
  ES: {
    code: 'ES',
    name: 'España',
    dialCode: '+34',
    placeholder: '000 00 00 00'
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    dialCode: '+351',
    placeholder: '000 000 000'
  }
};

/**
 * PhoneInput props
 */
export interface PhoneInputProps extends Omit<FieldGroupProps, 'formatter' | 'validator'> {
  /** Country change handler */
  onCountryChange?: (country: PhoneCountry) => void;
  /** Default country */
  defaultCountry?: PhoneCountry;
  /** Available countries */
  countries?: PhoneCountry[];
  /** Select class name */
  selectClassName?: string;
  /** Input wrapper class name for flex layout */
  inputWrapperClassName?: string;
}

/**
 * PhoneInput component
 * 
 * @example
 * ```tsx
 * import { PhoneInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   const [phone, setPhone] = useState('');
 *   const [country, setCountry] = useState<PhoneCountry>('BR');
 *   
 *   return (
 *     <PhoneInput
 *       label="Telefone"
 *       name="phone"
 *       defaultCountry={country}
 *       onCountryChange={setCountry}
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      onCountryChange,
      defaultCountry = 'BR',
      countries = ['BR', 'AR', 'US', 'ES', 'PT'],
      selectClassName = '',
      inputWrapperClassName = '',
      placeholder,
      ...fieldGroupProps
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(defaultCountry);

    // Get validator and formatter for current country
    const { validator, formatter } = useMemo(() => {
      // For now, only BR has full validator/formatter implementation
      if (selectedCountry === 'BR') {
        return {
          validator: createBrazilianPhoneValidator({ allowFormatted: true }),
          formatter: createBrazilianPhoneFormatter({ includeCountryCode: false })
        };
      }
      
      // For other countries, return undefined (no validation/formatting)
      // This can be extended in the future
      return {
        validator: undefined,
        formatter: undefined
      };
    }, [selectedCountry]);

    // Handle country change
    const handleCountryChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountry = e.target.value as PhoneCountry;
        setSelectedCountry(newCountry);
        onCountryChange?.(newCountry);
      },
      [onCountryChange]
    );

    // Get country config
    const countryConfig = COUNTRY_CONFIGS[selectedCountry];
    
    // Use country placeholder if no custom placeholder provided
    const actualPlaceholder = placeholder || countryConfig.placeholder;

    return (
      <div>
        {/* Country selector */}
        <div style={{ marginBottom: '0.5rem' }}>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className={selectClassName}
            aria-label="Selecione o país"
          >
            {countries.map((country) => {
              const config = COUNTRY_CONFIGS[country];
              return (
                <option key={country} value={country}>
                  {config.dialCode} {config.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Phone input field */}
        <FieldGroup
          ref={ref}
          {...fieldGroupProps}
          validator={validator as any}
          formatter={formatter as any}
          placeholder={actualPlaceholder}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
