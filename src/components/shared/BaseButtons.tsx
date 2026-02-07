/**
 * Sistema de botões base (SSoT para componentes de botão)
 * 
 * Elimina duplicação de estilos e comportamentos entre botões.
 * Padroniza variantes, tamanhos, estados e acessibilidade.
 * 
 * NUEVO: Sistema con categorías integradas en BaseButton
 * Brevedad de categorías + arquitectura SSoT sin componentes extra
 * 
 * @example
 * // Método 1: BaseButton con category (recomendado - más breve)
 * import { BaseButton } from './BaseButtons'
 * <BaseButton category="save">Salvar Cliente</BaseButton>
 * 
 * // Método 2: BaseButton manual (más control)
 * import { BaseButton } from './BaseButtons'
 * <BaseButton variant="primary" size="lg" loading={isLoading}>
 *   Salvar Cliente
 * </BaseButton>
 * 
 * // Método 3: BaseButton con category override
 * <BaseButton category="save" variant="success" icon={<CustomIcon />}>
 *   Salvar
 * </BaseButton>
 */

import React, { forwardRef, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { 
  BaseButtonProps, 
  IconButtonProps, 
  ActionButtonProps, 
  LinkButtonProps 
} from '../../types/baseProps'
import { useAsyncOperation } from '../../hooks/shared/useAsyncOperation'
import { useFormNotifications } from '../../hooks/shared/useFormNotifications'
import { 
  getCategoryConfig, 
  ButtonCategory
} from './baseButtonCategories'

// ==================== BASE BUTTON ==================== //

export interface BaseButtonWithCategoryProps extends Omit<BaseButtonProps, 'variant' | 'icon'> {
  category?: ButtonCategory
  variant?: BaseButtonProps['variant']
  icon?: BaseButtonProps['icon']
}

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonWithCategoryProps>((
  {
    children,
    category,
    variant: propVariant,
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon: propIcon,
    iconPosition = 'left',
    className = '',
    onClick,
    ...props
  },
  ref
) => {
  // Si se proporciona category, usar su configuración
  const categoryConfig = category ? getCategoryConfig(category) : null
  const variant = propVariant || categoryConfig?.variant || 'primary'
  const icon = propIcon || categoryConfig?.icon
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  )

  const variantClasses = {
    primary: cn(
      'bg-primary-600 text-white shadow-sm',
      'hover:bg-primary-700 hover:shadow-md',
      'focus:ring-primary-500',
      'active:bg-primary-800'
    ),
    secondary: cn(
      'bg-gray-600 text-white shadow-sm',
      'hover:bg-gray-700 hover:shadow-md',
      'focus:ring-gray-500',
      'active:bg-gray-800'
    ),
    success: cn(
      'bg-green-600 text-white shadow-sm',
      'hover:bg-green-700 hover:shadow-md',
      'focus:ring-green-500',
      'active:bg-green-800'
    ),
    danger: cn(
      'bg-red-600 text-white shadow-sm',
      'hover:bg-red-700 hover:shadow-md',
      'focus:ring-red-500',
      'active:bg-red-800'
    ),
    warning: cn(
      'bg-yellow-600 text-white shadow-sm',
      'hover:bg-yellow-700 hover:shadow-md',
      'focus:ring-yellow-500',
      'active:bg-yellow-800'
    ),
    outline: cn(
      'border-2 border-gray-300 bg-white text-gray-700',
      'hover:bg-gray-50 hover:border-gray-400',
      'focus:ring-gray-500',
      'active:bg-gray-100'
    ),
    ghost: cn(
      'text-gray-700 bg-transparent',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
      'active:bg-gray-200'
    ),
    link: cn(
      'text-primary-600 bg-transparent underline-offset-4',
      'hover:underline',
      'focus:ring-primary-500'
    )
  }

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  }

  const widthClasses = fullWidth ? 'w-full' : 'w-auto'

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return
    onClick?.(e)
  }

  const renderIcon = () => {
    if (loading) {
      return (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )
    }
    return icon
  }

  return (
    <button
      ref={ref}
      type="button"
      disabled={loading || disabled}
      onClick={handleClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClasses,
        className
      )}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children && <span>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </button>
  )
})

BaseButton.displayName = 'BaseButton'

// ==================== ICON BUTTON ==================== //

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  rounded = true,
  tooltip,
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4'
  }

  const iconSizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg'

  const iconElements: { [key: string]: ReactNode } = {
    edit: (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    delete: (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    view: (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    add: (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    close: (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    search: (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    filter: (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
      </svg>
    ),
    download: (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  const iconElement = typeof icon === 'string' ? iconElements[icon] || icon : icon

  return (
    <BaseButton
      ref={ref}
      variant={variant}
      icon={iconElement}
      className={cn(sizeClasses[size], roundedClasses, className)}
      title={tooltip || label}
      aria-label={label}
      {...props}
    />
  )
})

IconButton.displayName = 'IconButton'

// ==================== ACTION BUTTON ==================== //

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(({
  action,
  onConfirm,
  confirmMessage,
  size = 'sm',
  showText = false,
  className = '',
  skipConfirmation = false, // Nueva prop para desactivar fallback de seguridad
  ...props
}, ref) => {
  const { execute } = useAsyncOperation()
  const { showToast } = useFormNotifications()

  const actionConfig = {
    edit: {
      icon: 'edit',
      variant: 'outline' as const,
      text: 'Editar',
      confirmMessage: 'Deseja editar este item?'
    },
    delete: {
      icon: 'delete',
      variant: 'danger' as const,
      text: 'Excluir',
      confirmMessage: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'
    },
    view: {
      icon: 'view',
      variant: 'ghost' as const,
      text: 'Visualizar',
      confirmMessage: null
    },
    add: {
      icon: 'add',
      variant: 'success' as const,
      text: 'Adicionar',
      confirmMessage: null
    },
    download: {
      icon: 'download',
      variant: 'outline' as const,
      text: 'Download',
      confirmMessage: null
    }
  }

  const config = actionConfig[action]
  
  // Medida de seguridad: confirmar solo para 'delete' con confirmMessage
  // si ConfirmModal no está manejando la confirmación (skipConfirmation = false)
  const needsConfirm = !skipConfirmation && config.confirmMessage && action === 'delete'

  const handleClick = async () => {
    if (needsConfirm) {
      const confirmed = window.confirm(confirmMessage || config.confirmMessage)
      if (!confirmed) return
    }

    try {
      const result = onConfirm()
      if (result instanceof Promise) {
        await execute(() => result)
      } else {
        await execute(() => Promise.resolve())
      }
      showToast('success', `${config.text} realizado com sucesso!`)
    } catch (error) {
      console.error('Erro na ação:', error)
      showToast('error', `Erro ao ${config.text.toLowerCase()}`)
    }
  }

  if (showText) {
    return (
      <BaseButton
        ref={ref}
        variant={config.variant}
        size={size}
        icon={config.icon}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {config.text}
      </BaseButton>
    )
  }

  return (
    <IconButton
      ref={ref}
      icon={config.icon}
      variant={config.variant}
      size={size}
      label={config.text}
      onClick={handleClick}
      className={className}
      {...props}
    />
  )
})

ActionButton.displayName = 'ActionButton'

// ==================== LINK BUTTON ==================== //

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(({
  children,
  href,
  external = false,
  variant = 'link',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'no-underline'
  )

  const variantClasses = {
    primary: cn(
      'bg-primary-600 text-white shadow-sm',
      'hover:bg-primary-700 hover:shadow-md',
      'focus:ring-primary-500'
    ),
    secondary: cn(
      'bg-gray-600 text-white shadow-sm',
      'hover:bg-gray-700 hover:shadow-md',
      'focus:ring-gray-500'
    ),
    outline: cn(
      'border-2 border-gray-300 bg-white text-gray-700',
      'hover:bg-gray-50 hover:border-gray-400',
      'focus:ring-gray-500'
    ),
    ghost: cn(
      'text-gray-700 bg-transparent',
      'hover:bg-gray-100',
      'focus:ring-gray-500'
    ),
    link: cn(
      'text-primary-600 bg-transparent underline-offset-4',
      'hover:underline',
      'focus:ring-primary-500'
    )
  }

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  const externalProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {}

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </a>
  )
})

LinkButton.displayName = 'LinkButton'

// ==================== BUTTON GROUP ==================== //

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'attached' | 'separated'
  fullWidth?: boolean
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  size = 'md',
  variant = 'attached',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex'
  
  const orientationClasses = {
    horizontal: variant === 'attached' ? '' : 'space-x-2',
    vertical: variant === 'attached' ? 'flex-col' : 'flex-col space-y-2'
  }
  
  const widthClasses = fullWidth ? 'w-full' : 'w-auto'

  // Adiciona classes aos botões filhos para attached variant
  const processedChildren = variant === 'attached' ? 
    React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child
      
      const totalChildren = React.Children.count(children)
      let buttonClasses = ''
      
      if (orientation === 'horizontal') {
        if (index === 0) buttonClasses = 'rounded-r-none'
        else if (index === totalChildren - 1) buttonClasses = 'rounded-l-none -ml-px'
        else buttonClasses = 'rounded-none -ml-px'
      } else {
        if (index === 0) buttonClasses = 'rounded-b-none'
        else if (index === totalChildren - 1) buttonClasses = 'rounded-t-none -mt-px'
        else buttonClasses = 'rounded-none -mt-px'
      }
      
      return React.cloneElement(child, {
        className: cn(child.props.className, buttonClasses),
        size
      })
    }) : 
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child
      return React.cloneElement(child, { size })
    })

  return (
    <div
      className={cn(
        baseClasses,
        orientationClasses[orientation],
        widthClasses,
        className
      )}
      role="group"
      {...props}
    >
      {processedChildren}
    </div>
  )
}

BaseButton.displayName = 'BaseButton'
IconButton.displayName = 'IconButton'
ActionButton.displayName = 'ActionButton'
LinkButton.displayName = 'LinkButton'
ButtonGroup.displayName = 'ButtonGroup'

export default {
  BaseButton,
  IconButton,
  ActionButton,
  LinkButton,
  ButtonGroup
}