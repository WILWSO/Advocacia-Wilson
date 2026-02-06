-- =====================================================
-- MIGRACIÓN: Agregar campo obligatorio 'posicao' a tabla usuarios
-- =====================================================
-- Fecha: 2026-02-06
-- Descripción: Crear campo posicao con opciones "Socio", "Associado", "Parceiro"
-- =====================================================

BEGIN;

-- 1. Agregar campo posicao como VARCHAR con constraint CHECK
ALTER TABLE public.usuarios 
ADD COLUMN posicao VARCHAR(20) CHECK (posicao IN ('Socio', 'Associado', 'Parceiro'));

-- 2. Establecer valor por defecto temporal para registros existentes
UPDATE public.usuarios 
SET posicao = 'Associado' 
WHERE posicao IS NULL;

-- 3. Hacer el campo NOT NULL (obligatorio)
ALTER TABLE public.usuarios 
ALTER COLUMN posicao SET NOT NULL;

-- 4. Agregar comentario al campo
COMMENT ON COLUMN public.usuarios.posicao IS 'Posição do usuário na empresa: Socio, Associado ou Parceiro';

-- Verificar que la migración fue exitosa
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'usuarios' 
  AND column_name = 'posicao';

COMMIT;