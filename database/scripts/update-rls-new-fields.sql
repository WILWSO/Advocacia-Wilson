-- ============================================================================
-- Script: Actualizar RLS para nuevos campos
-- ============================================================================
-- Descripción: Actualiza las políticas RLS para incluir los nuevos campos
-- Fecha: 2026-01-19
-- ============================================================================

-- Eliminar políticas antiguas de UPDATE
DROP POLICY IF EXISTS "processos_update_policy" ON processos_juridicos;
DROP POLICY IF EXISTS "users_can_update_processos" ON processos_juridicos;

-- Crear nueva política de UPDATE con todos los campos
CREATE POLICY "processos_update_policy" ON processos_juridicos
FOR UPDATE
TO authenticated
USING (
  -- Admin puede ver y editar todo
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR
  -- Advogado y Assistente pueden ver sus propios procesos o los asignados a ellos
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role IN ('advogado', 'assistente')
    )
    AND (
      advogado_responsavel = auth.uid()
      OR creado_por = auth.uid()
    )
  )
)
WITH CHECK (
  -- Admin puede actualizar todo
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR
  -- Advogado: puede actualizar todo EXCEPTO nome_completo, numero_processo, titulo, advogado_responsavel
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role = 'advogado'
    )
    AND (
      -- Campos que NO pueden cambiar
      (numero_processo IS NOT DISTINCT FROM (SELECT p.numero_processo FROM processos_juridicos p WHERE p.id = processos_juridicos.id))
      AND (titulo IS NOT DISTINCT FROM (SELECT p.titulo FROM processos_juridicos p WHERE p.id = processos_juridicos.id))
      AND (advogado_responsavel IS NOT DISTINCT FROM (SELECT p.advogado_responsavel FROM processos_juridicos p WHERE p.id = processos_juridicos.id))
    )
    AND (
      advogado_responsavel = auth.uid()
      OR creado_por = auth.uid()
    )
  )
  OR
  -- Assistente: puede actualizar todo EXCEPTO nome_completo, numero_processo, titulo, advogado_responsavel, status
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role = 'assistente'
    )
    AND (
      -- Campos que NO pueden cambiar
      (numero_processo IS NOT DISTINCT FROM (SELECT p.numero_processo FROM processos_juridicos p WHERE p.id = processos_juridicos.id))
      AND (titulo IS NOT DISTINCT FROM (SELECT p.titulo FROM processos_juridicos p WHERE p.id = processos_juridicos.id))
      AND (advogado_responsavel IS NOT DISTINCT FROM (SELECT p.advogado_responsavel FROM processos_juridicos p WHERE p.id = processos_juridicos.id))
      AND (status IS NOT DISTINCT FROM (SELECT p.status FROM processos_juridicos p WHERE p.id = processos_juridicos.id))
    )
    AND (
      advogado_responsavel = auth.uid()
      OR creado_por = auth.uid()
    )
  )
);

-- Comentario sobre la política
COMMENT ON POLICY "processos_update_policy" ON processos_juridicos IS 
'Permite a admin actualizar todo. Advogado puede actualizar excepto numero_processo, titulo, advogado_responsavel. Assistente puede actualizar excepto numero_processo, titulo, advogado_responsavel, status. Los nuevos campos JSONB (jurisdicao, honorarios, audiencias, links_processo, jurisprudencia) y otros campos (polo, competencia, atividade_pendente) pueden ser actualizados por advogado y assistente.';

-- ============================================================================
-- Verificación
-- ============================================================================

-- Ver las políticas actuales
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'processos_juridicos'
ORDER BY policyname;

-- ============================================================================
-- Notas
-- ============================================================================

/*
CAMPOS QUE PUEDEN SER EDITADOS POR ADVOGADO Y ASSISTENTE:
✅ descricao
✅ status (solo advogado, assistente NO)
✅ cliente_id
✅ polo (NUEVO)
✅ cliente_email
✅ cliente_telefone
✅ area_direito
✅ prioridade
✅ valor_causa
✅ atividade_pendente (NUEVO)
✅ competencia (NUEVO)
✅ jurisdicao (NUEVO - JSONB)
✅ honorarios (NUEVO - JSONB)
✅ audiencias (NUEVO - JSONB)
✅ documentos_processo (JSONB)
✅ links_processo (NUEVO - JSONB)
✅ jurisprudencia (NUEVO - JSONB)

CAMPOS PROTEGIDOS:
❌ numero_processo (solo admin)
❌ titulo (solo admin)
❌ advogado_responsavel (solo admin)
❌ status (admin y advogado, assistente NO)
*/
