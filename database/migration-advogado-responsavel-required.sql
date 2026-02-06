-- Migration: Hacer campo advogado_responsavel obligatorio
-- Este script actualiza la tabla processos_juridicos para que el campo
-- advogado_responsavel sea NOT NULL (obligatorio)

-- PASO 1: Verificar si hay procesos sin abogado responsable (IMPORTANTE)
-- Ejecutar esta query primero para identificar procesos problemáticos:
-- SELECT id, titulo, advogado_responsavel 
-- FROM processos_juridicos 
-- WHERE advogado_responsavel IS NULL;

-- PASO 2: Si hay procesos sin abogado, asignar un abogado por defecto
-- Opción A: Asignar al primer admin/abogado encontrado
-- UPDATE processos_juridicos 
-- SET advogado_responsavel = (
--   SELECT id FROM usuarios 
--   WHERE role IN ('admin', 'advogado') 
--   AND ativo = true 
--   LIMIT 1
-- )
-- WHERE advogado_responsavel IS NULL;

-- Opción B: Asignar al usuario que creó el proceso
-- UPDATE processos_juridicos 
-- SET advogado_responsavel = creado_por
-- WHERE advogado_responsavel IS NULL 
-- AND creado_por IS NOT NULL;

-- PASO 3: Agregar restricción NOT NULL
-- ⚠️ SOLO ejecutar después de asegurar que todos los procesos tienen un abogado asignado
ALTER TABLE processos_juridicos 
ALTER COLUMN advogado_responsavel SET NOT NULL;

-- PASO 4: Agregar comentario explicativo
COMMENT ON COLUMN processos_juridicos.advogado_responsavel IS 
'UUID del abogado o administrador responsable del proceso. Campo obligatorio.';

-- PASO 5: Verificar que la restricción se aplicó correctamente
-- SELECT column_name, is_nullable, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'processos_juridicos'
-- AND column_name = 'advogado_responsavel';

-- ROLLBACK (si es necesario deshacer):
-- ALTER TABLE processos_juridicos 
-- ALTER COLUMN advogado_responsavel DROP NOT NULL;

-- Notas:
-- 1. Este cambio es retroactivo y afecta todos los procesos existentes
-- 2. Asegúrate de tener un backup antes de ejecutar
-- 3. Las políticas RLS deben permitir la actualización de procesos existentes
-- 4. El frontend debe validar este campo antes de enviar
