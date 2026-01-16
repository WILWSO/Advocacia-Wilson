-- SCRIPT SIMPLES: Executar DEPOIS de criar usuários no Dashboard
-- 
-- PASSO 1: No Supabase Dashboard vá em Authentication > Users
-- PASSO 2: Clique em "Add User" e crie cada usuário:
--   Email: wil.oliv.advogados@gmail.com  | Password: 1234567 
--   Email: lucsnasmelo@gmail.com         | Password: 1234567  
--   Email: 33rosimeire@gmail.com         | Password: 1234567
--
-- PASSO 3: Execute este script para vincular os usuários criados

-- Limpar tabelas se necessário
DELETE FROM comentarios_processos;
DELETE FROM documentos_processos;
DELETE FROM processos_juridicos;
DELETE FROM usuarios;

-- Vincular usuários do auth.users com a tabela usuarios
INSERT INTO usuarios (id, email, nome, role) 
SELECT 
  id,
  email,
  CASE 
    WHEN email = 'wil.oliv.advogados@gmail.com' THEN 'Dr. Wilson Santos'
    WHEN email = 'lucsnasmelo@gmail.com' THEN 'Dr. Lucas Nascimento'
    WHEN email = '33rosimeire@gmail.com' THEN 'Dra. Rosimeire Oliveira'
    ELSE 'Usuário'
  END as nome,
  CASE 
    WHEN email = 'wil.oliv.advogados@gmail.com' THEN 'admin'
    ELSE 'advogado'
  END as role
FROM auth.users 
WHERE email LIKE '%gmail.com'
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  role = EXCLUDED.role;

-- Verificar se os usuários foram criados
SELECT * FROM usuarios;

-- Criar dados de exemplo para processos
INSERT INTO processos_juridicos (numero_processo, titulo, descricao, status, area_direito, cliente_nome, cliente_email, advogado_responsavel, valor_causa) 
SELECT 
  '1001234-12.2024.8.07.0001',
  'Ação de Cobrança - Empresa XYZ',
  'Cobrança de valores em aberto referente a prestação de serviços advocatícios.',
  'em_aberto',
  'Direito Civil',
  'Empresa XYZ Ltda',
  'contato@empresaxyz.com',
  u.id,
  50000.00
FROM usuarios u WHERE u.email = 'wil.oliv.advogados@gmail.com'
LIMIT 1;

INSERT INTO processos_juridicos (numero_processo, titulo, descricao, status, area_direito, cliente_nome, cliente_email, advogado_responsavel, valor_causa)
SELECT 
  '2002345-23.2024.8.07.0002', 
  'Defesa Criminal - João Silva',
  'Defesa em processo criminal por lesão corporal culposa.',
  'em_andamento',
  'Direito Criminal',
  'João Silva',
  'joao@email.com',
  u.id,
  15000.00
FROM usuarios u WHERE u.email = 'lucsnasmelo@gmail.com'
LIMIT 1;

INSERT INTO processos_juridicos (numero_processo, titulo, descricao, status, area_direito, cliente_nome, cliente_email, advogado_responsavel, valor_causa)
SELECT 
  '3003456-34.2024.8.07.0003',
  'Revisão Contratual - ABC Corp',
  'Revisão de cláusulas contratuais para adequação à nova legislação.',
  'fechado',
  'Direito Empresarial',
  'ABC Corporation',
  'juridico@abccorp.com',
  u.id,
  25000.00
FROM usuarios u WHERE u.email = '33rosimeire@gmail.com'
LIMIT 1;

-- Comentários de exemplo
INSERT INTO comentarios_processos (processo_id, autor, comentario)
SELECT 
  p.id,
  u.id,
  'Processo iniciado. Aguardando documentação complementar do cliente.'
FROM processos_juridicos p 
CROSS JOIN usuarios u 
WHERE p.numero_processo = '1001234-12.2024.8.07.0001'
  AND u.email = 'wil.oliv.advogados@gmail.com'
LIMIT 1;

INSERT INTO comentarios_processos (processo_id, autor, comentario)
SELECT 
  p.id,
  u.id,
  'Documentação recebida. Preparando petição inicial.'
FROM processos_juridicos p 
CROSS JOIN usuarios u 
WHERE p.numero_processo = '2002345-23.2024.8.07.0002'
  AND u.email = 'lucsnasmelo@gmail.com'
LIMIT 1;

-- Comentário adicional para Rosimeire
INSERT INTO comentarios_processos (processo_id, autor, comentario)
SELECT 
  p.id,
  u.id,
  'Contrato revisado e adequado à legislação vigente. Processo finalizado.'
FROM processos_juridicos p 
CROSS JOIN usuarios u 
WHERE p.numero_processo = '3003456-34.2024.8.07.0003'
  AND u.email = '33rosimeire@gmail.com'
LIMIT 1;

-- Verificação final
SELECT 
  p.numero_processo,
  p.titulo,
  p.status,
  u.nome as responsavel,
  COUNT(c.id) as comentarios
FROM processos_juridicos p
LEFT JOIN usuarios u ON p.advogado_responsavel = u.id
LEFT JOIN comentarios_processos c ON p.id = c.processo_id
GROUP BY p.id, p.numero_processo, p.titulo, p.status, u.nome
ORDER BY p.data_criacao DESC;