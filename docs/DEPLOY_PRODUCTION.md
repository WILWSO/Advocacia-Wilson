# 🚀 GUÍA COMPLETA DE DEPLOY Y PRODUCCIÓN
## Advocacia Wilson - Deployment Guide

Esta guía unificada cubre todo el proceso de deploy desde preparación hasta monitoreo post-producción.

---

## 📋 CHECKLIST PRE-DEPLOY

### 1. Código y Build

- [ ] Build exitoso: `npm run build`
- [ ] Sin errores TypeScript: `npm run type-check`
- [ ] Sin vulnerabilidades: `npm run check-security`
- [ ] ESLint sin errores: `npm run lint`
- [ ] Preview funcional: `npm run preview`

```bash
# Verificar en rama main
git checkout main
git pull origin main

# Ejecutar checks
npm run type-check
npm run build
npm run preview
```

### 2. Git y Repositorio

- [ ] Todos los cambios commiteados
- [ ] Push realizado: `git push origin main`
- [ ] Sin archivos sensibles (.env no está en el repo)
- [ ] README.md actualizado

### 3. Supabase - Configuración de Base de Datos

**⚠️ IMPORTANTE**: Ejecuta estos scripts **EN ORDEN** en el SQL Editor de Supabase:

1. `database/schema.sql` - Tablas principales
2. `database/migration-usuarios-extended-fields.sql` - Campos extendidos
3. `database/migration-documentos-foto-perfil.sql` - Documentos y fotos
4. `database/storage-buckets-setup.sql` - Buckets de almacenamiento
5. `database/rls-policies.sql` - Políticas de seguridad

**Verificación:**
- [ ] Ve a: **Database → Tables**
- [ ] Confirma que existen: `usuarios`, `clientes`, `processos_juridicos`, `posts_social`, `comentarios_social`
- [ ] Ve a: **Storage**
- [ ] Confirma buckets:
  - `foto_perfil` (5MB, público, solo imágenes)
  - `documentos_cliente` (50MB, privado)
  - `documentos_processo` (50MB, privado)

### 4. Variables de Entorno

**Obtener credenciales de Supabase:**
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com)
2. Navega a: **Settings → API**
3. Copia estos valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

```env
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui
```

⚠️ **NUNCA uses el Service Role Key en el frontend**

### 5. Seguridad

- [ ] Revisar políticas RLS en Supabase
- [ ] Verificar que buckets privados requieren autenticación
- [ ] Confirmar que las signed URLs tienen tiempo de expiración
- [ ] Validar permisos de roles (admin, advogado, usuario)

---

## 🚀 DEPLOY EN PRODUCCIÓN

### Opción 1: Vercel (Recomendado)

#### A. Via Dashboard (Más Fácil)

1. Ve a [vercel.com](https://vercel.com) y haz login
2. Click en **"Add New..." → Project**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente Vite
5. Configura las variables de entorno:
   - Click en **"Environment Variables"**
   - Agrega:
     ```
     VITE_SUPABASE_URL = tu_url_de_supabase
     VITE_SUPABASE_ANON_KEY = tu_anon_key
     ```
6. Click en **"Deploy"**
7. ¡Espera 2-4 minutos y listo! 🎉

#### B. Via CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (primera vez - configuración interactiva)
vercel

# 4. Deploy a producción
vercel --prod
```

**Configuración (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Opción 2: Netlify

#### A. Via Dashboard

1. Ve a [netlify.com](https://netlify.com) y haz login
2. Click en **"Add new site" → Import an existing project**
3. Conecta GitHub y selecciona tu repositorio
4. Build settings (se detectan automáticamente con netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click en **"Advanced" → "New variable"** y agrega:
   ```
   VITE_SUPABASE_URL = tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY = tu_anon_key
   ```
6. Click en **"Deploy site"**
7. ¡Listo! 🎉

#### B. Via CLI

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Inicializar sitio
netlify init

# 4. Deploy a producción
netlify deploy --prod
```

**Configuración (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Opción 3: Deploy Manual

```bash
# 1. Build del proyecto
npm run build

# 2. Los archivos listos están en dist/
# 3. Sube la carpeta dist/ a tu servidor web
# 4. Configura el servidor para SPA routing (todas las rutas → index.html)
```

---

## 🧪 TESTING POST-DEPLOY

### Checklist Completo de Pruebas

#### 1. Autenticación
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Roles se aplican correctamente (admin, advogado, usuario)
- [ ] Redirección correcta según rol

#### 2. Gestión de Usuarios (Admin)
- [ ] Crear nuevo usuario
- [ ] Upload de foto de perfil (máximo 5MB)
- [ ] Editar datos de usuario
- [ ] Cambiar contraseña
- [ ] Eliminar usuario

#### 3. Gestión de Clientes
- [ ] Crear cliente
- [ ] Upload de documentos (máximo 50MB)
- [ ] Visualizar documentos en nueva pestaña
- [ ] Descargar documentos sin corrupción
- [ ] Editar información del cliente
- [ ] Eliminar cliente

#### 4. Gestión de Procesos
- [ ] Crear proceso jurídico
- [ ] Upload de documentos (máximo 50MB)
- [ ] Visualizar/descargar sin corrupción
- [ ] Asignar advogado responsable
- [ ] Editar detalles del proceso
- [ ] Cambiar estado del proceso

#### 5. Red Social
- [ ] Ver posts públicos sin autenticación
- [ ] Dar like en posts
- [ ] Comentar en posts
- [ ] Admin puede crear posts nuevos

#### 6. Responsive Design
- [ ] Mobile (375px) - Menú hamburguesa funcional
- [ ] Tablet (768px) - Grids ajustados
- [ ] Laptop (1366px) - Vista óptima
- [ ] Desktop (1920px+) - Sin problemas de expansión

#### 7. Verificaciones Técnicas
- [ ] Abrir DevTools (F12) → Console sin errores
- [ ] Network tab → Peticiones a Supabase exitosas
- [ ] No hay errores 401/403 (autenticación/permisos)
- [ ] Performance: First Load < 2 segundos

---

## 📊 MONITOREO POST-DEPLOY

### En el Navegador
- Abre DevTools (F12)
- **Console**: No debe haber errores en rojo
- **Network**: Verifica que las peticiones a Supabase funcionen (status 200)

### En Supabase Dashboard
- Ve a: **Logs → API Logs**
- Verifica que las peticiones se registren correctamente
- No debe haber errores 401 (sin autenticación) o 403 (sin permisos)
- Monitorea Storage para uploads

### En Hosting (Vercel/Netlify)
- Revisa los **Build Logs** para verificar deploy exitoso
- Configura **notificaciones de errores** (opcional)
- Verifica métricas de performance

### Métricas Esperadas
- **Build Time**: 2-4 minutos
- **Bundle Size**: ~800KB (~210KB gzipped)
- **First Load**: < 2 segundos
- **TypeScript Errors**: 0
- **Security Issues**: 0

---

## 🔧 CONFIGURACIÓN AVANZADA

### Dominio Personalizado

#### En Vercel:
1. Ve a tu proyecto → **Settings → Domains**
2. Click en **"Add Domain"**
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS

#### En Netlify:
1. Ve a **Site settings → Domain management**
2. Click en **"Add custom domain"**
3. Ingresa tu dominio
4. Configura los DNS según indicaciones

### Performance y SEO

#### Después del primer deploy:

1. **Actualizar robots.txt** con tu dominio real:
   ```bash
   # Edita: public/robots.txt
   # Descomenta y actualiza:
   Sitemap: https://tu-dominio.com/sitemap.xml
   ```

2. **Commit y push**:
   ```bash
   git add public/robots.txt
   git commit -m "chore: Update robots.txt with production domain"
   git push origin main
   ```

3. **Auto-deploy**: Vercel/Netlify detectará el push y desplegará automáticamente

#### Optimizaciones Opcionales:
- [ ] Configurar CDN para assets estáticos
- [ ] Habilitar compresión gzip/brotli (automático en Vercel/Netlify)
- [ ] Configurar Analytics (Vercel Analytics, Google Analytics)

---

## 🐛 TROUBLESHOOTING

### Problema: Variables de entorno no funcionan
**Síntomas:** Errores de conexión a Supabase, "undefined" en configuración

**Solución:**
1. Verificar que las variables empiecen con `VITE_`
2. Reiniciar el deploy después de agregar variables
3. Verificar que estén en la sección **Production** (no Preview)
4. Limpiar cache y rebuild: `vercel --prod --force` o `netlify deploy --prod --clear-cache`

### Problema: No se cargan datos de Supabase
**Síntomas:** Páginas vacías, spinner infinito

**Solución:**
1. Verificar que las tablas existan en Supabase Dashboard
2. Confirmar que las políticas RLS estén aplicadas
3. Revisar que las credenciales sean correctas (Project URL y Anon Key)
4. Ver logs en Supabase → Logs → API para detalles del error

### Problema: Archivos no se descargan/visualizan
**Síntomas:** Error 404 al abrir documentos, archivos corruptos

**Solución:**
1. Verificar que los buckets de Storage estén creados
2. Confirmar que las políticas de Storage estén aplicadas
3. Revisar que el bucket sea público (`foto_perfil`) o privado según corresponda
4. Verificar que las signed URLs se generen correctamente (debug en console)

### Problema: Error 404 en rutas (refresh)
**Síntomas:** Al recargar página en ruta específica (/admin/usuarios) aparece 404

**Solución:**
1. Verificar que `vercel.json` o `netlify.toml` estén en el repositorio
2. Confirmar que los rewrites estén configurados correctamente
3. Hacer rebuild completo después de agregar archivos de configuración

### Problema: Build falla
**Síntomas:** Deploy error, build timeout

**Solución:**
1. Ejecutar `npm run build` localmente para ver el error específico
2. Verificar que todas las dependencias estén instaladas: `npm ci`
3. Revisar que no haya errores de TypeScript: `npm run type-check`
4. Verificar versión de Node.js compatible (18.x recomendado)

### Problema: Errores de CORS
**Síntomas:** "Access to fetch blocked by CORS policy"

**Solución:**
1. Verificar URL de Supabase (debe incluir https://)
2. Confirmar que las credenciales sean del proyecto correcto
3. No necesitas configurar CORS - Supabase lo maneja automáticamente

---

## 🔄 ACTUALIZACIONES Y MANTENIMIENTO

### Deploy de Actualizaciones

```bash
# 1. Hacer cambios en tu código
# 2. Commit y push
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin main

# 3. Deploy automático (Vercel/Netlify detecta push)
# O manual:
vercel --prod
# o
netlify deploy --prod
```

### Backups Regulares
- **Base de datos Supabase**: Automático (configurable en Supabase Dashboard)
- **Storage buckets**: Configurar backup policy en Supabase
- **Código**: Respaldado en GitHub

### Actualizar Dependencias

```bash
# Verificar actualizaciones
npm outdated

# Actualizar (con precaución)
npm update

# Probar localmente
npm run build
npm run preview

# Si todo funciona, commit y deploy
```

---

## 📚 RECURSOS ADICIONALES

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Netlify](https://docs.netlify.com)
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Vite](https://vitejs.dev/guide/)

### Documentación Interna del Proyecto

- [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) - Auditoría de seguridad
- [RLS.md](./RLS.md) - Políticas Row Level Security
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Setup detallado de Supabase
- [RESPONSIVE_DESIGN_SUMMARY.md](./RESPONSIVE_DESIGN_SUMMARY.md) - Diseño responsive

---

## ✅ CONFIRMACIÓN FINAL

Antes de marcar como completo, verifica:

- [ ] ✅ **Sitio accesible**: URL funciona en navegador
- [ ] ✅ **Login funciona**: Puedes autenticarte correctamente
- [ ] ✅ **CRUD funciona**: Crear/leer/actualizar/eliminar registros
- [ ] ✅ **Storage funciona**: Upload/download de archivos sin errores
- [ ] ✅ **Responsive funciona**: Se ve bien en móvil, tablet y desktop
- [ ] ✅ **Sin errores en consola**: DevTools limpio
- [ ] ✅ **Performance aceptable**: Carga rápida (<2s)

**Si todo está ✅, el deploy está COMPLETO! 🎉**

---

## 📝 REGISTRO DE DEPLOY

Documenta cada deploy:

- **URL del sitio**: _______________________
- **Fecha de deploy**: _______________________
- **Versión**: _______________________
- **Deploy realizado por**: _______________________
- **Plataforma**: Vercel / Netlify / Otro
- **Notas adicionales**: _______________________

---

**✨ ¡Feliz Deploy!** 🚀

*Última actualización: Enero 2026*
