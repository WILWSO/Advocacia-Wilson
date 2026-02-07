/**
 * Sistema de componentes base expandido (SSoT para componentes reutilizables)
 * 
 * Elimina duplicação de lógica e estilos entre componentes similares.
 * Padroniza comportamento e aparência de elementos UI comuns.
 * 
 * @example
 * import { BaseCard, BaseSection, BaseList } from './BaseComponents'
 * 
 * <BaseCard variant="elevated" padding="lg">
 *   <BaseSection title="Dados do Cliente">
 *     <BaseList items={data} />
 *   </BaseSection>
 * </BaseCard>
 */

import React, { memo } from 'react'
import { cn } from '../../lib/utils'
import { BaseContainerProps, BaseSpacingProps, LoadingProps, ErrorProps } from '../../types/baseProps'

// ==================== BASE CARD ==================== //

interface BaseCardProps extends BaseContainerProps, BaseSpacingProps {
  variant?: 'default' | 'elevated' | 'bordered' | 'flat'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
}

export const BaseCard: React.FC<BaseCardProps> = memo(({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  interactive = false,
  onClick,
  padding = 'md',
  ...props
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200'
  
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md border border-gray-100',
    bordered: 'bg-white border-2 border-gray-200',
    flat: 'bg-gray-50 border-0'
  }
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }
  
  const interactiveClasses = interactive ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        paddingClasses[padding],
        interactiveClasses,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
})

BaseCard.displayName = 'BaseCard'

// ==================== BASE SECTION ==================== //

interface BaseSectionProps extends BaseContainerProps, BaseSpacingProps {
  title?: string
  subtitle?: string
  headerActions?: React.ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
  titleLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const BaseSection: React.FC<BaseSectionProps> = memo(({
  children,
  title,
  subtitle,
  headerActions,
  collapsible = false,
  defaultExpanded = true,
  titleLevel = 'h3',
  className = '',
  padding = 'md',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  
  const paddingClasses = {
    none: '',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  }
  
  const TitleComponent = titleLevel
  
  return (
    <section className={cn('w-full', paddingClasses[padding], className)} {...props}>
      {(title || subtitle || headerActions) && (
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex-1">
            {title && (
              <TitleComponent 
                className={cn(
                  'font-semibold text-gray-900 flex items-center gap-2',
                  titleLevel === 'h1' && 'text-3xl',
                  titleLevel === 'h2' && 'text-2xl',
                  titleLevel === 'h3' && 'text-xl',
                  titleLevel === 'h4' && 'text-lg',
                  titleLevel === 'h5' && 'text-base',
                  titleLevel === 'h6' && 'text-sm'
                )}
              >
                {title}
                {collapsible && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label={isExpanded ? 'Recolher seção' : 'Expandir seção'}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                )}
              </TitleComponent>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2 ml-4">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      {(!collapsible || isExpanded) && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </section>
  )
})

BaseSection.displayName = 'BaseSection'

// ==================== BASE LIST ==================== //

interface BaseListItem {
  id: string | number
  label: string
  value?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  disabled?: boolean
  href?: string
}

interface BaseListProps extends BaseContainerProps, LoadingProps, ErrorProps {
  items: BaseListItem[]
  variant?: 'default' | 'bordered' | 'divided'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onItemClick?: (item: BaseListItem) => void
  emptyMessage?: string
  maxItems?: number
  showAll?: boolean
}

export const BaseList: React.FC<BaseListProps> = memo(({
  items,
  variant = 'default',
  size = 'md',
  interactive = false,
  onItemClick,
  emptyMessage = 'Nenhum item encontrado',
  maxItems,
  showAll = false,
  loading = false,
  error,
  className = '',
  ...props
}) => {
  const [showAllItems, setShowAllItems] = React.useState(showAll)
  
  const displayItems = maxItems && !showAllItems ? items.slice(0, maxItems) : items
  const hasMore = maxItems && items.length > maxItems && !showAllItems
  
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <p>Erro ao carregar itens: {typeof error === 'string' ? error : error.message}</p>
      </div>
    )
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    )
  }
  
  const baseClasses = 'w-full'
  const variantClasses = {
    default: 'space-y-1',
    bordered: 'border border-gray-200 rounded-lg divide-y divide-gray-200',
    divided: 'divide-y divide-gray-200'
  }
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return (
    <div className={cn(baseClasses, className)} {...props}>
      <ul className={cn(variantClasses[variant], sizeClasses[size])}>
        {displayItems.map((item) => {
          const ItemComponent = item.href ? 'a' : 'div'
          
          return (
            <li key={item.id}>
              <ItemComponent
                href={item.href}
                className={cn(
                  'flex items-center justify-between w-full',
                  variant === 'bordered' && 'px-4 py-3 first:rounded-t-lg last:rounded-b-lg',
                  variant === 'divided' && 'py-3',
                  variant === 'default' && 'py-2',
                  (interactive || onItemClick || item.href) && 'hover:bg-gray-50 cursor-pointer transition-colors',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !item.disabled && onItemClick?.(item)}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {item.icon && (
                    <div className="flex-shrink-0">{item.icon}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{item.label}</p>
                    {item.value && (
                      <p className="text-sm text-gray-500 truncate">{item.value}</p>
                    )}
                  </div>
                </div>
                {item.actions && (
                  <div className="flex-shrink-0 ml-2">
                    {item.actions}
                  </div>
                )}
              </ItemComponent>
            </li>
          )
        })}
      </ul>
      
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAllItems(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mostrar mais {items.length - maxItems!} itens
          </button>
        </div>
      )}
    </div>
  )
})

BaseList.displayName = 'BaseList'

// ==================== BASE GRID ==================== //

interface BaseGridProps extends BaseContainerProps, BaseSpacingProps {
  cols?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  rows?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  autoFit?: boolean
  minItemWidth?: string
}

export const BaseGrid: React.FC<BaseGridProps> = ({
  children,
  cols = 1,
  rows,
  autoFit = false,
  minItemWidth = '250px',
  gap = 'md',
  className = '',
  ...props
}) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
  
  let gridClasses = 'grid'
  
  if (autoFit) {
    gridClasses += ` grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`
  } else if (typeof cols === 'number') {
    gridClasses += ` grid-cols-${cols}`
  } else {
    // Responsive columns
    const { xs = 1, sm, md, lg, xl } = cols
    gridClasses += ` grid-cols-${xs}`
    if (sm) gridClasses += ` sm:grid-cols-${sm}`
    if (md) gridClasses += ` md:grid-cols-${md}`
    if (lg) gridClasses += ` lg:grid-cols-${lg}`
    if (xl) gridClasses += ` xl:grid-cols-${xl}`
  }
  
  if (rows) {
    if (typeof rows === 'number') {
      gridClasses += ` grid-rows-${rows}`
    } else {
      const { xs = 1, sm, md, lg, xl } = rows
      gridClasses += ` grid-rows-${xs}`
      if (sm) gridClasses += ` sm:grid-rows-${sm}`
      if (md) gridClasses += ` md:grid-rows-${md}`
      if (lg) gridClasses += ` lg:grid-rows-${lg}`
      if (xl) gridClasses += ` xl:grid-rows-${xl}`
    }
  }
  
  return (
    <div
      className={cn(gridClasses, gapClasses[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ==================== BASE DIVIDER ==================== //

interface BaseDividerProps extends BaseContainerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  color?: 'light' | 'medium' | 'dark'
  spacing?: 'sm' | 'md' | 'lg'
  label?: string
}

export const BaseDivider: React.FC<BaseDividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'light',
  spacing = 'md',
  label,
  className = '',
  ...props
}) => {
  const baseClasses = orientation === 'horizontal' ? 'w-full' : 'h-full'
  
  const colorClasses = {
    light: 'border-gray-200',
    medium: 'border-gray-300',
    dark: 'border-gray-400'
  }
  
  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  }
  
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6'
  }
  
  const borderClasses = orientation === 'horizontal' ? 'border-t' : 'border-l'
  
  if (label && orientation === 'horizontal') {
    return (
      <div className={cn('relative flex items-center', spacingClasses[spacing], className)} {...props}>
        <div className={cn('flex-1', borderClasses, colorClasses[color], variantClasses[variant])} />
        <span className="px-3 text-sm text-gray-500 bg-white">{label}</span>
        <div className={cn('flex-1', borderClasses, colorClasses[color], variantClasses[variant])} />
      </div>
    )
  }
  
  return (
    <div
      className={cn(
        baseClasses,
        borderClasses,
        colorClasses[color],
        variantClasses[variant],
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  )
}

export default {
  BaseCard,
  BaseSection,
  BaseList,
  BaseGrid,
  BaseDivider
}