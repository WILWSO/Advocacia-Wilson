-- Verificar TODAS las políticas del bucket foto_perfil
SELECT 
  policyname,
  cmd,
  roles,
  permissive
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND (
  policyname ILIKE '%foto%'
  OR bucket_id = 'foto_perfil'
  OR qual LIKE '%foto_perfil%'
  OR with_check LIKE '%foto_perfil%'
)
ORDER BY cmd, policyname;
