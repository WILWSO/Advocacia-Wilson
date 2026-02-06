-- =====================================================
-- LIMPIAR POLÍTICAS DUPLICADAS Y CREAR UNA SOLA CORRECTA
-- =====================================================

-- Eliminar TODAS las políticas de UPDATE duplicadas
DROP POLICY IF EXISTS "users_can_update_own_data" ON usuarios;
DROP POLICY IF EXISTS "usuarios_update_policy" ON usuarios;
DROP POLICY IF EXISTS "usuarios_update_unified" ON usuarios;

-- Crear UNA SOLA política de UPDATE bien configurada
CREATE POLICY "usuarios_update_unified" 
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
  -- Si eres admin, NO HAY RESTRICCIONES
  EXISTS (
    SELECT 1 FROM usuarios u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
    AND u.ativo = true
  )
  OR
  -- Si NO eres admin, no puedes cambiar role, ativo ni posicao
  (
    id = auth.uid()
    AND role = (SELECT role FROM usuarios WHERE id = auth.uid())
    AND ativo = (SELECT ativo FROM usuarios WHERE id = auth.uid())
    AND posicao = (SELECT posicao FROM usuarios WHERE id = auth.uid())
  )
);