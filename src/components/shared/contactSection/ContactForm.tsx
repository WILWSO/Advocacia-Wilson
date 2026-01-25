import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import { useSecureForm } from '../../../hooks/useSecureForm';
import { getButtonClasses, getInputClasses, getLabelClasses } from '../../../utils/formStyles';
import { useInlineNotification } from '../../../hooks/useInlineNotification';
import { InlineNotification } from '../notifications/InlineNotification';

// ═══════════════════════════════════════════════════════════════
// COMPONENTES INTERNOS (PRIVADOS)
// ═══════════════════════════════════════════════════════════════

/**
 * FieldError - Muestra errores de validación de campos
 * Uso interno: FormField
 */
interface FieldErrorProps {
  errors?: string[];
}

const FieldError = ({ errors }: FieldErrorProps) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="mt-1 flex items-center text-red-600 text-sm">
      <AlertCircle size={14} className="mr-1 flex-shrink-0" />
      <span>{errors[0]}</span>
    </div>
  );
};

/**
 * FormField - Campo de formulario genérico (Input/Select/Textarea)
 * Uso interno: ContactForm
 * Reemplaza: FormInput, FormSelect, FormTextarea (fusión)
 */
interface BaseFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  errors?: string[];
  placeholder?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'tel';
  autoComplete?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  options: { value: string; label: string }[];
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  rows?: number;
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

const FormField = (props: FormFieldProps) => {
  const {
    id,
    name,
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    errors,
    placeholder,
  } = props;

  const renderField = () => {
    if (props.type === 'select' && 'options' in props) {
      return (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={getInputClasses(!!errors, disabled)}
        >
          <option value="">{placeholder || 'Selecione'}</option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (props.type === 'textarea' && 'rows' in props) {
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={props.rows || 5}
          className={`${getInputClasses(!!errors, disabled)} resize-vertical`}
          placeholder={placeholder}
        />
      );
    }

    // Input (text, email, tel)
    return (
      <input
        type={props.type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={getInputClasses(!!errors, disabled)}
        autoComplete={'autoComplete' in props ? props.autoComplete : undefined}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div>
      <label htmlFor={id} className={getLabelClasses()}>
        {label} {required && '*'}
      </label>
      {renderField()}
      <FieldError errors={errors} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE EXPORTADO
// ═══════════════════════════════════════════════════════════════

const subjectOptions = [
  { value: 'Consulta', label: 'Consulta Jurídica' },
  { value: 'Contratação', label: 'Contratação de Serviços' },
  { value: 'Dúvida', label: 'Dúvidas Gerais' },
  { value: 'Outro', label: 'Outro Assunto' },
];

export const ContactForm = () => {
  const { notification, success, hide } = useInlineNotification();
  const { formData, errors, updateField, submitForm, resetForm, isSubmitting } = useSecureForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateField(e.target.name as keyof typeof formData, e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccess = await submitForm();
    
    if (isSuccess) {
      success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      resetForm();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-lg shadow-custom p-8">
        <h4 className="text-xl font-medium text-primary-900 mb-6">Envie-nos uma mensagem</h4>
        
        {/* Notificación inline dentro del formulario */}
        <AnimatePresence mode="wait">
          {notification.show && (
            <InlineNotification
              type={notification.type}
              message={notification.message}
              onClose={hide}
              className="mb-4"
            />
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} id="contact-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <FormField
              type="text"
              id="name"
              name="name"
              label="Nome completo"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              errors={errors.name}
              autoComplete="name"
            />
            
            <FormField
              type="email"
              id="email"
              name="email"
              label="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              errors={errors.email}
              autoComplete="email"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <FormField
              type="tel"
              id="phone"
              name="phone"
              label="Telefone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              errors={errors.phone}
              autoComplete="tel"
            />
            
            <FormField
              type="select"
              id="subject"
              name="subject"
              label="Assunto"
              value={formData.subject}
              onChange={handleChange}
              options={subjectOptions}
              required
              disabled={isSubmitting}
              errors={errors.subject}
            />
          </div>
          
          <div className="mb-6">
            <FormField
              type="textarea"
              id="message"
              name="message"
              label="Mensagem"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              disabled={isSubmitting}
              errors={errors.message}
              placeholder="Descreva brevemente sua necessidade jurídica..."
            />
          </div>

          {/* Error general */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center text-red-700">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{errors.submit[0]}</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={getButtonClasses(isSubmitting)}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Calendar size={16} className="mr-2" />
                Solicitar Atendimento
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};
