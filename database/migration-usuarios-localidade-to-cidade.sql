-- =====================================================
-- MIGRACIÓN: Renombrar campo 'localidade' a 'cidade'
-- Tabla: usuarios
-- Fecha: 2026-02-05
-- Descripción: Cambio de nombre del campo para mayor claridad
-- =====================================================

-- Verificar que el campo localidade existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'usuarios' 
    AND column_name = 'localidade'
  ) THEN
    -- Renombrar la columna
    ALTER TABLE usuarios 
    RENAME COLUMN localidade TO cidade;
    
    RAISE NOTICE 'Campo "localidade" renombrado a "cidade" exitosamente';
  ELSE
    RAISE NOTICE 'El campo "localidade" no existe o ya fue migrado';
  END IF;
END $$;

-- Verificar el resultado
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
  AND column_name IN ('cidade', 'localidade')
ORDER BY column_name;

-- Mostrar algunos registros para verificar que los datos se mantienen
SELECT 
  id,
  nome,
  cidade,
  estado,
  pais
FROM usuarios
LIMIT 5;
