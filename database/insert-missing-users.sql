-- =====================================================
-- SCRIPT: Crear usuarios faltantes antes de migración
-- =====================================================
-- Fecha: 2026-02-06
-- Descripción: Crear usuarios Rosimeire y Rosilene que faltan en BD
-- NOTA: Este script solo crea registros en tabla usuarios, 
-- NO crea usuarios en Supabase Auth (requiere passwords)
-- =====================================================

BEGIN;

-- Insertar Rosimeire Albuquerque
INSERT INTO public.usuarios (
  id,
  email,
  nome,
  role,
  posicao,
  ativo,
  equipe,
  pais
) VALUES (
  gen_random_uuid(), -- Se generará un UUID automáticamente
  '33rosimeire@gmail.com',
  'Rosimeire Albuquerque',
  'advogado',
  'Associado',
  true,
  false, -- Se actualizará a true en la migración posterior
  'Brasil'
) ON CONFLICT (email) DO NOTHING; -- Evita duplicados si ya existe

-- Insertar Rosilene Santos  
INSERT INTO public.usuarios (
  id,
  email,
  nome,
  role,
  posicao,
  ativo,
  equipe,
  pais
) VALUES (
  gen_random_uuid(), -- Se generará un UUID automáticamente
  'rosilene.oliveira@gmail.com',
  'Rosilene Santos',
  'assistente',
  'Parceiro',
  true,
  false, -- Se actualizará a true en la migración posterior
  'Brasil'
) ON CONFLICT (email) DO NOTHING; -- Evita duplicados si ya existe

-- Verificar que se insertaron correctamente
SELECT 
    nome,
    email,
    role,
    posicao,
    ativo,
    equipe
FROM public.usuarios 
WHERE email IN ('33rosimeire@gmail.com', 'rosilene.oliveira@gmail.com')
ORDER BY nome;

COMMIT;

-- =====================================================
-- IMPORTANTE: 
-- Este script solo crea registros en la tabla usuarios.
-- Para login completo, estos usuarios necesitan:
-- 1. Ser creados en Supabase Auth con password
-- 2. O usar la UI del sistema para crear usuarios completos
-- =====================================================