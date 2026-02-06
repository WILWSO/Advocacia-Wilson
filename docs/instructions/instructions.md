# Copilot Instructions - Santos & Nascimento Advogados

## Visión General del Proyecto

Website institucional + sistema administrativo para escritório de advocacia brasileño. Stack: **React 18 + TypeScript + Vite + Supabase + Tailwind CSS**.

## Arquitectura y Estructura

### Frontend
- **Rutas públicas**: Home, Sobre, Áreas de Atuação, Equipe, Contato, Blog Social (`/social`)
- **Rutas administrativas**: Dashboard (`/admin`), Clientes, Usuários, Gestión de contenido social
- **Layout condicional**: Header/Footer se ocultan en rutas `/admin*` (ver [App.tsx](project/src/App.tsx#L35-L48))

### Backend (Supabase)
- **PostgreSQL** con Row Level Security (RLS) estricto
- **Autenticación**: Supabase Auth integrada con tabla `usuarios`
- **Storage**: 3 buckets configurados
  - `foto_perfil`: 5MB, público, solo imágenes
  - `documentos_cliente`: 50MB, privado
  - `documentos_processo`: 50MB, privado

### Estado Global
- **Zustand** para auth en [authStore.ts](project/src/store/authStore.ts)
- Usuario se enriquece desde tabla `usuarios` post-login con `role`, `nome`, `avatar_url`

## Sistema de Roles y Permisos (CRÍTICO)

Tres roles: `admin`, `advogado`, `assistente`. Ver [RLS.md](project/RLS.md) completo.

### Reglas de Negocio Clave
1. **Solo admin** puede:
   - Crear/eliminar usuarios, clientes, processos
   - Editar campos protegidos: `nome_completo` (clientes), `numero_processo`, `titulo`, `advogado_responsavel` (processos)
   - Cambiar `role` y `status` de usuarios

2. **Admin + Advogado** pueden:
   - Editar `status` de processos (`em_aberto`, `em_andamento`, `fechado`)

3. **Todos** (admin/advogado/assistente) pueden:
   - Crear/editar processos y clientes (con restricciones)
   - Ver y comentar processos

### Implementación de Permisos
- **Frontend**: Campos protegidos deshabilitados con mensaje "(Apenas admin pode editar)"
- **RLS**: Políticas en [rls-policies.sql](project/src/database/rls-policies.sql) rechazan cambios no autorizados
- **Patrón**: Verificar `user?.role` antes de mostrar/enviar datos sensibles (ej: [AdminDashboard.tsx](project/src/pages/AdminDashboard.tsx#L231-L233))

```typescript
// Ejemplo de verificación de rol
const isAdmin = user?.role === 'admin'
const canEditProtectedField = isAdmin // Aplicar lógica de negocio
```

## Convenciones de Código

### Seguridad (NO NEGOCIABLE)
Siempre sanitizar inputs del usuario con [InputSanitizer.ts](project/src/utils/InputSanitizer.ts):
```typescript
import { InputSanitizer } from '../utils/InputSanitizer'

// Para nombres, títulos
const cleaned = InputSanitizer.sanitizeString(userInput)
// Para email
const cleanEmail = InputSanitizer.sanitizeEmail(email)
// Para texto largo (comentarios, descripciones)
const cleanText = InputSanitizer.sanitizeText(message)
```

### Tipos y Schemas
- Interfaces principales en [supabase.ts](project/src/lib/supabase.ts): `ProcessoJuridico`, `Usuario`, `PostSocial`, `DocumentoArquivo`
- Campos JSONB estructurados: `jurisdicao`, `honorarios`, `audiencias`, `documentos_processo`, `links_processo`, `jurisprudencia`
- Verificar que tipos TypeScript coincidan con schema SQL en [schema.sql](project/src/database/schema.sql)

### Componentes
- Usar `cn()` de [utils/cn.ts](project/src/utils/cn.ts) para clases condicionales
- Accesibilidad: `aria-label`, roles semánticos, navegación por teclado
- Lazy loading de imágenes: `<LazyImage>` o `<OptimizedImage>` en `components/shared`

### Estilos
- **Tailwind utility-first**: Evitar CSS custom salvo casos excepcionales
- Responsivo: Mobile-first con breakpoints `sm:`, `md:`, `lg:`
- Paleta: `neutral-*` para grises, `gold-*` para acentos (ver [tailwind.config.js](project/tailwind.config.js))

## Patrones de UI (Proyecto Actual)

### Modales
Pattern consistente usado en [ClientesPage.tsx](project/src/pages/ClientesPage.tsx) y [AdminDashboard.tsx](project/src/pages/AdminDashboard.tsx):

```typescript
// Estado del modal
const [showModal, setShowModal] = useState(false)
const [editingItem, setEditingItem] = useState<Item | null>(null)

// Abrir para editar
const handleEdit = (item: Item) => {
  setEditingItem(item)
  setFormData(item)
  setShowModal(true)
}

// Abrir para crear
const handleCreate = () => {
  setEditingItem(null)
  setFormData(initialState)
  setShowModal(true)
}

// Cerrar y limpiar
const handleCloseModal = () => {
  setShowModal(false)
  setEditingItem(null)
}
```

### Formularios
**Pattern de validación y envío:**
```typescript
const handleSave = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // 1. Verificar permisos
  if (!canEdit) {
    alert('Você não tem permissão para editar')
    return
  }
  
  // 2. Sanitizar datos
  const sanitizedData = {
    ...formData,
    titulo: InputSanitizer.sanitizeString(formData.titulo),
    descricao: InputSanitizer.sanitizeText(formData.descricao)
  }
  
  try {
    // 3. Operación con Supabase
    const { error } = await supabase
      .from('table')
      .upsert(sanitizedData)
    
    if (error) throw error
    
    // 4. Actualizar UI
    await fetchData()
    handleCloseModal()
  } catch (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao salvar. Tente novamente.')
  }
}
```

**Campos protegidos** (deshabilitados según rol):
```tsx
<input
  disabled={!isAdmin}
  title={!isAdmin ? '(Apenas admin pode editar)' : ''}
  className={cn(
    'input-base',
    !isAdmin && 'opacity-60 cursor-not-allowed'
  )}
/>
```

### Loading States
Pattern de 3 niveles usado en el proyecto:

```tsx
{isLoading ? (
  // Skeleton cards (mejor UX que spinner)
  <SkeletonCard />
) : items.length === 0 ? (
  // Empty state con ícono + mensaje
  <EmptyState 
    icon={Users}
    title="Nenhum item encontrado"
    description="Comece criando seu primeiro item"
  />
) : (
  // Grid de items
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item, index) => (
      <ItemCard key={item.id} item={item} index={index} />
    ))}
  </div>
)}
```

### Animaciones con Framer Motion
```tsx
// Cards con stagger animation (AdminDashboard.tsx:85)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.3, 
    delay: index * 0.05, // Stagger effect
    ease: "easeOut"
  }}
>
  {/* Card content */}
</motion.div>
```

## Estruturas JSONB (Documentación Completa)

### 1. jurisdicao
```typescript
interface Jurisdicao {
  uf?: string          // Sigla do estado (ex: "TO", "SP")
  municipio?: string   // Nome do município
  vara?: string        // Ex: "1ª Vara Cível"
  juiz?: string        // Nome do juiz responsável
}

// Ejemplo de uso
const jurisdicao: Jurisdicao = {
  uf: "TO",
  municipio: "Palmas",
  vara: "1ª Vara da Fazenda Pública",
  juiz: "Dr. João Silva"
}
```

### 2. honorarios
```typescript
interface Honorarios {
  valor_honorarios?: number  // Valor em reais
  detalhes?: string         // Descrição (ex: "3 parcelas")
}

// Ejemplo de uso
const honorarios: Honorarios = {
  valor_honorarios: 5000.00,
  detalhes: "Honorários contratuais - 3 parcelas de R$ 1.666,67"
}
```

### 3. audiencias (Array)
```typescript
interface Audiencia {
  data: string      // ISO 8601 date ("2026-02-15")
  horario: string   // Formato HH:mm ("14:00")
  tipo: string      // Ex: "Conciliação", "Instrução"
  forma: string     // "Presencial" ou "Virtual"
  lugar: string     // Localização ou link de reunião
}

// Manipulación en el proyecto (AdminDashboard.tsx:630)
setFormData({
  ...formData,
  audiencias: [...formData.audiencias, newAudiencia]
})
```

### 4. documentos_processo (Array)
```typescript
interface DocumentoArquivo {
  nome: string
  url: string          // URL do Supabase Storage
  tipo: string         // MIME type ("application/pdf")
  tamanho?: number     // Bytes
  data_upload?: string // ISO 8601 timestamp
}

// Pattern de upload (AdminDashboard.tsx:360-405)
const handleFileUpload = async (file: File) => {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath = `${processoId}/${fileName}`
  
  const { error } = await supabase.storage
    .from('documentos_processo')
    .upload(filePath, file)
  
  if (error) throw error
  
  const { data: urlData } = supabase.storage
    .from('documentos_processo')
    .getPublicUrl(filePath)
  
  const novoDocumento: DocumentoArquivo = {
    nome: file.name,
    url: urlData.publicUrl,
    tipo: file.type,
    tamanho: file.size,
    data_upload: new Date().toISOString()
  }
  
  setFormData(prev => ({
    ...prev,
    documentos_processo: [...prev.documentos_processo, novoDocumento]
  }))
}
```

### 5. links_processo (Array)
```typescript
interface ProcessoLink {
  titulo: string  // Ex: "Petição Inicial"
  link: string    // URL completa
}

// Ejemplo
const links: ProcessoLink[] = [
  { titulo: "Petição Inicial", link: "https://drive.google.com/file/123" },
  { titulo: "Contestação", link: "https://drive.google.com/file/456" }
]
```

### 6. jurisprudencia (Array)
```typescript
interface Jurisprudencia {
  ementa: string  // Texto completo da ementa
  link: string    // URL da jurisprudência
}

// Ejemplo
const jurisprudencias: Jurisprudencia[] = [
  {
    ementa: "Súmula 123 do STJ - Responsabilidade civil por dano moral...",
    link: "https://www.stj.jus.br/sumula123"
  }
]
```

### Queries SQL para JSONB
```sql
-- Buscar processos por UF
SELECT titulo, jurisdicao->>'uf' as uf
FROM processos_juridicos
WHERE jurisdicao->>'uf' = 'TO';

-- Listar próximas audiências
SELECT 
  p.titulo,
  a->>'data' as data_audiencia,
  a->>'tipo' as tipo
FROM processos_juridicos p,
     jsonb_array_elements(p.audiencias) a
WHERE (a->>'data')::date >= CURRENT_DATE
ORDER BY (a->>'data')::date;
```

## Workflows Críticos

### Setup Inicial
1. Crear proyecto Supabase, copiar URL + anon key a `.env`
2. Ejecutar SQLs en orden ([SUPABASE_SETUP.md](project/SUPABASE_SETUP.md#L90-L110)):
   ```
   1. scripts/create-users.sql
   2. scripts/rls-definitive-solution.sql
   3. src/database/schema.sql
   4. scripts/link-users-simple.sql
   ```
3. Crear usuarios manualmente en Supabase Dashboard (Authentication > Users)
4. Vincular con `link-users-simple.sql` usando emails

### Build y Deploy
```bash
npm run dev      # Desarrollo local :5173
npm run build    # Producción -> dist/
npm run preview  # Previsualizar build
```

Ver [PRODUCTION_CHECKLIST.md](project/PRODUCTION_CHECKLIST.md) para checklists de deploy.

### Debugging (Workflow Actual)

**1. Errores de RLS (Row Level Security):**
```bash
# Síntomas: "permission denied" o "new row violates row-level security"

# Paso 1: Ver error en console del navegador
# Buscar líneas como: authStore.ts:56, useSupabase.ts:136

# Paso 2: Verificar políticas en Supabase SQL Editor
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'processos_juridicos';

# Paso 3: Ejecutar script de verificación
# En Supabase SQL Editor: project/scripts/verify-roles-sync.sql

# Paso 4: Testing multi-rol
# Login con admin@advocaciaintegral.com (password: admin123456)
# Login con advogado@... y assistente@...
# Intentar editar campos protegidos → debe rechazar
```

**2. Errores de Supabase (CRUD):**
```typescript
// Pattern usado en todo el proyecto
try {
  const { data, error } = await supabase
    .from('table')
    .insert(sanitizedData)
  
  if (error) throw error
  // ↑ CRÍTICO: Siempre verificar error antes de usar data
  
} catch (error) {
  console.error('Erro ao...:', error) // Ver en DevTools Console
  aLo Que Este Proyecto Hace Bien ✅

### Seguridad (Nivel Empresarial)
1. **Sanitización obligatoria** - InputSanitizer usado en todos los formularios
2. **RLS estricto** - Políticas PostgreSQL a nivel de row (igual que GitHub/Linear)
3. **Campos protegidos** - UI + DB validation para campos sensibles
4. **Auditoría automática** - Triggers SQL para `creado_por`/`atualizado_por`

### Arquitectura (Mejores Prácticas)
1. **Tipado fuerte** - TypeScript interfaces sincronizadas con SQL schema
2. **Estado global minimalista** - Zustand solo para auth (no over-engineering)
3. **Componentes compartidos** - `components/shared/` para reutilización
4. **Lazy loading** - Imágenes optimizadas con componentes custom

### DevOps (Apropiado para proyecto solo/2 personas)
1. **Branch único (main)** - Correcto para equipos pequeños
2. **Scripts SQL versionados** - Migraciones documentadas con comentarios
3. **Checklist de producción** - PRODUCTION_CHECKLIST.md actualizado
4. **Variables de entorno** - Configuración centralizada en `.env`

### Documentación (Excepcional)
1. **README completo** - Setup, estructura, deploy
2. **SQL comentado** - Scripts con ejemplos de uso
3. **RLS.md detallado** - Matriz de permisos por rol
4. **Nuevos campos documentados** - NUEVOS_CAMPOS_DOCUMENTACION.md

## Áreas de Evolución (Aspiracional) 🎯

### Testing (Prioridad: Alta)
**Actual:** Testing manual con checklist
**Evolución futura:**
```typescript
// Vitest para utils (coverage >80%)
import { describe, it, expect } from 'vitest'
import { InputSanitizer } from './InputSanitizer'

describe('InputSanitizer', () => {
  it('should remove XSS attempts', () => {
    const input = '<script>alert("xss")</script>Test'
    expect(InputSanitizer.sanitizeString(input))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;Test')
  })
})

// Playwright para E2E críticos
test('Admin can edit numero_processo', async ({ page }) => {
  await page.goto('/admin')
  await page.fill('[data-testid="numero-processo"]', '123456')
  await page.click('[data-testid="save"]')
  await expect(page.locator('.toast-success')).toBeVisible()
})
```

### Error Tracking (Prioridad: Media)
**Actual:** `console.error()` + alertas al usuario
**Evolución futura:**
```typescript
// Sentry para producción
import * as Sentry from '@sentry/react'

try {
  await supabase.from('table').insert(data)
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'AdminDashboard', action: 'createProcesso' },
    user: { id: user.id, role: user.role }
  })
  console.error('Erro ao criar:', error)
  alert('Erro ao criar processo')
}
```

### JSONB Validation (Prioridad: Media)
**Actual:** Validación en TypeScript (runtime no enforced)
**Evolución futura:**
```typescript
import { z } from 'zod'

const JurisdicaoSchema = z.object({
  uf: z.string().length(2).optional(),
  municipio: z.string().max(100).optional(),
  vara: z.string().max(200).optional(),
  juiz: z.string().max(200).optional()
})

const ProcessoSchema = z.object({
  titulo: z.string().min(5).max(500),
  jurisdicao: JurisdicaoSchema,
  // Runtime validation antes de enviar a Supabase
})

// En formulario
const result = ProcessoSchema.safeParse(formData)
if (!result.success) {
  alert(result.error.issues[0].message)
  return
}
```

### CI/CD Pipeline (Prioridad: Baja)
**Actual:** Deploy manual con checklist
**Evolución futura:**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
```

### Commit Conventions (Prioridad: Baja)
**Actual:** Free-form commits
**Evolución futura:**
```bash
# Commitlint + Husky
feat(auth): add role-based access control
fix(rls): prevent assistente from editing status
docs(readme): update Supabase setup steps

# Auto-changelog generation
npm run release  # Genera CHANGELOG.md desde commits
```

## Notas para AI Agents

### Prioridades Inmutables
- **Prioridad #1**: Seguridad (sanitización + RLS)
- **Campos JSONB**: Validar estructura antes de `INSERT/UPDATE`
- **Usuario activo**: Siempre verificar `user.ativo` y `role` en operaciones sensibles
- **Auditoría**: Campos `creado_por`, `atualizado_por` deben poblarse con `user.id` al crear/editar

### Patterns Actuales a Mantener
- **Modales**: Pattern de `showModal` + `editingItem` + `handleCloseModal`
- **Formularios**: Sanitizar → Verificar permisos → Try/catch → Actualizar UI
- **Loading**: Skeleton cards > Spinner (mejor UX)
- **Animaciones**: Framer Motion con stagger (`delay: index * 0.05`)
- **Campos protegidos**: `disabled={!isAdmin}` + tooltip explicativo

### Cuando Agregar Features
1. Seguir patrón de componentes compartidos en `components/shared/`
2. Crear interface TypeScript primero, luego SQL
3. Agregar política RLS junto con tabla/campo
4. Documentar en README o archivo específico
5. Actualizar PRODUCTION_CHECKLIST.md si afecta deploy

### Anti-Patrones Específicos del Proyecto
❌ NO ignorar `error` en respuestas de Supabase antes de usar `data`
❌ NO enviar `formData` directo sin sanitizar
❌ NO verificar solo en frontend (RLS debe prevenir en DB)
❌ NO usar `console.log` sin también mostrar error al usuario
❌ NO agregar librerías pesadas sin justificación (bundle actual: ~206KB gzipped)
npm run lint

# Ver código no utilizado
npx ts-prune

# Verificar dependencias no usadas
npx depcheck
```

**4. Debugging en Producción:**
- Errores se muestran en console (no hay error tracking)
- Verificar Network tab para requests fallidos a Supabase
- Revisar Storage policies si uploads fallan

### Testing de Permisos
Al modificar RLS, verificar con múltiples roles:
1. Login como `admin@advocaciaintegral.com`
2. Login como `advogado@...` y `assistente@...`
3. Intentar editar campos protegidos (debe rechazar)

**Checklist de testing manual:**
```
☐ Admin puede crear/editar/eliminar todo
☐ Advogado puede crear/editar pero no eliminar
☐ Advogado NO puede editar: numero_processo, titulo, advogado_responsavel
☐ Assistente NO puede editar: status, titulo, numero_processo, advogado_responsavel
☐ Ningún usuario puede cambiar su propio role
☐ Solo admin puede cambiar status de usuarios/clientes
```

## Integraciones Externas

- **Framer Motion**: Animaciones en hero, transiciones de página
- **React Router**: SPA con scroll-to-top en cambio de ruta
- **Supabase Realtime**: Disponible pero no activo (considerar para likes/comentarios en tiempo real)

## Comandos de Limpieza

```bash
npm run lint                  # ESLint
npx depcheck                  # Dependencias no usadas
npx ts-prune                  # Código muerto TypeScript
npx jscpd src/                # Código duplicado
```

## Anti-Patrones a Evitar

❌ NO enviar datos sin sanitizar a Supabase
❌ NO ignorar verificaciones de `user?.role` en UI administrativa
❌ NO hardcodear credentials (usar `.env`)
❌ NO modificar campos protegidos desde frontend sin verificar permisos
❌ NO usar `any` en TypeScript (usar tipos de `supabase.ts`)

## Referencias Rápidas

- **Documentación adicional**: [RESPONSIVE_DESIGN_SUMMARY.md](project/RESPONSIVE_DESIGN_SUMMARY.md), [SOCIAL_FEATURE_README.md](project/SOCIAL_FEATURE_README.md)
- **Campos nuevos processos**: [NUEVOS_CAMPOS_DOCUMENTACION.md](project/NUEVOS_CAMPOS_DOCUMENTACION.md)
- **Deploy**: [DEPLOY_INSTRUCTIONS.md](project/DEPLOY_INSTRUCTIONS.md)
- **Supabase config**: Variables en `.env`, docs en [SUPABASE_SETUP.md](project/SUPABASE_SETUP.md)

## Notas para AI Agents

- **Prioridad #1**: Seguridad (sanitización + RLS)
- **Campos JSONB**: Validar estructura antes de `INSERT/UPDATE`
- **Usuario activo**: Siempre verificar `user.ativo` y `role` en operaciones sensibles
- **Auditoría**: Campos `creado_por`, `atualizado_por` deben poblarse con `user.id` al crear/editar
- Al agregar features, seguir patrón de componentes compartidos en `components/shared/`
