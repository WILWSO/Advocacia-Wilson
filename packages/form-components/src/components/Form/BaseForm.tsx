/**
 * BaseForm Component
 * Generic form container with header and footer
 * Provides consistent layout and structure for forms
 */

import React, { forwardRef } from 'react';
import { DEFAULT_FORM_STYLES } from '../../config/styles.config';
import { cn } from '../../hooks/styling/useFieldStyles';

/**
 * BaseForm props
 */
export interface BaseFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Form title or header content */
  header?: React.ReactNode;
  /** Form footer content (typically buttons) */
  footer?: React.ReactNode;
  /** Form body content (fields) */
  children: React.ReactNode;
  /** Submit handler */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  /** Cancel handler */
  onCancel?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Hide default footer buttons (use custom footer instead) */
  hideDefaultFooter?: boolean;
  /** Container custom className */
  containerClassName?: string;
  /** Header custom className */
  headerClassName?: string;
  /** Body custom className */
  bodyClassName?: string;
  /** Footer custom className */
  footerClassName?: string;
}

/**
 * BaseForm component
 * 
 * @example
 * ```tsx
 * import { BaseForm, CPFInput, EmailInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     // Process form
 *   };
 * 
 *   return (
 *     <BaseForm
 *       header={<h2>Cadastro de Cliente</h2>}
 *       onSubmit={handleSubmit}
 *       submitText="Salvar"
 *       cancelText="Cancelar"
 *       onCancel={() => console.log('Cancelled')}
 *     >
 *       <CPFInput name="cpf" label="CPF" required />
 *       <EmailInput name="email" label="Email" required />
 *     </BaseForm>
 *   );
 * }
 * ```
 */
export const BaseForm = forwardRef<HTMLFormElement, BaseFormProps>(
  (
    {
      header,
      footer,
      children,
      onSubmit,
      onCancel,
      isLoading = false,
      submitText = 'Enviar',
      cancelText = 'Cancelar',
      hideDefaultFooter = false,
      containerClassName,
      headerClassName,
      bodyClassName,
      footerClassName,
      className,
      ...formProps
    },
    ref
  ) => {
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit && !isLoading) {
        await onSubmit(e);
      }
    };

    // Render default footer
    const renderDefaultFooter = () => {
      if (hideDefaultFooter || footer) return null;

      return (
        <>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className={DEFAULT_FORM_STYLES.cancelButton}
            >
              {cancelText}
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={DEFAULT_FORM_STYLES.submitButton}
          >
            {isLoading ? 'Enviando...' : submitText}
          </button>
        </>
      );
    };

    return (
      <div className={cn(DEFAULT_FORM_STYLES.container, containerClassName)}>
        {header && (
          <div className={cn(DEFAULT_FORM_STYLES.header, headerClassName)}>
            {header}
          </div>
        )}

        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={className}
          {...formProps}
        >
          <div className={cn(DEFAULT_FORM_STYLES.body, bodyClassName)}>
            {children}
          </div>

          {(footer || !hideDefaultFooter) && (
            <div className={cn(DEFAULT_FORM_STYLES.footer, footerClassName)}>
              {footer || renderDefaultFooter()}
            </div>
          )}
        </form>
      </div>
    );
  }
);

BaseForm.displayName = 'BaseForm';

export default BaseForm;
