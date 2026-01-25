# ==================================================
# GUÍA DE DEPLOY - Advocacia Wilson
# ==================================================

## 🚀 PASO A PASO PARA PRODUCCIÓN

### 1️⃣ PREPARACIÓN LOCAL

```bash
# 1. Asegúrate de estar en la branch main
git checkout main
git pull origin main

# 2. Verifica que no haya errores
npm run type-check

# 3. Haz un build de prueba
npm run build

# 4. Verifica que no haya vulnerabilidades
npm run check-security

# 5. Previsualiza el build
npm run preview
```

### 2️⃣ CONFIGURAR SUPABASE

**Importante:** Ejecuta estos scripts EN ORDEN en el SQL Editor de Supabase:

1. `database/schema.sql` - Tablas principales
2. `database/migration-usuarios-extended-fields.sql` - Campos extendidos
3. `database/migration-documentos-foto-perfil.sql` - Documentos y fotos
4. `database/storage-buckets-setup.sql` - Buckets de almacenamiento
5. `database/rls-policies.sql` - Políticas de seguridad

**Verificación:**
- Ve a: Database → Tables
- Confirma que existen: usuarios, clientes, processos_juridicos, posts_social, comentarios_social
- Ve a: Storage
- Confirma buckets: foto_perfil, documentos_cliente, documentos_processo

### 3️⃣ OBTENER CREDENCIALES DE SUPABASE

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a: **Settings → API**
3. Copia estos valores:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon/public key** → VITE_SUPABASE_ANON_KEY

⚠️ **NUNCA uses el Service Role Key en el frontend**

### 4️⃣ DEPLOY EN VERCEL (Recomendado)

#### Opción A: Via Dashboard (Más Fácil)

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
7. ¡Espera unos minutos y listo! 🎉

#### Opción B: Via CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Sigue las instrucciones interactivas
# Cuando pregunte por variables de entorno, agrégalas

# 5. Para deploy a producción
vercel --prod
```

### 5️⃣ DEPLOY EN NETLIFY

#### Opción A: Via Dashboard

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

#### Opción B: Via CLI

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

### 6️⃣ POST-DEPLOY: TESTING

#### Checklist de Pruebas

- [ ] **Autenticación**
  - [ ] Login funciona
  - [ ] Logout funciona
  - [ ] Roles se aplican (admin, advogado, usuario)

- [ ] **Usuarios** (Admin)
  - [ ] Crear nuevo usuario
  - [ ] Upload de foto de perfil
  - [ ] Editar datos de usuario
  - [ ] Cambiar contraseña
  - [ ] Eliminar usuario

- [ ] **Clientes**
  - [ ] Crear cliente
  - [ ] Upload de documentos
  - [ ] Visualizar documentos (nueva pestaña)
  - [ ] Descargar documentos
  - [ ] Editar cliente
  - [ ] Eliminar cliente

- [ ] **Procesos**
  - [ ] Crear proceso
  - [ ] Upload de documentos
  - [ ] Visualizar/descargar sin corrupción
  - [ ] Asignar advogado
  - [ ] Editar proceso
  - [ ] Cambiar estado

- [ ] **Social**
  - [ ] Ver posts públicos
  - [ ] Like en posts
  - [ ] Comentar posts
  - [ ] Admin puede crear posts

- [ ] **Responsive**
  - [ ] Desktop (1920px)
  - [ ] Laptop (1366px)
  - [ ] Tablet (768px)
  - [ ] Mobile (375px)

### 7️⃣ CONFIGURAR DOMINIO PERSONALIZADO (Opcional)

#### En Vercel:
1. Ve a tu proyecto → Settings → Domains
2. Click en "Add Domain"
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS

#### En Netlify:
1. Ve a Site settings → Domain management
2. Click en "Add custom domain"
3. Ingresa tu dominio
4. Configura los DNS según indicaciones

### 8️⃣ MONITOREO POST-DEPLOY

#### En el Navegador:
- Abre DevTools (F12)
- Ve a Console → No debe haber errores en rojo
- Ve a Network → Verifica que las peticiones a Supabase funcionen

#### En Supabase:
- Ve a: Logs → API Logs
- Verifica que las peticiones se registren correctamente
- No debe haber errores 401 (sin autenticación) o 403 (sin permisos)

#### En el Hosting (Vercel/Netlify):
- Revisa los logs de build
- Verifica que el deploy fue exitoso
- Configura notificaciones de errores

### 9️⃣ ACTUALIZAR DESPUÉS DEL DEPLOY

```bash
# 1. Actualiza robots.txt con tu dominio real
# Edita: public/robots.txt
# Descomenta y actualiza:
Sitemap: https://tu-dominio.com/sitemap.xml

# 2. Commit y push
git add .
git commit -m "chore: Update robots.txt with production domain"
git push origin main

# 3. Vercel/Netlify detectará el push y hará auto-deploy
```

### 🔟 TROUBLESHOOTING

#### Error: Variables de entorno no definidas
- Verifica que las variables estén configuradas en el hosting
- Reinicia el deploy después de agregar variables
- Variables deben empezar con `VITE_` para ser accesibles

#### Error: No se pueden cargar datos de Supabase
- Verifica que las tablas existan en Supabase
- Confirma que las políticas RLS estén aplicadas
- Revisa que las credenciales sean correctas

#### Error: Archivos no se descargan correctamente
- Verifica que los buckets de Storage estén creados
- Confirma que las políticas de Storage estén aplicadas
- Revisa que el bucket sea público (foto_perfil) o privado según corresponda

#### Error 404 en rutas
- Verifica que los rewrites estén configurados (vercel.json o netlify.toml)
- Confirma que el framework sea detectado como Vite/SPA

#### Error: Build falla
- Ejecuta `npm run build` localmente para ver el error
- Verifica que todas las dependencias estén instaladas
- Revisa que no haya errores de TypeScript

## 📚 RECURSOS ADICIONALES

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Netlify](https://docs.netlify.com)
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Vite](https://vitejs.dev/guide/)

## 🆘 SOPORTE

Si encuentras problemas:
1. Revisa [docs/SECURITY_AUDIT.md](./SECURITY_AUDIT.md)
2. Consulta [docs/PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
3. Revisa [docs/RLS.md](./RLS.md) para problemas de permisos
4. Verifica los logs en Supabase Dashboard

---

**✨ ¡Feliz Deploy!** 🚀
