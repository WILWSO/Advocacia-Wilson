# Documentación de Modificaciones - Sistema de Gestión de Processos

**Fecha:** 19 de enero de 2026  
**Objetivo:** Expandir la funcionalidad del sistema de gestión de procesos jurídicos con nuevos campos y mejoras estructurales

---

## 📋 Resumen de Cambios

### 1. Nuevos Campos en la Tabla `processos_juridicos`

#### Campos Agregados:
- ✅ **`jurisdicao`** (JSONB) - Información de jurisdicción
  - Estructura: `{uf, municipio, vara, juiz}`
  
- ✅ **`competencia`** (VARCHAR) - Tipo de competencia (texto libre)
  - Ejemplos comunes: `federal`, `estadual`, `trabalhista`, `eleitoral`
  
- ✅ **`atividade_pendente`** (TEXT) - Descripción de actividades pendientes
  
- ✅ **`polo`** (VARCHAR) - Polo del cliente en el proceso
  - Valores: `ativo` (autor/requerente), `passivo` (réu/requerido)
  
- ✅ **`honorarios`** (JSONB) - Información de honorarios
  - Estructura: `{valor_honorarios, detalhes}`
  
- ✅ **`audiencias`** (JSONB Array) - Lista de audiencias
  - Estructura: `[{data, horario, tipo, forma, lugar}]`

#### Campos Eliminados:
- ❌ **`data_vencimento`** - Removido del sistema

---

## 🗄️ Scripts SQL Creados/Actualizados

### 1. Script de Migración
**Archivo:** `project/scripts/update-processos-new-fields.sql`

```sql
-- Agrega todos los nuevos campos
-- Elimina data_vencimento
-- Crea índices GIN para campos JSONB
-- Crea constraints para competencia y polo
```

**Características:**
- ✅ Comandos `IF NOT EXISTS` para ejecución segura
- ✅ Comentarios detallados en cada columna
- ✅ Índices GIN para optimización de búsquedas JSONB
- ✅ Ejemplos de uso incluidos
- ✅ Queries de verificación

### 2. Schema Principal
**Archivo:** `project/src/database/schema.sql`

- ✅ Actualizado con todos los nuevos campos
- ✅ Índices agregados para campos JSONB
- ✅ Constraints definidos para competencia y polo
- ✅ Estructura completa sincronizada

---

## 💻 Frontend - TypeScript

### 1. Tipos Actualizados
**Archivo:** `project/src/lib/supabase.ts`

```typescript
export interface ProcessoJuridico {
  // ... campos existentes ...
  polo?: 'ativo' | 'passivo'
  competencia?: string
  atividade_pendente?: string
  
  // Campos JSONB
  jurisdicao?: {
    uf?: string
    municipio?: string
    vara?: string
    juiz?: string
  }
  honorarios?: {
    valor_honorarios?: number
    detalhes?: string
  }
  audiencias?: Array<{
    data: string
    horario: string
    tipo: string
    forma: string
    lugar: string
  }>
  links_processo?: Array<{
    titulo: string
    link: string
  }>
  jurisprudencia?: Array<{
    ementa: string
    link: string
  }>
}
```

### 2. AdminDashboard.tsx - Cambios Completos

#### A. Estado del Formulario
```typescript
const [formData, setFormData] = useState({
  // ... campos existentes ...
  polo: '' as 'ativo' | 'passivo' | '',
  competencia: '',
  atividade_pendente: '',
  jurisdicao: { uf: '', municipio: '', vara: '', juiz: '' },
  honorarios: { valor_honorarios: '', detalhes: '' },
  audiencias: [] as Array<{ data: string; horario: string; tipo: string; forma: string; lugar: string }>
})
```

#### B. Estados de Gestión
```typescript
const [newAudiencia, setNewAudiencia] = useState({ 
  data: '', horario: '', tipo: '', forma: '', lugar: '' 
})
const [editingAudienciaIndex, setEditingAudienciaIndex] = useState<number | null>(null)
```

#### C. Funciones Handler para Audiencias
- ✅ `handleAddAudiencia()` - Agregar nueva audiencia
- ✅ `handleEditAudiencia(index)` - Editar audiencia existente
- ✅ `handleSaveAudiencia()` - Guardar edición
- ✅ `handleCancelEditAudiencia()` - Cancelar edición
- ✅ `handleDeleteAudiencia(index)` - Eliminar audiencia

#### D. Funciones Actualizadas
- ✅ `handleCreateProcesso` - Envía todos los nuevos campos al crear/actualizar
- ✅ `handleEditProcesso` - Carga todos los campos al editar
- ✅ `resetForm` - Limpia todos los campos nuevos

---

## 🎨 UI Components Agregados

### 1. Formulario de Edición/Creación

#### Campo Polo (línea ~1124)
```tsx
<select value={formData.polo}>
  <option value="">Selecione o polo</option>
  <option value="ativo">Ativo (Autor/Requerente)</option>
  <option value="passivo">Passivo (Réu/Requerido)</option>
</select>
```

#### Campo Competência (línea ~1290)
```tsx
<input
  type="text"
  value={formData.competencia}
  placeholder="Ex: Federal, Estadual, Trabalhista, Eleitoral"
/>
```

#### Sección Atividade Pendente (línea ~1308)
- Textarea para descripción de actividades pendientes

#### Sección Jurisdição (línea ~1320)
- 4 campos de texto: UF, Município, Vara, Juiz
- Grid responsivo 2 columnas
- Campo UF con transformación a mayúsculas

#### Sección Honorários (línea ~1380)
- Campo numérico: Valor dos Honorários (R$)
- Textarea: Detalhes dos Honorários
- Diseño en card con border

#### Sección Audiências (línea ~1800)
- Formulario de 5 campos: Data, Horário, Tipo, Forma, Lugar
- Botones Add/Edit/Save/Cancel contextuales
- Lista de audiências con:
  - Formato de fecha y hora en pt-BR
  - Día de la semana
  - Tipo y forma de la audiencia
  - Icono de calendario
  - Botones de edición/eliminación
  - Design con colores indigo

### 2. Modal de Visualización

#### Sección Informações Adicionais (línea ~2370)
- Visualización de Polo
- Visualización de Competência
- Destacado especial para Atividade Pendente (amber background)

#### Sección Jurisdição (línea ~2395)
- Cards con información de UF, Município, Vara, Juiz
- Grid responsivo
- Solo muestra campos con datos

#### Sección Honorários (línea ~2455)
- Valor destacado en verde
- Formato de moneda brasileña
- Detalhes en card separado

#### Sección Audiências (línea ~2490)
- Cards con diseño indigo
- Fecha y hora formateada con día de la semana
- Tipo y forma de la audiencia
- Icono de calendario
- Localización con emoji 📍
- Layout organizado en grid

---

## 🔍 Validaciones y Constraints

### Base de Datos
```sql
-- Campo competencia sin constraint (texto libre)
ALTER TABLE processos_juridicos
ADD COLUMN IF NOT EXISTS competencia VARCHAR(100);

-- Constraint para polo
ALTER TABLE processos_juridicos
ADD CONSTRAINT polo_check CHECK (
  polo IS NULL OR 
  polo IN ('ativo', 'passivo')
);
```

### Frontend
- ✅ Validación de campos requeridos en audiencias
- ✅ Transformación automática de UF a mayúsculas
- ✅ Formato de moneda en visualización
- ✅ Formato de fecha en pt-BR
- ✅ Confirmación antes de eliminar items

---

## 📊 Índices Creados

```sql
-- Índices regulares
CREATE INDEX idx_processos_competencia ON processos_juridicos(competencia);
CREATE INDEX idx_processos_polo ON processos_juridicos(polo);

-- Índices GIN para JSONB
CREATE INDEX idx_processos_jurisdicao ON processos_juridicos USING GIN (jurisdicao);
CREATE INDEX idx_processos_honorarios ON processos_juridicos USING GIN (honorarios);
CREATE INDEX idx_processos_audiencias ON processos_juridicos USING GIN (audiencias);
CREATE INDEX idx_processos_links ON processos_juridicos USING GIN (links_processo);
CREATE INDEX idx_processos_jurisprudencia ON processos_juridicos USING GIN (jurisprudencia);
```

---

## 🚀 Instrucciones de Despliegue

### 1. Base de Datos

```bash
# Conectar a Supabase o PostgreSQL
psql -h <host> -U <user> -d <database>

# Ejecutar script de migración
\i project/scripts/update-processos-new-fields.sql

# Verificar cambios
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'processos_juridicos'
ORDER BY ordinal_position;
```

### 2. Frontend

```bash
# Navegar al directorio del proyecto
cd project

# Instalar dependencias (si es necesario)
npm install

# Compilar
npm run build

# Iniciar en desarrollo
npm run dev
```

### 3. Verificación

1. ✅ Verificar que todos los campos se muestran en el formulario
2. ✅ Crear un nuevo proceso con todos los campos
3. ✅ Editar un proceso existente
4. ✅ Ver el proceso en el modal de visualización
5. ✅ Verificar que los campos JSONB se guardan correctamente
6. ✅ Probar agregar/editar/eliminar audiencias
7. ✅ Verificar permisos RLS para diferentes roles

---

## 🔐 Consideraciones de Seguridad

- ✅ Constraints de base de datos garantizan integridad
- ✅ TypeScript tipado previene errores de tipo
- ✅ Validaciones en frontend antes de enviar datos
- ✅ Confirmaciones antes de acciones destructivas
- ✅ Permisos RLS respetados en todos los campos

---

## 📝 Ejemplos de Uso

### Consulta por Jurisdição
```sql
SELECT titulo, jurisdicao->>'uf' as uf
FROM processos_juridicos
WHERE jurisdicao->>'uf' = 'SP';
```

### Buscar Procesos por Competência
```sql
SELECT * FROM processos_juridicos
WHERE competencia = 'federal' AND polo = 'ativo';
```

### Listar Próximas Audiências
```sql
SELECT 
  p.titulo,
  a->>'data' as data_audiencia,
  a->>'horario' as horario,
  a->>'tipo' as tipo,
  a->>'forma' as forma,
  a->>'lugar' as lugar
FROM processos_juridicos p,
     jsonb_array_elements(p.audiencias) a
WHERE (a->>'data')::date >= CURRENT_DATE
ORDER BY (a->>'data')::date, a->>'horario';
```

### Atualizar Honorários
```sql
UPDATE processos_juridicos
SET honorarios = '{"valor_honorarios": 5000.00, "detalhes": "3 parcelas"}'
WHERE id = 'uuid-do-processo';
```

---

## 🎯 Próximos Pasos Sugeridos

1. **Testing**
   - Testar CRUD completo de todos los campos
   - Verificar performance con grandes volúmenes de datos
   - Validar responsividad en mobile

2. **Mejoras Opcionales**
   - Agregar notificaciones para audiencias próximas
   - Export de datos en PDF/Excel con nuevos campos
   - Filtros avanzados por jurisdição e competência
   - Dashboard con estadísticas de audiencias

3. **Documentación**
   - Manual de usuario actualizado
   - Guía de administrador con nuevos campos
   - API documentation si aplica

---

## ✅ Checklist de Implementación

- [x] Scripts SQL creados y documentados
- [x] Schema principal actualizado
- [x] Tipos TypeScript actualizados
- [x] Estado del formulario expandido
- [x] Funciones handler implementadas
- [x] UI del formulario completa
- [x] Modal de visualización actualizado
- [x] Validaciones agregadas
- [x] Sin errores de compilación
- [x] Documentación completa

---

## 📞 Soporte

Para dudas o problemas relacionados con esta implementación, revisar:
- Scripts SQL en `project/scripts/`
- Código fuente en `project/src/pages/AdminDashboard.tsx`
- Tipos en `project/src/lib/supabase.ts`
- Esta documentación

**¡Implementación completada con éxito! 🎉**
