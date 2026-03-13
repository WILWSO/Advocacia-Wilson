# Santos & Nascimento Advogados Associados

> Website institucional profissional para escritório de advocacia em Palmas, Tocantins

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)

## 📋 Sobre o Projeto

Website moderno e responsivo desenvolvido para o escritório Santos & Nascimento Advogados Associados. O projeto apresenta as áreas de atuação, equipe profissional, blog jurídico e sistema de gestão administrativa integrado com Supabase.

### ✨ Principais Funcionalidades

- **Website Institucional Completo**
  - Home page com hero dinâmico
  - Seção "Sobre Nós" com história e valores
  - Áreas de Atuação detalhadas
  - Apresentação da equipe
  - Formulário de contato integrado
  
- **Seção Social/Blog**
  - Publicação de artigos, vídeos, imagens e anúncios
  - Sistema de likes e comentários
  - Compartilhamento em redes sociais
  - Filtros por tipo de conteúdo e tags
  
- **Painel Administrativo**
  - Gestão de processos jurídicos
  - Cadastro de clientes
  - Gerenciamento de conteúdo social
  - Dashboard com estatísticas
  - Sistema de autenticação seguro

- **Design Responsivo**
  - Totalmente adaptado para mobile, tablet e desktop
  - Performance otimizada (96.5% responsivo)
  - Acessibilidade (WCAG 2.1)
  - SEO otimizado

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.5** - Superset tipado de JavaScript
- **Vite 5.4** - Build tool moderna e rápida
- **React Router 6.22** - Roteamento SPA
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **Framer Motion 11.0** - Biblioteca de animações

### Backend & Database
- **Supabase** - Backend as a Service (PostgreSQL)
  - Authentication
  - Real-time Database
  - Row Level Security (RLS)
  - Storage

### UI & Icons
- **Lucide React 0.344** - Ícones modernos e consistentes
- **React Helmet Async 2.0** - Gerenciamento de meta tags

### State Management
- **Zustand 4.5** - Gerenciamento de estado global

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/advocacia-wilson.git
cd advocacia-wilson/project
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

4. **Configure o banco de dados**

Execute os scripts SQL no Supabase (na ordem):
- `scripts/create-users.sql` - Criar usuários admin
- `scripts/rls-definitive-solution.sql` - Políticas RLS
- `src/database/schema.sql` - Schema principal
- `scripts/link-users-simple.sql` - Vincular usuários

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Gera build de produção na pasta dist/
npm run preview      # Preview do build de produção

# Qualidade de Código
npm run lint         # Executa ESLint
```

## 📁 Estrutura do Projeto

```
project/
├── public/              # Arquivos estáticos (imagens, logos)
├── src/
│   ├── assets/         # Assets do projeto
│   ├── components/     # Componentes React
│   │   ├── auth/       # Autenticação
│   │   ├── home/       # Componentes da home
│   │   ├── layout/     # Layout (Header, Footer)
│   │   ├── shared/     # Componentes reutilizáveis
│   │   └── social/     # Componentes do blog
│   ├── database/       # Schemas SQL
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Configurações (Supabase)
│   ├── pages/          # Páginas da aplicação
│   ├── store/          # Estado global (Zustand)
│   ├── utils/          # Funções utilitárias
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Entry point
├── scripts/            # Scripts SQL
├── .env.example        # Exemplo de variáveis de ambiente
├── package.json        # Dependências
├── tailwind.config.js  # Configuração Tailwind
├── tsconfig.json       # Configuração TypeScript
└── vite.config.ts      # Configuração Vite
```

## 🔒 Segurança

O projeto implementa várias camadas de segurança:

- **Autenticação via Supabase Auth**
- **Row Level Security (RLS)** no banco de dados
- **Validação e sanitização de inputs**
- **Rate limiting** em formulários
- **Headers de segurança** (CSP, XSS Protection, etc.)
- **Variáveis de ambiente** para dados sensíveis

## 🌐 Deploy

### Recomendações de Hospedagem

- **Vercel** (Recomendado)
- **Netlify**
- **Firebase Hosting**
- **AWS Amplify**

### Deploy na Vercel

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. Execute o deploy:
```bash
vercel --prod
```

3. Configure as variáveis de ambiente no dashboard da Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 📊 Performance

- **Lighthouse Score:** 95+
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.0s
- **Bundle Size (gzipped):** ~206 KB

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é propriedade de **Santos & Nascimento Advogados Associados**.

## 👥 Autores

**Desenvolvido para:**
- Dr. Wilson Santos de Oliveira
- Dr. Lucas Nascimento
- Dra. Rosimeire Albuquerque

**Desenvolvimento:**
- Wilton Silva

## 📞 Contato

- **Website:** [Em breve]
- **Email:** wilson@advocaciaintegral.com
- **Telefone:** +55 (63) 99999-9999
- **Endereço:** Palmas, Tocantins, Brasil

---

⚖️ **Santos & Nascimento Advogados Associados** - Excelência Jurídica desde 2010
