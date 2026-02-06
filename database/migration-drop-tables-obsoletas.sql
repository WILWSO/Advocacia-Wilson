-- ============================================================================
-- MIGRATION SCRIPT - Eliminar tablas obsoletas
-- ============================================================================
-- Este script elimina las tablas que ya no se usan:
-- 1. comentarios_processos (eliminada del diseño)
-- 2. documentos_processos (reemplazada por tabla 'documentos' polimórfica)
-- ============================================================================

-- Eliminar tabla comentarios_processos
DROP TABLE IF EXISTS comentarios_processos CASCADE;

-- Eliminar tabla documentos_processos
DROP TABLE IF EXISTS documentos_processos CASCADE;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'ELIMINACIÓN DE TABLAS OBSOLETAS COMPLETADA';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '✅ Tabla comentarios_processos eliminada';
    RAISE NOTICE '✅ Tabla documentos_processos eliminada';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'NOTA: Estas tablas fueron reemplazadas por:';
    RAISE NOTICE '- documentos_processos → tabla "documentos" polimórfica';
    RAISE NOTICE '- comentarios_processos → eliminada del diseño';
    RAISE NOTICE '============================================================================';
END $$;
