# Sistema de Controle de Processos Jurídicos - Supabase

## ⚡ SOLUÇÃO RÁPIDA - CRIAR USUÁRIOS

### Método Recomendado: Via Dashboard Supabase

**PASSO 1**: No painel do Supabase, vá em **Authentication > Users**

**PASSO 2**: Clique em **Add User** e crie CADA usuário manualmente:

```
👤 Usuário 1:
Email: wilson@advocaciaintegral.com
Password: admin123456
✅ Clique "Add User"

👤 Usuário 2:  
Email: lucas@advocaciaintegral.com
Password: admin123456
✅ Clique "Add User"

👤 Usuário 3:
Email: admin@advocaciaintegral.com  
Password: admin123456
✅ Clique "Add User"
```

**PASSO 3**: Execute o script `scripts/link-users-simple.sql` no SQL Editor para vincular os usuários

**PASSO 4**: Teste o login com qualquer email acima e password: `admin123456`

---

## 📋 Configuração Inicial do Supabase

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie uma conta ou faça login
3. Clique em "New Project" 
4. Nome do projeto: `Advocacia-Wilson_db`
5. Defina uma senha forte para o banco
6. Selecione a região mais próxima

### 2. Configurar Variáveis de Ambiente

Após criar o projeto, acesse **Settings > API** e copie:

1. **Project URL** 
2. **anon public key**

Edite o arquivo `.env` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://sua-url-do-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 3. Criar as Tabelas no Banco

Acesse o **SQL Editor** no Supabase e execute o script completo que está em:
`src/database/schema.sql`

Este script criará:
- ✅ Tabela `usuarios` (advogados e administradores)
- ✅ Tabela `processos_juridicos` (processos com status e dados do cliente)  
- ✅ Tabela `comentarios_processos` (comentários e atualizações)
- ✅ Tabela `documentos_processos` (para futuras expansões)
- ✅ Triggers para atualização automática de timestamps
- ✅ Índices para performance
- ✅ Row Level Security (RLS) configurado

### 4. Configurar Autenticação

No painel do Supabase:

1. Vá em **Authentication > Settings**
2. Configure **Email Auth** como habilitado
3. Defina **Site URL**: `http://localhost:5177` (desenvolvimento)
4. Em **Redirect URLs**, adicione: `http://localhost:5177/admin`
5. **IMPORTANTE**: Desabilite "Email Confirmations" para desenvolvimento

### 5. Criar Usuários com Passwords

#### Opção A: Via Dashboard Supabase (RECOMENDADO)

1. Vá em **Authentication > Users**
2. Clique em **Add User**
3. Adicione os usuários com emails e passwords:

```
Email: wilson@advocaciaintegral.com
Password: admin123456
Confirm Password: admin123456
```

```
Email: lucas@advocaciaintegral.com  
Password: admin123456
Confirm Password: admin123456
```

```
Email: admin@advocaciaintegral.com
Password: admin123456  
Confirm Password: admin123456
```

4. Para cada usuário criado, **copie o UUID** mostrado na coluna ID
5. **Execute no SQL Editor** para vincular com a tabela usuarios:

```sql
-- Substitua os UUIDs pelos IDs reais dos usuários criados
-- Primeiro, limpe a tabela usuarios se já existe dados
DELETE FROM usuarios;

-- Insira os usuarios vinculando com os IDs de auth
INSERT INTO usuarios (id, email, nome, role) VALUES
('UUID_DO_WILSON_AQUI', 'wilson@advocaciaintegral.com', 'Dr. Wilson Santos', 'admin'),
('UUID_DO_LUCAS_AQUI', 'lucas@advocaciaintegral.com', 'Dr. Lucas Nascimento', 'advogado'),
('UUID_DO_ADMIN_AQUI', 'admin@advocaciaintegral.com', 'Administrador', 'admin');
```

#### Opção B: Via SQL (Alternativa)

Execute no SQL Editor para criar usuários com passwords diretamente:

```sql
-- ATENÇÃO: Este método é mais complexo e pode falhar
-- Use apenas se a Opção A não funcionar

-- 1. Primeiro criar no sistema auth
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
  email_change
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
  ''
);

-- Repita para outros usuários...
-- Em seguida, vincule com a tabela usuarios usando os UUIDs gerados
```

### 6. Funcionalidades Implementadas

#### 🔐 **Sistema de Autenticação**
- Login/logout com Supabase Auth
- Proteção de rotas administrativas
- Gerenciamento de sessões

#### 📋 **Gestão de Processos**
- ✅ Criar novos processos
- ✅ Listar todos os processos  
- ✅ Filtrar por status (Em Aberto, Em Andamento, Fechado)
- ✅ Filtrar por advogado responsável
- ✅ Busca por título, descrição ou cliente
- ✅ Alterar status dos processos
- ✅ Dashboard com estatísticas

#### 👥 **Gerenciamento de Usuários**
- ✅ Lista de advogados cadastrados
- ✅ Atribuição de responsáveis aos processos

#### 📝 **Sistema de Comentários** (Implementado nos hooks)
- ✅ Adicionar comentários aos processos
- ✅ Histórico de atualizações
- ✅ Rastreamento de alterações

### 7. Acesso ao Sistema

Após configurar tudo:

1. **Site público**: http://localhost:5177
2. **Painel administrativo**: http://localhost:5177/admin
3. **Login**: Use o botão "Entrar" no header do site

### 8. Estrutura dos Status

- **🔵 Em Aberto**: Processo recém-criado, aguardando início
- **🟡 Em Andamento**: Processo em desenvolvimento ativo
- **🟢 Fechado**: Processo finalizado/resolvido

### 9. Próximos Passos (Expansões Futuras)

- 📎 Upload de documentos
- 📅 Sistema de prazos e lembretes  
- 📊 Relatórios avançados
- 📱 Notificações em tempo real
- 🏃‍♂️ Workflow de aprovações
- 💰 Controle financeiro

---

## 🚀 Como Usar

1. Configure as variáveis de ambiente no `.env`
2. Execute o script SQL no Supabase
3. Crie os usuários iniciais  
4. Acesse `/admin` para começar a usar o sistema
5. Faça login com os emails configurados

O sistema está pronto para gerenciar processos jurídicos com funcionalidades essenciais de controle e acompanhamento!