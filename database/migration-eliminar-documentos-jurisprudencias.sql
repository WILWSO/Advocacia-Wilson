-- =====================================================
-- MIGRACIÓN: ELIMINAR TABLAS OBSOLETAS NO UTILIZADAS
-- Fecha: 16/02/2026
-- Autor: Sistema de Auditoría
-- Tablas: documentos, jurisprudencias
-- =====================================================
-- 
-- CONTEXTO:
-- Las tablas 'documentos' y 'jurisprudencias' fueron creadas en el schema
-- inicial pero NUNCA se utilizaron en el frontend.
-- 
-- VERIFICACIÓN REALIZADA:
-- ✅ Búsqueda exhaustiva en src/**/*.ts y src/**/*.tsx
-- ✅ NO se encontraron queries .from('documentos')
-- ✅ NO se encontraron queries .from('jurisprudencias')
-- 
-- IMPLEMENTACIÓN REAL:
-- - Documentos: Se usan campos JSONB (documentos_cliente, documentos_processo)
-- - Jurisprudencias: Se usa campo JSONB (processos_juridicos.jurisprudencia)
-- 
-- IMPACTO:
-- ⚠️  NO hay impacto en frontend (tablas nunca consultadas)
-- ✅ Simplifica el esquema de base de datos
-- ✅ Reduce overhead de RLS policies y triggers
-- ✅ Elimina posibles confusiones futuras
-- 
-- REVERSIÓN:
-- Si necesitas restaurar estas tablas, consulta:
-- - database/schema.sql (líneas 338-440 para documentos)
-- - database/schema.sql (líneas 520-590 para jurisprudencias)
-- - database/migration-2025-01-29-complete.sql (definiciones originales)
-- =====================================================

-- PASO 1: Verificar que las tablas existen antes de eliminar
DO $$ 
BEGIN
    -- Verificar tabla documentos
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'documentos'
    ) THEN
        RAISE NOTICE '✓ Tabla "documentos" encontrada - será eliminada';
    ELSE
        RAISE NOTICE '✗ Tabla "documentos" no existe - omitiendo';
    END IF;
    
    -- Verificar tabla jurisprudencias
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'jurisprudencias'
    ) THEN
        RAISE NOTICE '✓ Tabla "jurisprudencias" encontrada - será eliminada';
    ELSE
        RAISE NOTICE '✗ Tabla "jurisprudencias" no existe - omitiendo';
    END IF;
END $$;

-- =====================================================
-- PASO 2: ELIMINAR TABLA DOCUMENTOS
-- =====================================================
-- Tabla polimórfica que nunca fue utilizada
-- El sistema usa JSONB en su lugar:
-- - clientes.documentos_cliente
-- - processos_juridicos.documentos_processo
-- =====================================================

-- Eliminar RLS policies primero
DROP POLICY IF EXISTS "Usuarios autenticados podem ver documentos" ON documentos;
DROP POLICY IF EXISTS "Advogados e admins podem insertar documentos" ON documentos;
DROP POLICY IF EXISTS "Advogados e admins podem actualizar documentos" ON documentos;
DROP POLICY IF EXISTS "Apenas admins podem eliminar documentos" ON documentos;

-- Eliminar triggers
DROP TRIGGER IF EXISTS update_documentos_updated_at ON documentos;

-- Eliminar índices (se eliminan automáticamente con la tabla, pero por claridad)
DROP INDEX IF EXISTS idx_documentos_entity;
DROP INDEX IF EXISTS idx_documentos_entity_id;
DROP INDEX IF EXISTS idx_documentos_tipo;
DROP INDEX IF EXISTS idx_documentos_upload_por;
DROP INDEX IF EXISTS idx_documentos_data_upload;
DROP INDEX IF EXISTS idx_documentos_ativo;

-- Eliminar tabla con CASCADE (elimina dependencias)
DROP TABLE IF EXISTS documentos CASCADE;

-- =====================================================
-- PASO 3: ELIMINAR TABLA JURISPRUDENCIAS
-- =====================================================
-- Tabla de jurisprudencias que nunca fue utilizada
-- El sistema usa JSONB en su lugar:
-- - processos_juridicos.jurisprudencia (tipo: Jurisprudencia[])
-- =====================================================

-- Eliminar RLS policies
DROP POLICY IF EXISTS "Usuarios autenticados podem ver jurisprudencias" ON jurisprudencias;
DROP POLICY IF EXISTS "Advogados e admins podem criar jurisprudencias" ON jurisprudencias;
DROP POLICY IF EXISTS "Advogados e admins podem actualizar jurisprudencias" ON jurisprudencias;
DROP POLICY IF EXISTS "Apenas admins podem eliminar jurisprudencias" ON jurisprudencias;

-- Eliminar triggers
DROP TRIGGER IF EXISTS update_jurisprudencias_updated_at ON jurisprudencias;
DROP TRIGGER IF EXISTS jurisprudencias_audit_insert ON jurisprudencias;
DROP TRIGGER IF EXISTS jurisprudencias_audit_update ON jurisprudencias;

-- Eliminar índices
DROP INDEX IF EXISTS idx_jurisprudencias_ativo;
DROP INDEX IF EXISTS idx_jurisprudencias_documento;
DROP INDEX IF EXISTS idx_jurisprudencias_created_by;
DROP INDEX IF EXISTS idx_jurisprudencias_processos;
DROP INDEX IF EXISTS idx_jurisprudencias_busca_texto;

-- Eliminar tabla con CASCADE
DROP TABLE IF EXISTS jurisprudencias CASCADE;

-- =====================================================
-- PASO 4: VERIFICACIÓN POST-ELIMINACIÓN
-- =====================================================

DO $$ 
DECLARE
    tabla_count INTEGER;
BEGIN
    -- Contar tablas eliminadas
    SELECT COUNT(*) INTO tabla_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('documentos', 'jurisprudencias');
    
    IF tabla_count = 0 THEN
        RAISE NOTICE '============================================================================';
        RAISE NOTICE '✅ MIGRACIÓN COMPLETADA: Ambas tablas eliminadas exitosamente';
        RAISE NOTICE '============================================================================';
        RAISE NOTICE '   ELIMINADO:';
        RAISE NOTICE '   - documentos: ✓ eliminada (6 índices + 4 policies + 1 trigger)';
        RAISE NOTICE '   - jurisprudencias: ✓ eliminada (5 índices + 4 policies + 3 triggers)';
        RAISE NOTICE '============================================================================';
        RAISE NOTICE '   MANTENIDO:';
        RAISE NOTICE '   - view_comentarios_count (podría ser útil en futuro)';
        RAISE NOTICE '   - Campos JSONB (documentos_cliente, documentos_processo, jurisprudencia)';
        RAISE NOTICE '============================================================================';
    ELSE
        RAISE WARNING '⚠️  Algunas tablas no fueron eliminadas. Verificar manualmente.';
        RAISE WARNING '   Tablas restantes: %', tabla_count;
    END IF;
END $$;

-- =====================================================
-- NOTA IMPORTANTE: VIEW view_comentarios_count
-- =====================================================
-- La vista "view_comentarios_count" NO se elimina porque:
-- 1. Es liviana (solo una agregación)
-- 2. Podría ser útil para optimizar conteos en el futuro
-- 3. No genera overhead significativo
-- 4. No interfiere con la funcionalidad actual
-- 
-- Si deseas eliminarla también, ejecuta:
-- DROP VIEW IF EXISTS view_comentarios_count CASCADE;
-- =====================================================

-- =====================================================
-- RESUMEN DE CAMBIOS
-- =====================================================
-- ELIMINADO:
-- ✅ Tabla documentos + 6 índices + 4 policies + 1 trigger
-- ✅ Tabla jurisprudencias + 5 índices + 4 policies + 3 triggers
-- 
-- MANTENIDO:
-- ✅ view_comentarios_count (podría ser útil en futuro)
-- ✅ Campos JSONB existentes (documentos_cliente, documentos_processo, jurisprudencia)
-- ✅ Interface TypeScript DocumentoArquivo (src/types/documento.ts)
-- ✅ Interface TypeScript Jurisprudencia (src/types/processo.ts)
-- 
-- IMPACTO EN FRONTEND:
-- ❌ NINGUNO - estas tablas nunca fueron consultadas
-- 
-- PRÓXIMOS PASOS RECOMENDADOS:
-- 1. Ejecutar este script en Supabase SQL Editor
-- 2. Verificar que no hay errores
-- 3. Actualizar documentación del schema si existe
-- 4. Considerar eliminar referencias en schema.sql para nuevas instalaciones
-- =====================================================

-- Fin del script
