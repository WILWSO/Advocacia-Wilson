-- FIX POLÍTICAS RLS PARA FOTO_PERFIL
-- Permite que admins suban fotos para cualquier usuario
-- Execute este script no SQL Editor do Supabase

-- 1. Eliminar política antigua de INSERT
DROP POLICY IF EXISTS "Usuarios pueden subir sus fotos de perfil" ON storage.objects;

-- 2. Crear nueva política de INSERT que permite:
--    a) Usuarios subir sus propias fotos (carpeta = auth.uid)
--    b) Admins subir fotos para cualquier usuario
CREATE POLICY "Usuarios y admins pueden subir fotos de perfil"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'foto_perfil' AND (
    -- Usuario sube su propia foto
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Admin puede subir foto de cualquier usuario
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- 3. Eliminar política antigua de UPDATE
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus fotos de perfil" ON storage.objects;

-- 4. Crear nueva política de UPDATE
CREATE POLICY "Usuarios y admins pueden actualizar fotos de perfil"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'foto_perfil' AND (
    -- Usuario actualiza su propia foto
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Admin puede actualizar cualquier foto
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- 5. Eliminar política antigua de DELETE
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus fotos de perfil" ON storage.objects;

-- 6. Crear nueva política de DELETE
CREATE POLICY "Usuarios y admins pueden eliminar fotos de perfil"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'foto_perfil' AND (
    -- Usuario elimina su propia foto
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Admin puede eliminar cualquier foto
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- 7. Verificar políticas creadas
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
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname ILIKE '%foto%perfil%'
ORDER BY policyname;
