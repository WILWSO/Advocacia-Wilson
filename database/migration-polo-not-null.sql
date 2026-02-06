-- Migration: Hacer campo polo NOT NULL en processos_juridicos
-- Fecha: 2026-02-04
-- Razón: El campo polo es obligatorio, debe tener valor 'ativo' o 'passivo'

-- Paso 1: Actualizar registros existentes con polo NULL (si los hay)
-- Establecer valor por defecto 'ativo' para registros sin polo
UPDATE processos_juridicos 
SET polo = 'ativo' 
WHERE polo IS NULL;

-- Paso 2: Hacer el campo NOT NULL
ALTER TABLE processos_juridicos 
ALTER COLUMN polo SET NOT NULL;

-- Verificar el constraint existente
-- polo VARCHAR(20) CHECK (polo IN ('ativo', 'passivo'))
-- Este constraint ya está correcto, solo faltaba el NOT NULL

-- Confirmar cambios
COMMENT ON COLUMN processos_juridicos.polo IS 'Polo do cliente no processo: ativo (autor/requerente) ou passivo (réu/requerido). Campo obrigatório.';
