# 🏛️ SANTOS & NASCIMENTO - Advocacia Integral

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Security](https://img.shields.io/badge/security-audited-success)]()
[![License](https://img.shields.io/badge/license-Private-red)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)]()
[![React](https://img.shields.io/badge/React-18.3-61dafb)]()

> Mais que fazer justiça, amar pessoas.

Sistema completo de gestão para escritório de advocacia em Palmas-TO. Inclui gestão de clientes, processos jurídicos, documentos, usuários e rede social corporativa.

---

## 📋 Índice

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Deploy](#-deploy)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Seguridad](#-seguridad)
- [Documentación](#-documentación)

---

## ✨ Características

### 🔐 Sistema de Autenticación
- Login seguro con Supabase Auth
- Control de acceso basado en roles (Admin, Advogado, Usuario)
- Políticas RLS (Row Level Security) implementadas

### 👥 Gestión de Usuarios
- CRUD completo de usuarios
- Upload de foto de perfil
- Cambio de contraseña
- Campos extendidos (teléfono, direcciones, redes sociales, etc.)
- Modal de visualización con 6 secciones organizadas

### 👨‍💼 Gestión de Clientes
- CRUD completo de clientes
- Campos detallados (contacto, ubicación, documentos, etc.)
- Sistema de documentos con upload/download
- Visualización sin corrupción de archivos
- Modal de visualización con 5 secciones

### ⚖️ Gestión de Procesos Jurídicos
- CRUD de procesos con información completa
- Campos JSONB para datos complejos (jurisdicción, honorarios, etc.)
- Sistema de documentos por proceso
- Asignación de advogado responsable
- Estados: Em aberto, Em andamento, Fechado
- Prioridades configurables

### 📄 Sistema de Documentos
- Upload de documentos (PDF, DOC, DOCX, JPG, PNG)
- Límites: 50MB por documento
- Visualización en nueva pestaña (sin corrupción)
- Descarga segura con signed URLs
- Storage separado por tipo (clientes, procesos)

### 📱 Red Social Corporativa
- Posts públicos con texto e imágenes
- Sistema de likes y comentarios
- Publicación de videos
- Posts destacados
- Vista pública sin autenticación

### 🎨 UI/UX Moderno
- Diseño responsive (móvil, tablet, desktop)
- Animaciones con Framer Motion
- Skeleton loaders para mejor UX
- Modales optimizados y organizados
- Tema oscuro profesional

---

## 🛠️ Tecnologías

### Frontend
- **React 18.3** - Biblioteca UI
- **TypeScript 5.5** - Tipado estático
- **Vite 7.3** - Build tool y dev server
- **React Router 6** - Enrutamiento
- **Tailwind CSS 3.4** - Estilos
- **Framer Motion 11** - Animaciones
- **Lucide React** - Iconos
- **Zustand 4.5** - State management

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL - Base de datos
  - Authentication - Sistema de autenticación
  - Storage - Almacenamiento de archivos
  - Row Level Security - Seguridad a nivel de fila

### DevOps & Tools
- **ESLint** - Linting
- **TypeScript** - Type checking
- **SonarQube** - Análisis de código
- **Git** - Control de versiones

---

## 📦 Requisitos

- **Node.js** >= 20.11.0 (ver `.nvmrc`)
- **npm** >= 10.0.0
- **Git**
- Cuenta en **Supabase**

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/WILWSO/Advocacia-Wilson.git
cd Advocacia-Wilson
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de Supabase
# VITE_SUPABASE_URL=tu_url_aqui
# VITE_SUPABASE_ANON_KEY=tu_key_aqui
```

### 4. Configurar Supabase

Ejecuta estos scripts SQL en orden (Supabase Dashboard → SQL Editor):

1. `database/schema.sql`
2. `database/migration-usuarios-extended-fields.sql`
3. `database/migration-documentos-foto-perfil.sql`
4. `database/storage-buckets-setup.sql`
5. `database/rls-policies.sql`

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Obtén estas credenciales en:**
Supabase Dashboard → Settings → API

### Storage Buckets

El proyecto usa 3 buckets:
- `foto_perfil` - Público, 5MB, solo imágenes
- `documentos_cliente` - Privado, 50MB
- `documentos_processo` - Privado, 50MB

---

## 🌐 Deploy

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy a producción
vercel --prod
```

**O via Dashboard:**
1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno
3. Deploy automático

### Opción 2: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy a producción
netlify deploy --prod
```

**O via Dashboard:**
1. Conecta tu repositorio en [netlify.com](https://netlify.com)
2. El `netlify.toml` ya está configurado
3. Agrega variables de entorno
4. Deploy automático

### Guía Completa

Para instrucciones detalladas paso a paso, consulta:
**[docs/DEPLOY_PRODUCTION.md](./docs/DEPLOY_PRODUCTION.md)**

---

## 📁 Estructura del Proyecto

```
Advocacia-Wilson/
├── public/               # Archivos estáticos
│   ├── Images/          # Imágenes del sitio
│   └── robots.txt       # SEO
├── src/
│   ├── components/      # Componentes React
│   │   ├── admin/       # Componentes del admin
│   │   ├── auth/        # Autenticación
│   │   ├── home/        # Página principal
│   │   ├── layout/      # Layout y navegación
│   │   └── shared/      # Componentes reutilizables
│   ├── data/            # Datos estáticos
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Configuración de librerías
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios externos
│   ├── types/           # Definiciones TypeScript
│   ├── utils/           # Utilidades
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globales
├── database/            # Scripts SQL de Supabase
├── docs/                # Documentación
├── .env.example         # Ejemplo de variables
├── .nvmrc               # Versión de Node
├── netlify.toml         # Config de Netlify
├── vercel.json          # Config de Vercel
├── package.json         # Dependencias
├── tsconfig.json        # Config de TypeScript
├── tailwind.config.js   # Config de Tailwind
└── vite.config.ts       # Config de Vite
```

---

## 🔐 Seguridad

### Auditoría de Seguridad ✅

El proyecto ha pasado una auditoría completa de seguridad:

- ✅ Sin vulnerabilidades en dependencias
- ✅ Credenciales protegidas (no en repositorio)
- ✅ Variables de entorno correctamente configuradas
- ✅ RLS (Row Level Security) implementado
- ✅ Storage con políticas de acceso
- ✅ Signed URLs con expiración temporal
- ✅ Validación de entrada en formularios
- ✅ Rate limiting implementado

**Ver:** [docs/SECURITY_AUDIT.md](./docs/SECURITY_AUDIT.md)

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Admin** | Acceso total al sistema |
| **Advogado** | Gestión de procesos asignados, ver clientes |
| **Usuario** | Solo lectura de sus propios datos |

---

## 📚 Documentación

### Documentos Principales

- **[docs/DEPLOY_PRODUCTION.md](./docs/DEPLOY_PRODUCTION.md)** - Guía completa de deploy y producción
- **[docs/SECURITY_AUDIT.md](./docs/SECURITY_AUDIT.md)** - Auditoría de seguridad
- **[docs/RLS.md](./docs/RLS.md)** - Políticas de seguridad RLS
- **[docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Configuración de Supabase

### Guías de Desarrollo

- **[docs/ERROR_HANDLING.md](./docs/ERROR_HANDLING.md)** - Manejo de errores
- **[docs/CONFIRMATION_SYSTEM.md](./docs/CONFIRMATION_SYSTEM.md)** - Sistema de confirmaciones
- **[docs/INLINE_NOTIFICATION_GUIDE.md](./docs/INLINE_NOTIFICATION_GUIDE.md)** - Notificaciones
- **[docs/RESPONSIVE_DESIGN_SUMMARY.md](./docs/RESPONSIVE_DESIGN_SUMMARY.md)** - Diseño responsive
- **[docs/SOCIAL_FEATURE_README.md](./docs/SOCIAL_FEATURE_README.md)** - Red social

---

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Build
npm run build           # Build de producción
npm run preview         # Previsualizar build local
npm run prebuild        # Type checking antes del build

# Calidad de Código
npm run lint            # Ejecutar ESLint
npm run type-check      # Verificar tipos TypeScript

# Seguridad
npm run check-security  # Auditoría de seguridad

# Utilidades
npm run clean           # Limpiar cache y build
npm run sonar           # Análisis con SonarQube
```

---

## 📊 Estado del Proyecto

- **Status:** ✅ LISTO PARA PRODUCCIÓN
- **Build Size:** 670KB (196KB gzipped)
- **TypeScript Errors:** 0
- **Security Vulnerabilities:** 0
- **Test Coverage:** N/A (pendiente)

---

## 🤝 Contribuir

Este es un proyecto privado para SANTOS & NASCIMENTO Advogados Associados.

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2026

---

## 📞 Contacto

**SANTOS & NASCIMENTO Advogados Associados**
- 📍 Palmas - TO, Brasil
- 🌐 [Sitio Web](#)
- 📧 [Email](#)

---

## 🙏 Agradecimientos

Desarrollado con ❤️ por el equipo de SANTOS & NASCIMENTO

---

**✨ ¡Listo para producción!** 🚀
