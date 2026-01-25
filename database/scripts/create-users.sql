-- Script para criar usuários com autenticação no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. PRIMEIRO: Limpar dados existentes se necessário
DELETE FROM comentarios_processos;
DELETE FROM documentos_processos;  
DELETE FROM processos_juridicos;
DELETE FROM usuarios;

-- 2. CRIAR USUÁRIOS NO SISTEMA DE AUTH
-- ATENÇÃO: Execute cada INSERT separadamente e anote os UUIDs gerados

-- Usuário Wilson (Admin)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'wilson@advocaciaintegral.com',
  crypt('admin123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}',
  '{"name":"Dr. Wilson Santos"}'
) ON CONFLICT (email) DO NOTHING;

-- Usuário Lucas
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'lucas@advocaciaintegral.com',
  crypt('admin123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}',
  '{"name":"Dr. Lucas Nascimento"}'
) ON CONFLICT (email) DO NOTHING;

-- Usuário Admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@advocaciaintegral.com',
  crypt('admin123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}',
  '{"name":"Administrador"}'
) ON CONFLICT (email) DO NOTHING;

-- 3. VERIFICAR OS USUÁRIOS CRIADOS
SELECT id, email, created_at FROM auth.users WHERE email LIKE '%advocaciaintegral.com';

-- 4. CRIAR ENTRADAS NA TABELA USUARIOS
-- SUBSTITUA OS UUIDs PELOS IDs REAIS DOS USUÁRIOS CRIADOS ACIMA

/*
-- Exemplo de como fazer o link (substitua pelos UUIDs reais):
INSERT INTO usuarios (id, email, nome, role) 
SELECT 
  id,
  email,
  CASE 
    WHEN email = 'wilson@advocaciaintegral.com' THEN 'Dr. Wilson Santos'
    WHEN email = 'lucas@advocaciaintegral.com' THEN 'Dr. Lucas Nascimento'
    WHEN email = 'admin@advocaciaintegral.com' THEN 'Administrador'
  END as nome,
  CASE 
    WHEN email IN ('wilson@advocaciaintegral.com', 'admin@advocaciaintegral.com') THEN 'admin'
    ELSE 'advogado'
  END as role
FROM auth.users 
WHERE email LIKE '%advocaciaintegral.com';
*/

-- 5. DADOS DE EXEMPLO PARA PROCESSOS
INSERT INTO processos_juridicos (numero_processo, titulo, descricao, status, area, cliente_nome, cliente_contato, responsavel_id, valor_causa, data_audiencia) 
SELECT 
  '1001234-12.2024.8.07.0001',
  'Ação de Cobrança - Empresa XYZ',
  'Cobrança de valores em aberto referente a prestação de serviços advocatícios.',
  'aberto',
  'civil',
  'Empresa XYZ Ltda',
  'contato@empresaxyz.com',
  u.id,
  50000.00,
  '2024-02-15 14:00:00'
FROM usuarios u WHERE u.email = 'wilson@advocaciaintegral.com'
LIMIT 1;

INSERT INTO processos_juridicos (numero_processo, titulo, descricao, status, area, cliente_nome, cliente_contato, responsavel_id, valor_causa, data_audiencia)
SELECT 
  '2002345-23.2024.8.07.0002', 
  'Defesa Criminal - João Silva',
  'Defesa em processo criminal por lesão corporal culposa.',
  'em_andamento',
  'criminal',
  'João Silva',
  'joao@email.com',
  u.id,
  15000.00,
  '2024-02-20 09:30:00'
FROM usuarios u WHERE u.email = 'lucas@advocaciaintegral.com'
LIMIT 1;

-- 6. COMENTÁRIOS DE EXEMPLO
INSERT INTO comentarios_processos (processo_id, usuario_id, comentario)
SELECT 
  p.id,
  u.id,
  'Processo iniciado. Aguardando documentação complementar do cliente.'
FROM processos_juridicos p 
CROSS JOIN usuarios u 
WHERE p.numero_processo = '1001234-12.2024.8.07.0001'
  AND u.email = 'wilson@advocaciaintegral.com'
LIMIT 1;

COMMIT;