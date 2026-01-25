-- MIGRATION: Reorganizar campos de documentos y agregar bucket foto_perfil
-- Execute este script en el SQL Editor de Supabase

-- 1. Remover campo documentos_cliente de la tabla usuarios
ALTER TABLE usuarios
  DROP COLUMN IF EXISTS documentos_cliente;

-- 2. Agregar campo documentos_cliente a la tabla clientes
ALTER TABLE clientes
  ADD COLUMN IF NOT EXISTS documentos_cliente JSONB DEFAULT '[]'::jsonb;

-- 3. Comentarios descriptivos
COMMENT ON COLUMN clientes.documentos_cliente IS 'Array JSONB de documentos del cliente almacenados en bucket documentos_cliente';
COMMENT ON COLUMN usuarios.foto_perfil_url IS 'URL de la foto de perfil almacenada en bucket foto_perfil';
