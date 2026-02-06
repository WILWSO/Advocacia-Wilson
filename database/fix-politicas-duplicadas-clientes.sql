-- SOLUCIÓN: Eliminar políticas RLS duplicadas y problemáticas en clientes
-- Fecha: 2026-02-03
-- Problema: Hay 9 políticas cuando deberían ser solo 4 (SELECT, INSERT, UPDATE, DELETE)
-- La política "clientes_update_policy" tiene subconsulta errónea que causa error 500
-- 
-- IMPORTANTE: Según docs/instructions/RLS_tablas.md
-- - Admin, Advogado, Assistente: pueden SELECT, INSERT, UPDATE
-- - Solo Admin: puede DELETE
-- - Restricciones de nome_completo y status: SOLO EN FRONTEND (no en backend)

-- ============================================================================
-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- ============================================================================

DROP POLICY IF EXISTS "Admin advogado assistente podem atualizar clientes" ON clientes;
DROP POLICY IF EXISTS "Apenas admin pode deletar clientes" ON clientes;
DROP POLICY IF EXISTS "Usuarios autenticados podem atualizar clientes" ON clientes;
DROP POLICY IF EXISTS "Usuarios autenticados podem criar clientes" ON clientes;
DROP POLICY IF EXISTS "Usuarios autenticados podem ver clientes" ON clientes;
DROP POLICY IF EXISTS "clientes_delete_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_insert_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_select_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_update_policy" ON clientes;
DROP POLICY IF EXISTS "Admin advogado assistente podem criar clientes" ON clientes;

-- ============================================================================
-- PASO 2: RECREAR POLÍTICAS CORRECTAS Y ÚNICAS
-- ============================================================================

-- Política SELECT: Usuarios autenticados pueden ver todos los clientes
CREATE POLICY "clientes_select_policy" 
    ON clientes FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Política INSERT: Admin, advogado y assistente pueden crear clientes
CREATE POLICY "clientes_insert_policy" 
    ON clientes FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role IN ('admin', 'advogado', 'assistente')
        )
    );

-- Política UPDATE: Admin, advogado y assistente pueden actualizar
-- NOTA: Según RLS_tablas.md, restricciones de nome_completo y status se validan SOLO EN FRONTEND
CREATE POLICY "clientes_update_policy" 
    ON clientes FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role IN ('admin', 'advogado', 'assistente')
        )
    );

-- Política DELETE: Solo admin puede eliminar clientes
CREATE POLICY "clientes_delete_policy" 
    ON clientes FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND usuarios.role = 'admin'
        )
    );

-- ============================================================================
-- PASO 3: COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

COMMENT ON POLICY "clientes_select_policy" ON clientes IS 
'Usuarios autenticados pueden ver todos los clientes';

COMMENT ON POLICY "clientes_insert_policy" ON clientes IS 
'Admin, advogado y assistente pueden crear clientes';

COMMENT ON POLICY "clientes_update_policy" ON clientes IS 
'Admin, advogado y assistente pueden actualizar clientes. Restricciones de nome_completo y status se validan en FRONTEND según RLS_tablas.md.';

COMMENT ON POLICY "clientes_delete_policy" ON clientes IS 
'Solo admin puede eliminar clientes';

-- ============================================================================
-- PASO 4: VERIFICACIÓN FINAL
-- ============================================================================

-- Ver todas las políticas (debe mostrar exactamente 4)
SELECT 
    policyname,
    cmd AS operation,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as using_status,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
        ELSE 'No WITH CHECK clause'
    END as with_check_status
FROM pg_policies
WHERE tablename = 'clientes'
ORDER BY cmd, policyname;

-- Mensaje de éxito
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'clientes';
    
    IF policy_count = 4 THEN
        RAISE NOTICE 'SUCCESS: Políticas RLS corregidas. Total: % políticas (esperado: 4)', policy_count;
    ELSE
        RAISE WARNING 'ATENCION: Se encontraron % políticas, se esperaban 4', policy_count;
    END IF;
END $$;
