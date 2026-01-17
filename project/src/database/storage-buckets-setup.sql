-- SCRIPT PARA CRIAR BUCKETS DE STORAGE NO SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. Criar bucket para fotos de perfil de usuarios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'foto_perfil',
  'foto_perfil',
  true, -- Público para poder mostrar las fotos
  5242880, -- 5MB por archivo
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'image/gif'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar bucket para documentos de clientes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos_cliente',
  'documentos_cliente',
  false, -- Privado, requiere autenticación
  52428800, -- 50MB por archivo
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 3. Criar bucket para documentos de processos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos_processo',
  'documentos_processo',
  false, -- Privado, requiere autenticación
  52428800, -- 50MB por archivo
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 4. Políticas RLS para bucket foto_perfil
-- Permitir que usuarios autenticados suban fotos
CREATE POLICY "Usuarios pueden subir sus fotos de perfil"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'foto_perfil' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir lectura pública de fotos de perfil
CREATE POLICY "Fotos de perfil son públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'foto_perfil');

-- Permitir que usuarios actualicen sus propias fotos
CREATE POLICY "Usuarios pueden actualizar sus fotos de perfil"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'foto_perfil' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuarios eliminen sus propias fotos o admin
CREATE POLICY "Usuarios pueden eliminar sus fotos de perfil"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'foto_perfil' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- 5. Políticas RLS para bucket documentos_cliente
-- Permitir que usuarios autenticados suban archivos
CREATE POLICY "Usuarios autenticados pueden subir documentos de clientes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documentos_cliente');

-- Permitir que usuarios autenticados lean sus propios documentos o si son admin/advogado
CREATE POLICY "Usuarios pueden leer documentos de clientes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos_cliente' AND (
    -- Usuario puede ver sus propios documentos
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Admin y advogados pueden ver todos
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND role IN ('admin', 'advogado')
    )
  )
);

-- Permitir que usuarios eliminen sus documentos o admin
CREATE POLICY "Usuarios pueden eliminar documentos de clientes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentos_cliente' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- 6. Políticas RLS para bucket documentos_processo
-- Permitir que usuarios autenticados suban documentos de processos
CREATE POLICY "Usuarios autenticados pueden subir documentos de processos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documentos_processo');

-- Permitir que usuarios lean documentos de processos (admin y advogados)
CREATE POLICY "Usuarios pueden leer documentos de processos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos_processo' AND
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND role IN ('admin', 'advogado', 'usuario')
  )
);

-- Permitir que admin y advogados eliminen documentos de processos
CREATE POLICY "Admin y advogados pueden eliminar documentos de processos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentos_processo' AND
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND role IN ('admin', 'advogado')
  )
);

-- NOTAS:
-- Los archivos se almacenarán con la siguiente estructura:
-- foto_perfil: {usuario_id}/{nombre_archivo} - Público, solo imágenes, 5MB max
-- documentos_cliente: {cliente_id}/{nombre_archivo} - Privado, múltiples formatos, 50MB max
-- documentos_processo: {processo_id}/{nombre_archivo} - Privado, múltiples formatos, 50MB max
