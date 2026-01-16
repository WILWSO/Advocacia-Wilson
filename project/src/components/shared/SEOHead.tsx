import React from 'react';
import { Helmet } from 'react-helmet-async';
import { company } from './DataCompany';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'advogado, advocacia, direito, jurídico, Palmas, Tocantins, Santos Nascimento, direito civil, direito empresarial, direito trabalhista, direito tributário',
  canonicalUrl,
  ogType = 'website',
  ogImage = '/logoAzul.jpg',
  noindex = false,
  structuredData
}) => {
  const siteTitle = 'Santos & Nascimento Advogados Associados';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Advocacia Integral em Palmas-TO. Mais que fazer justiça, amar pessoas. Soluções jurídicas personalizadas com ética, dedicação e excelência. Direito Civil, Empresarial, Trabalhista e mais.';
  const metaDescription = description || defaultDescription;
  const currentUrl = canonicalUrl || window.location.href;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;

  // Schema.org markup para escritório de advocacia
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": company.nome,
    "alternateName": company.alias,
    "description": metaDescription,
    "url": window.location.origin,
    "logo": `${window.location.origin}/logoAzul.jpg`,
    "image": fullOgImage,
    "telephone": company.fone,
    "email": company.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Qd. 104 Sul, Rua SE 07, Lote 32, Sala 1",
      "addressLocality": "Palmas",
      "addressRegion": "TO",
      "postalCode": "77020-016",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-10.185281560037915",
      "longitude": "-48.333749413995385"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "$$",
    "areaServed": [
      {
        "@type": "City",
        "name": "Palmas"
      },
      {
        "@type": "State",
        "name": "Tocantins"
      }
    ],
    "serviceType": [
      "Direito Civil",
      "Direito Empresarial", 
      "Direito Trabalhista",
      "Direito Tributário",
      "Direito Imobiliário",
      "Direito de Família",
      "Direito do Consumidor"
    ],
    "founder": [
      {
        "@type": "Person",
        "name": "Wilson Santos de Oliveira"
      },
      {
        "@type": "Person", 
        "name": "Lucas Nascimento"
      }
    ],
    "sameAs": [
      company.linkedin,
      company.instagram,
      company.facebook
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Título */}
      <title>{fullTitle}</title>
      
      {/* Meta tags básicos */}
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={company.nome} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="language" content="pt-BR" />
      <meta name="geo.region" content="BR-TO" />
      <meta name="geo.placename" content="Palmas" />
      <meta name="geo.position" content="-10.185281560037915;-48.333749413995385" />
      <meta name="ICBM" content="-10.185281560037915, -48.333749413995385" />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="business:contact_data:street_address" content="Qd. 104 Sul, Rua SE 07, Lote 32, Sala 1" />
      <meta property="business:contact_data:locality" content="Palmas" />
      <meta property="business:contact_data:region" content="TO" />
      <meta property="business:contact_data:postal_code" content="77020-016" />
      <meta property="business:contact_data:country_name" content="Brasil" />
      <meta property="business:contact_data:email" content={company.email} />
      <meta property="business:contact_data:phone_number" content={company.fone} />
      <meta property="business:contact_data:website" content={window.location.origin} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@advocacia_integral" />
      <meta name="twitter:creator" content="@advocacia_integral" />

      {/* Links adicionais */}
      <link rel="alternate" type="application/rss+xml" title={`${siteTitle} - Novidades`} href="/feed.xml" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Meta tags para dispositivos móveis */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={company.alias} />
      
      {/* Preconnect para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://maps.googleapis.com" />
    </Helmet>
  );
};

export default SEOHead;