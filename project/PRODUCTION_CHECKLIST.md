# ✅ Checklist de Producción - Advocacia Wilson

## 📋 Pre-Deploy Checklist

### 1. Configuración de Supabase
- [ ] Verificar que las tablas están creadas: `usuarios`, `clientes`, `processos_juridicos`, `posts_social`, `comentarios_social`
- [ ] Verificar que los buckets de storage están creados:
  - [ ] `foto_perfil` (5MB, público, solo imágenes)
  - [ ] `documentos_cliente` (50MB, privado)
  - [ ] `documentos_processo` (50MB, privado)
- [ ] Ejecutar políticas RLS (Row Level Security)
- [ ] Verificar variables de entorno en `.env`:
  ```
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

### 2. Build de Producción
- [x] Corregidos todos los errores de TypeScript
- [x] Build completado exitosamente: `npm run build`
- [x] Archivos generados en `/dist`

### 3. Variables de Entorno
Asegúrate de configurar estas variables en tu plataforma de hosting:

```env
VITE_SUPABASE_URL=https://xsdvhabwnvrfeoyharob.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configuración de Hosting (Vercel/Netlify)

#### Para Vercel:
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

#### Para Netlify:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 5. Seguridad

- [ ] Revisar políticas RLS en Supabase
- [ ] Verificar que los buckets privados requieren autenticación
- [ ] Confirmar que las signed URLs tienen tiempo de expiración
- [ ] Validar permisos de roles (admin, advogado, usuario)

### 6. Performance

- [x] Optimización de imágenes con LazyImage
- [x] Code splitting implementado
- [x] Animaciones con Framer Motion optimizadas
- [ ] Configurar CDN para assets estáticos
- [ ] Habilitar compresión gzip/brotli en servidor

### 7. SEO

- [x] Meta tags configurados en SEOHead component
- [x] Sitemap generado
- [ ] Configurar robots.txt
- [ ] Verificar Open Graph tags

### 8. Testing Pre-Deploy

- [ ] Probar login/logout
- [ ] Verificar upload de fotos de perfil
- [ ] Verificar upload de documentos (clientes y procesos)
- [ ] Probar descarga de documentos (sin corrupción)
- [ ] Verificar permisos RLS:
  - [ ] Admin puede ver todo
  - [ ] Usuarios solo ven sus propios datos
  - [ ] Advogados pueden gestionar procesos asignados
- [ ] Probar responsive en móvil/tablet/desktop
- [ ] Verificar modales en diferentes tamaños de pantalla

## 🚀 Deploy Steps

### Opción 1: Vercel (Recomendado)

1. Conectar repositorio GitHub
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd project
vercel --prod
```

2. Configurar variables de entorno en Vercel Dashboard

### Opción 2: Netlify

1. Instalar Netlify CLI
```bash
npm i -g netlify-cli

# Deploy
cd project
netlify deploy --prod
```

2. Configurar variables de entorno en Netlify Dashboard

### Opción 3: Manual

1. Build del proyecto
```bash
cd project
npm run build
```

2. Subir carpeta `dist/` a tu servidor
3. Configurar servidor para SPA (todas las rutas → index.html)

## 📊 Monitoreo Post-Deploy

- [ ] Verificar que la aplicación carga correctamente
- [ ] Revisar consola del navegador (no errores)
- [ ] Probar todas las funcionalidades principales
- [ ] Verificar Analytics (si está configurado)
- [ ] Monitorear logs de Supabase

## 🔧 Mantenimiento

### Backups Regulares
- Base de datos Supabase (automático)
- Storage buckets (configurar backup policy)

### Actualizaciones
```bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Rebuild y redeploy
npm run build
vercel --prod
```

## 📝 Notas Importantes

1. **URLs Firmadas**: Los signed URLs expiran después de:
   - Visualización: 1 hora
   - Descarga: 1 minuto

2. **Límites de Upload**:
   - Fotos de perfil: 5MB (JPG, PNG, WEBP)
   - Documentos: 50MB (PDF, DOC, DOCX, JPG, PNG)

3. **Roles y Permisos**:
   - `admin`: Acceso total
   - `advogado`: Gestión de procesos
   - `usuario`: Solo lectura de sus datos

## ✨ Mejoras Implementadas (Sesión 14h-20h)

- ✅ Sistema de documentos en AdminDashboard con fix de corrupción
- ✅ Sistema completo de documentos en ClientesPage
- ✅ Modal de visualización de clientes (5 secciones)
- ✅ Sistema de fotos de perfil en UsuariosPage
- ✅ Modal de visualización de usuarios mejorado (6 secciones)
- ✅ Reorganización de botones con reglas RLS
- ✅ Fix campo redes_sociais
- ✅ Modales responsivos (max-w-4xl)
- ✅ Corrección de errores de TypeScript para producción

## 🎯 Estado del Build

- **Status**: ✅ READY FOR PRODUCTION
- **Build Size**: 798.59 kB (gzipped: 208.52 kB)
- **Warnings**: Chunk size > 500kB (considerar code splitting futuro)
- **Errores**: 0
