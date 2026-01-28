# Scripts Históricos Archivados

Este directorio contiene scripts de migración y mantenimiento que **ya fueron aplicados** a la base de datos en producción.

## ⚠️ Importante

Los scripts en este directorio son **SOLO para referencia histórica**. No deben ejecutarse nuevamente en bases de datos existentes, ya que los cambios que implementan ya están aplicados.

---

## 📁 Estructura

### `2024-migrations/`
Scripts de migración y mantenimiento aplicados durante el desarrollo y evolución del proyecto en 2024.

#### Scripts RLS (Row Level Security)
- **rls-definitive-solution.sql** (211 líneas)
  - Migración histórica de políticas RLS
  - **Estado:** Supersedido por `/database/rls-policies.sql` (versión actual)
  
- **update-rls-assistente-advogado.sql** (189 líneas)
  - Actualización de políticas RLS para roles assistente/advogado
  - **Aplicado:** 2024
  
- **update-rls-titulo-status.sql** (160 líneas)
  - Protección de campos titulo/status en RLS
  - **Aplicado:** 2024
  
- **update-rls-new-fields.sql** (136 líneas)
  - Actualización RLS para nuevos campos agregados
  - **Aplicado:** 2024
  
- **fix-rls-usuarios-role-protection.sql** (67 líneas)
  - Corrección de protección del campo role
  - **Aplicado:** 2024
  
- **fix-foto-perfil-rls.sql** (84 líneas)
  - Corrección de políticas RLS para foto de perfil
  - **Aplicado:** 2024

#### Scripts de Schema/Campos
- **add-audit-fields.sql** (222 líneas)
  - Agregado de campos de auditoría (creado_por, atualizado_por, data_criacao, data_atualizacao)
  - **Aplicado:** 2024
  
- **update-processos-new-fields.sql** (203 líneas)
  - Agregado de nuevos campos a tabla processos_juridicos
  - **Aplicado:** 2024
  
- **add-jsonb-fields-processos.sql** (147 líneas)
  - Agregado de campos JSONB (jurisdicao, honorarios, audiencias, documentos)
  - **Aplicado:** 2024
  
- **fix-audit-triggers.sql** (147 líneas)
  - Corrección de triggers de auditoría
  - **Aplicado:** 2024
  
- **rename-data-cadastro-to-data-criacao.sql** (44 líneas)
  - Renombrado de campos data_cadastro → data_criacao
  - **Aplicado:** 2024

#### Scripts de Utilidad
- **link-users-simple.sql** (130 líneas)
  - Vinculación de usuarios existentes con auth.users
  - **Aplicado:** Durante setup inicial

---

## 🎯 Para Nuevos Deployments

Si necesitas configurar una **nueva base de datos desde cero**, usa los archivos principales ubicados en `/database/`:

### Archivos Master (Source of Truth)
1. **schema.sql** - Schema completo de base de datos
2. **clientes-schema.sql** - Schema detallado de tabla clientes
3. **comentarios-social-schema.sql** - Schema para comentarios sociales
4. **rls-policies.sql** - Políticas RLS actuales y definitivas
5. **storage-buckets-setup.sql** - Configuración de buckets de storage

### Scripts Activos en `/database/scripts/`
- **create-users.sql** - Creación de usuarios iniciales (para testing/setup)
- **verify-roles-sync.sql** - Verificación de sincronización de roles
- **verify-all-foto-policies.sql** - Verificación de políticas de fotos

---

## 📋 Orden de Ejecución Recomendado (Fresh Database)

```bash
# 1. Setup principal
psql < database/schema.sql

# 2. Schemas especializados
psql < database/clientes-schema.sql
psql < database/comentarios-social-schema.sql

# 3. Políticas RLS
psql < database/rls-policies.sql

# 4. Storage buckets
psql < database/storage-buckets-setup.sql

# 5. (Opcional) Crear usuarios de testing
psql < database/scripts/create-users.sql
```

---

## 🔍 Propósito de este Archivo

Este directorio mantiene la **historia completa** de la evolución del schema de base de datos, útil para:

- ✅ Auditoría y trazabilidad de cambios
- ✅ Comprender decisiones de diseño pasadas
- ✅ Referencia para rollbacks de emergencia
- ✅ Documentación de la evolución del proyecto

**Nota:** Los scripts archivados NO deben ejecutarse en bases de datos actuales. Para cambios nuevos, crea nuevos scripts de migración.

---

**Última actualización:** Enero 2026  
**Total de scripts archivados:** 12 archivos, ~1,900 líneas
