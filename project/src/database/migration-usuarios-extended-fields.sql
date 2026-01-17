-- MIGRATION: Agregar campos extendidos a la tabla usuarios
-- Execute este script en el SQL Editor de Supabase

-- Agregar nuevos campos a la tabla usuarios
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS titulo TEXT,
  ADD COLUMN IF NOT EXISTS nome_completo TEXT,
  ADD COLUMN IF NOT EXISTS foto_perfil_url TEXT,
  ADD COLUMN IF NOT EXISTS data_nascimento DATE,
  ADD COLUMN IF NOT EXISTS tipo_documento TEXT,
  ADD COLUMN IF NOT EXISTS numero_documento TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS redes_sociais JSONB,
  ADD COLUMN IF NOT EXISTS endereco TEXT,
  ADD COLUMN IF NOT EXISTS numero TEXT,
  ADD COLUMN IF NOT EXISTS localidade TEXT,
  ADD COLUMN IF NOT EXISTS estado TEXT,
  ADD COLUMN IF NOT EXISTS cep TEXT,
  ADD COLUMN IF NOT EXISTS pais TEXT DEFAULT 'Brasil';

-- Agregar campo documentos_processo a tabla processos_juridicos
ALTER TABLE processos_juridicos
  ADD COLUMN IF NOT EXISTS documentos_processo JSONB DEFAULT '[]'::jsonb;

-- Agregar campo documentos_cliente a tabla clientes
ALTER TABLE clientes
  ADD COLUMN IF NOT EXISTS documentos_cliente JSONB DEFAULT '[]'::jsonb;

-- Nota: El campo 'ativo' (is_active) ya existe en la tabla como BOOLEAN DEFAULT true
