-- =====================================================
-- MIGRACIÓN: Popular campos de equipe con datos existentes
-- =====================================================
-- Fecha: 2026-02-06
-- Descripción: Popular campos equipe, educacao, especialidades, bio desde teamMemberData
-- =====================================================

BEGIN;

-- Actualizar Wilson Santos
UPDATE public.usuarios 
SET 
  equipe = true,
  educacao = ARRAY[
    'Bacharel em Direito - Universidade Federal do Tocantins (UFT)',
    'Especialização em Direito Empresarial',
    'Mestrado em Direito Tributário'
  ],
  especialidades = ARRAY[
    'Direito Empresarial', 
    'Direito Tributário', 
    'Direito Civil', 
    'Direito de Família',
    'Direito do Trabalho', 
    'Direito Contratual'
  ],
  bio = 'Com vasta experiência em questões empresariais e tributárias, Dr. Wilson Santos é reconhecido por sua dedicação e excelência no atendimento aos clientes. Sua abordagem combina conhecimento técnico com uma visão estratégica dos negócios.',
  redes_sociais = jsonb_build_object(
    'linkedin', 'https://linkedin.com',
    'instagram', 'https://instagram.com'
  ),
  whatsapp = '(63) 98417-3391'
WHERE email = 'wil.oliv.advogados@gmail.com';

-- Actualizar Lucas Nascimento  
UPDATE public.usuarios 
SET 
  equipe = true,
  educacao = ARRAY[
    'Bacharel em Direito - Universidade Federal do Tocantins (UFT)',
    'Especialização em Direito Civil',
    'Mestrando em Direito Imobiliário'
  ],
  especialidades = ARRAY[
    'Direito Civil', 
    'Direito Imobiliário',
    'Direito Tributário', 
    'Direito Empresarial'
  ],
  bio = 'Dr. Lucas Nascimento construiu uma sólida carreira focada em Direito Civil e Imobiliário. Com profundo conhecimento teórico e prático, desenvolveu metodologias inovadoras para a resolução de conflitos. Sua atuação é marcada pelo compromisso com a excelência e atendimento humanizado.',
  redes_sociais = jsonb_build_object(
    'linkedin', 'https://www.linkedin.com/in/lucsnas?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    'instagram', 'https://www.instagram.com/p/CwKqqyEO8sG/'
  ),
  whatsapp = '(63) 99207-4376'
WHERE email = 'lucsnasmelo@gmail.com';

-- Actualizar Rosimeire Albuquerque
UPDATE public.usuarios 
SET 
  equipe = true,
  educacao = ARRAY[
    'Bacharel em Direito - Universidade Federal do Tocantins (UFT)',
    'Especialização em Direito do trabalho'
  ],
  especialidades = ARRAY[
    'Direito Trabalhista', 
    'Direito eleitoral'
  ],
  bio = 'Dra. Rosimeire Albuquerque possui vasta experiencia em Direito eleitoral, especialmente no ramo de assessoria política. Com a excelência e atendimento humanizado, seus problemas serão resolvidos com clareza e transparencia.',
  redes_sociais = jsonb_build_object(
    'linkedin', 'https://linkedin.com',
    'instagram', 'https://www.instagram.com/33rosimeire/?igsh=NHJseGdzeWd2d2F1&utm_source=qr#'
  ),
  whatsapp = '(63) 9269-7835'
WHERE email = '33rosimeire@gmail.com';

-- Actualizar Rosilene Santos (Assessoria Contábil)
UPDATE public.usuarios 
SET 
  equipe = true,
  educacao = ARRAY[
    'Bacharel em Ciencias Contábeis - Universidade Norte do Paraná (UNOPAR)',
    'Bacharel em Administração - Instituto de Ensino e Pesquisa Objetivo (IEP)',
    'Especialização em Controladoria e Finanças'
  ],
  especialidades = ARRAY[
    'Controladoria e Finanças'
  ],
  bio = 'A contadora Rosilene Santos possui ampla experiência em contabilidade comercial e eleitoral. Com mais de 15 anos de experiência na área de consultoria de negócios e contabilidade fiscal e financeira, atende cada demanda de maneira singular, afim de oferecer suporte adequado que supra a necessidade do cliente.',
  redes_sociais = jsonb_build_object(
    'linkedin', 'https://www.linkedin.com/in/rosilene-santos-4b78a4206/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3B1WovH%2BwyQqWjZjl26Cwghg%3D%3D',
    'instagram', 'https://www.instagram.com/alfacontabilidadepalmas/?__pwa=1#'
  ),
  whatsapp = '(63) 98425-8508'
WHERE email = 'rosilene.oliveira@gmail.com';

-- Verificar que las actualizaciones fueron exitosas
SELECT 
    nome,
    email,
    posicao,
    equipe,
    array_length(educacao, 1) as num_educacao,
    array_length(especialidades, 1) as num_especialidades,
    length(bio) as bio_chars,
    redes_sociais,
    whatsapp
FROM public.usuarios 
WHERE email IN (
    'wil.oliv.advogados@gmail.com',
    'lucsnasmelo@gmail.com', 
    '33rosimeire@gmail.com',
    'rosilene.oliveira@gmail.com'
)
ORDER BY nome;

COMMIT;