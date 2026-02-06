-- Migration: Eliminar campo audiencias JSONB de processos_juridicos
-- Ahora las audiencias se gestionan en la tabla separada 'audiencias'
-- con relación de foreign key a processos_juridicos

-- Verificar si hay datos en el campo audiencias antes de eliminar
-- (Este es un comentario de seguridad, ejecutar solo si estás seguro)
-- SELECT id, titulo, audiencias FROM processos_juridicos WHERE audiencias != '[]'::jsonb;

-- 1. Eliminar el campo audiencias de processos_juridicos
ALTER TABLE processos_juridicos 
DROP COLUMN IF EXISTS audiencias;

-- 2. Agregar comentario explicativo (opcional)
COMMENT ON TABLE processos_juridicos IS 'Tabla de procesos jurídicos. Las audiencias ahora están en la tabla audiencias con FK a proceso_id';

-- Verificación post-migración
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'processos_juridicos' 
-- AND column_name = 'audiencias';
-- (Debería devolver 0 filas)
