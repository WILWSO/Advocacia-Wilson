-- =====================================================
-- FIX SIMPLIFICADO: POLÍTICA RLS MÁS DIRECTA PARA ADMIN
-- =====================================================
-- Política más simple y directa para admin

-- Eliminar política actual
DROP POLICY IF EXISTS "usuarios_update_policy" ON usuarios;

-- Crear política SIMPLIFICADA
CREATE POLICY "usuarios_update_policy" 
ON usuarios FOR UPDATE 
USING (
  -- Admin puede actualizar cualquier usuario
  EXISTS (
    SELECT 1 FROM usuarios u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
    AND u.ativo = true
  )
  OR
  -- Usuario puede actualizar solo sus propios datos
  id = auth.uid()
)
WITH CHECK (
  -- Si eres admin, puedes cambiar CUALQUIER COSA
  EXISTS (
    SELECT 1 FROM usuarios u
    WHERE u.id = auth.uid()
    AND u.role = 'admin' 
    AND u.ativo = true
  )
  OR
  -- Si no eres admin, no puedes cambiar role ni ativo
  (
    id = auth.uid()
    AND role = (SELECT role FROM usuarios WHERE id = auth.uid())
    AND ativo = (SELECT ativo FROM usuarios WHERE id = auth.uid())
  )
);