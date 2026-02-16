-- =====================================================
-- MIGRATION: Hacer numero_processo NULLABLE
-- Fecha: 16/02/2026
-- Objetivo: Permitir que numero_processo sea NULL (opcional)
--           y que todos los roles puedan editarlo
-- =====================================================

-- =====================================================
-- PASO 1: Verificar estado actual del campo
-- =====================================================
SELECT 
    column_name AS "Campo",
    data_type AS "Tipo",
    is_nullable AS "¿Acepta NULL?",
    CASE 
        WHEN is_nullable = 'NO' THEN 'REQUERIDO (NOT NULL) ❌'
        ELSE 'OPCIONAL (nullable) ✓'
    END AS "Estado Actual"
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'processos_juridicos'
    AND column_name = 'numero_processo';

-- =====================================================
-- PASO 2: Verificar constraint UNIQUE
-- =====================================================
SELECT 
    conname AS "Constraint Name",
    contype AS "Type",
    CASE 
        WHEN contype = 'u' THEN 'UNIQUE ✓'
        ELSE 'OTHER'
    END AS "Constraint Description"
FROM 
    pg_constraint
WHERE 
    conrelid = 'public.processos_juridicos'::regclass
    AND conname LIKE '%numero_processo%';

-- =====================================================
-- PASO 3: EJECUTAR - Cambiar numero_processo a NULLABLE
-- =====================================================
-- ⚠️ Este comando quita la restricción NOT NULL
-- ✅ Mantiene el constraint UNIQUE (no se toca)

ALTER TABLE public.processos_juridicos 
ALTER COLUMN numero_processo DROP NOT NULL;

-- =====================================================
-- PASO 4: Verificar que el cambio fue exitoso
-- =====================================================
SELECT 
    column_name AS "Campo",
    data_type AS "Tipo",
    is_nullable AS "¿Acepta NULL?",
    CASE 
        WHEN is_nullable = 'YES' THEN '✓ CAMBIO EXITOSO - Ahora es nullable'
        ELSE '❌ CAMBIO FALLÓ - Sigue siendo NOT NULL'
    END AS "Estado Final"
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'processos_juridicos'
    AND column_name = 'numero_processo';

-- =====================================================
-- PASO 5: DROP y RECREAR RLS Policies para processos_juridicos
-- =====================================================

-- 5.1 DROP Políticas existentes de UPDATE
DROP POLICY IF EXISTS "processos_update_policy" ON public.processos_juridicos;

-- 5.2 RECREAR Política de UPDATE SIN restricciones de numero_processo
CREATE POLICY "processos_update_policy" 
ON public.processos_juridicos FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado', 'assistente')
  )
)
WITH CHECK (
  -- Admin pode fazer qualquer mudança (sin restricciones)
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR
  -- Advogado AHORA PUEDE EDITAR numero_processo
  -- Solo restricciones: titulo y advogado_responsavel
  (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role = 'advogado'
    )
    AND titulo = (SELECT titulo FROM public.processos_juridicos WHERE id = processos_juridicos.id)
    AND (
      advogado_responsavel IS NULL
      OR advogado_responsavel = (SELECT advogado_responsavel FROM public.processos_juridicos WHERE id = processos_juridicos.id)
    )
  )
  OR
  -- Assistente AHORA PUEDE EDITAR numero_processo
  -- Restricciones: titulo, advogado_responsavel y status
  (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role = 'assistente'
    )
    AND titulo = (SELECT titulo FROM public.processos_juridicos WHERE id = processos_juridicos.id)
    AND (
      advogado_responsavel IS NULL
      OR advogado_responsavel = (SELECT advogado_responsavel FROM public.processos_juridicos WHERE id = processos_juridicos.id)
    )
    AND status = (SELECT status FROM public.processos_juridicos WHERE id = processos_juridicos.id)
  )
);

-- =====================================================
-- PASO 6: Verificar políticas RLS activas
-- =====================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    tablename = 'processos_juridicos'
    AND policyname = 'processos_update_policy';

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- ✅ numero_processo ahora es NULLABLE (acepta NULL)
-- ✅ numero_processo mantiene constraint UNIQUE (sin duplicados)
-- ✅ TODOS los roles (admin, advogado, assistente) pueden editar numero_processo
-- ✅ Las demás restricciones se mantienen:
--    - Advogado: No puede cambiar titulo, advogado_responsavel
--    - Assistente: No puede cambiar titulo, advogado_responsavel, status
-- ✅ No hay dependencias de otras tablas en numero_processo (audiencias usa proceso_id)
-- =====================================================

-- =====================================================
-- ROLLBACK (en caso de necesitar revertir)
-- =====================================================
-- Para deshacer los cambios, ejecutar:
-- ALTER TABLE public.processos_juridicos ALTER COLUMN numero_processo SET NOT NULL;
-- Y luego ejecutar el script rls-policies.sql original
-- =====================================================
