/**
 * Hook centralizado para gestión de SEO (Single Source of Truth)
 * 
 * Elimina duplicación de configuración SEO y centraliza meta tags, títulos y structured data.
 * Funciona tanto para páginas públicas (con SEOHead) como administrativas (solo títulos).
 * 
 * @example
 * // Página pública
 * const seo = useSEO({
 *   title: "Contato",
 *   description: "Entre em contato conosco",
 *   type: 'public'
 * });
 * 
 * return (
 *   <>
 *     {seo.component}
 *     <div>Conteúdo da página</div>
 *   </>
 * );
 * 
 * @example  
 * // Página administrativa
 * const seo = useSEO({
 *   title: "Gestão de Processos",
 *   type: 'admin'
 * });
 * 
 * return (
 *   <AdminPageLayout title={seo.title}>
 *     <div>Conteúdo administrativo</div>
 *   </AdminPageLayout>
 * );
 */

import React from 'react'
import SEOHead from '../../components/shared/SEOHead'

interface SEOConfig {
  title: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogType?: 'website' | 'article' | 'profile'
  ogImage?: string
  noindex?: boolean
  structuredData?: object
  type: 'public' | 'admin'
}

interface SEOReturn {
  title: string
  component: React.ReactElement | null
  meta: {
    description: string
    keywords: string
    fullTitle: string
  }
}

// Configuración centralizada de SEO por sección
const SEO_DEFAULTS = {
  public: {
    keywords: 'advogado, advocacia, direito, jurídico, Palmas, Tocantins, Santos Nascimento, direito civil, direito empresarial, direito trabalhista, direito tributário',
    ogImage: '/Images/logoAzul.jpg',
    noindex: false
  },
  admin: {
    keywords: 'sistema, gestão, administração, advocacia, processos, clientes, agenda',
    noindex: true // Páginas administrativas não devem ser indexadas
  }
}

// Configurações SEO pré-definidas para páginas comuns (eliminar duplicação)
const PREDEFINED_SEO = {
  // Páginas públicas
  home: {
    title: 'Início',
    description: 'Advocacia Integral em Palmas-TO. Mais que fazer justiça, amar pessoas. Soluções jurídicas personalizadas com ética, dedicação e excelência.',
    type: 'public' as const
  },
  about: {
    title: 'Sobre Nós - Nossa História e Princípios', 
    description: 'Conheça a história, missão e valores do escritório Santos & Nascimento Advogados Associados. Compromisso com ética e excelência.',
    type: 'public' as const
  },
  contact: {
    title: 'Contato - Agende sua Consulta Jurídica',
    description: 'Entre em contato com Santos & Nascimento Advogados. Atendimento personalizado em Palmas-TO. Agende sua consulta jurídica.',
    type: 'public' as const
  },
  services: {
    title: 'Áreas de Atuação - Serviços Jurídicos Especializados',
    description: 'Serviços jurídicos especializados: Direito Civil, Empresarial, Trabalhista, Tributário e mais. Soluções completas em Palmas-TO.',
    type: 'public' as const
  },
  team: {
    title: 'Nossa Equipe - Advogados Especializados',
    description: 'Conheça nossa equipe de advogados especializados. Profissionais experientes e comprometidos com resultados.',
    type: 'public' as const
  },
  
  // Páginas administrativas
  adminClientes: {
    title: 'Gestão de Clientes',
    description: 'Sistema de gestão de clientes - área administrativa',
    type: 'admin' as const
  },
  adminProcessos: {
    title: 'Gestão de Processos',
    description: 'Sistema de gestão de processos jurídicos - área administrativa',
    type: 'admin' as const
  },
  adminAgenda: {
    title: 'Agenda',
    description: 'Sistema de agenda e audiências - área administrativa', 
    type: 'admin' as const
  },
  adminUsuarios: {
    title: 'Gestão de Usuários',
    description: 'Sistema de gestão de usuários - área administrativa',
    type: 'admin' as const
  },
  adminSocial: {
    title: 'Rede Social Pública',
    description: 'Interface pública da rede social - área administrativa',
    type: 'admin' as const
  }
} as const

export function useSEO(config: SEOConfig | keyof typeof PREDEFINED_SEO): SEOReturn {
  // Se config é uma string, usar configuração pré-definida
  let seoConfig: SEOConfig
  
  if (typeof config === 'string') {
    const predefined = PREDEFINED_SEO[config]
    if (!predefined) {
      throw new Error(`Configuração SEO não encontrada: ${config}`)
    }
    seoConfig = predefined
  } else {
    seoConfig = config
  }
  
  // Destructuring com fallbacks para campos opcionais
  const { 
    title, 
    description, 
    type,
    keywords,
    canonicalUrl,
    ogType,
    ogImage,
    noindex,
    structuredData
  } = seoConfig
  
  // Aplicar defaults baseados no tipo
  const defaults = SEO_DEFAULTS[type]
  const finalKeywords = keywords || defaults.keywords
  const finalDescription = description || `${title} - Sistema Santos & Nascimento Advogados`
  const finalNoindex = noindex !== undefined ? noindex : defaults.noindex
  const finalOgImage = ogImage || (type === 'public' ? SEO_DEFAULTS.public.ogImage : '/Images/logoAzul.jpg')
  
  // Título completo (apenas para metadata, não para AdminPageLayout)
  const siteTitle = 'Santos & Nascimento Advogados Associados'
  const fullTitle = type === 'admin' ? `${title} | Admin` : (title ? `${title} | ${siteTitle}` : siteTitle)
  
  // Para páginas administrativas, não renderizar SEOHead (apenas retornar título)
  let component = null
  
  if (type === 'public') {
    component = React.createElement(SEOHead, {
      title,
      description: finalDescription,
      keywords: finalKeywords,
      canonicalUrl: canonicalUrl,
      ogType: ogType || 'website',
      ogImage: finalOgImage,
      noindex: finalNoindex,
      structuredData: structuredData
    })
  }
  
  return {
    title, // Título simples para uso em AdminPageLayout
    component, // Componente SEOHead (null para admin)
    meta: {
      description: finalDescription,
      keywords: finalKeywords,
      fullTitle
    }
  }
}

// Hook auxiliar para configurações rápidas (eliminar boilerplate)
export function usePublicSEO(title: string, description?: string, options?: Partial<SEOConfig>) {
  return useSEO({
    title,
    description,
    type: 'public',
    ...options
  })
}

export function useAdminSEO(title: string, options?: Partial<Omit<SEOConfig, 'type'>>) {
  return useSEO({
    title,
    type: 'admin',
    noindex: true,
    ...options
  })
}