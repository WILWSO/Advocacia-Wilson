# Funcionalidad del Menú Social

## Descripción
Se ha implementado un completo sistema de gestión de contenido social que permite a usuarios autenticados administrar noticias, videos, imágenes y anuncios importantes para el sitio web del bufete de abogados.

## Características Implementadas

### 1. Menú Social
- **Acceso**: Solo visible para usuarios autenticados
- **Ubicación**: Aparece en el header entre "Equipe" y "Contato"
- **Icono**: 📱 en versión móvil

### 2. Página de Administración Social (/social)
- **Gestión completa de contenido**: Crear, editar, eliminar posts
- **Tipos de contenido soportados**:
  - ✍️ Artículos
  - 🎥 Videos
  - 🖼️ Imágenes
  - 📢 Anuncios

### 3. Sistema de Autenticación
- **Credenciales de prueba**:
  - Email: `admin@advocacia.com`
  - Contraseña: `admin123`
- **Persistencia**: Los datos de login se mantienen en localStorage

### 4. Feed Social Público
- **Ubicación**: Integrado en la página principal (Home)
- **Características**:
  - Muestra solo contenido publicado
  - Filtros por contenido destacado
  - Sistema de likes y comentarios
  - Responsive design
  - Cards interactivos con animaciones

### 5. Funcionalidades de Gestión
- **Filtros avanzados**: Por tipo de contenido y estado
- **Búsqueda**: En títulos, contenido y etiquetas
- **Sistema de etiquetas**: Para categorizar contenido
- **Contenido destacado**: Posts marcados como importantes
- **Publicación/Despublicación**: Control de visibilidad
- **Preview de medios**: Vista previa de imágenes y videos

## Cómo Usar

### Para Administradores

1. **Hacer Login**:
   - Hacer clic en "Entrar" en el header
   - Usar las credenciales: admin@advocacia.com / admin123

2. **Acceder al Menú Social**:
   - Una vez logado, aparecerá "Social" en el menú
   - Hacer clic para acceder a la gestión

3. **Crear Contenido**:
   - Hacer clic en "Crear Conteúdo"
   - Seleccionar tipo de contenido
   - Llenar formulario con título, contenido, etc.
   - Marcar como destacado si es importante
   - Publicar inmediatamente o guardar como borrador

4. **Gestionar Contenido Existente**:
   - Usar filtros para encontrar contenido específico
   - Editar: Icono de lápiz
   - Publicar/Despublicar: Icono de ojo
   - Eliminar: Icono de papelera

### Para Visitantes

1. **Ver Contenido**:
   - El contenido destacado aparece automáticamente en la página principal
   - Los posts muestran información como fecha, autor, likes
   - Se puede interactuar dando likes

2. **Navegar**:
   - Hacer clic en "Ver mais conteúdos" para acceder al feed completo
   - Los visitantes pueden ver todo el contenido publicado

## Archivos Creados/Modificados

### Nuevos Archivos
- `src/pages/SocialPage.tsx` - Página principal de gestión
- `src/components/social/SocialFeed.tsx` - Componente público del feed
- `project/SOCIAL_FEATURE_README.md` - Esta documentación

### Archivos Modificados
- `src/components/layout/Header.tsx` - Agregado menú Social
- `src/store/authStore.ts` - Mejorado sistema de autenticación
- `src/components/auth/LoginButton.tsx` - Actualizado para nuevo store
- `src/App.tsx` - Agregada ruta /social
- `src/pages/Home.tsx` - Integrado SocialFeed
- `src/index.css` - Agregadas clases de utilidad

## Tecnologías Utilizadas
- **React 18** con TypeScript
- **Framer Motion** para animaciones
- **Tailwind CSS** para estilos
- **Zustand** para gestión de estado
- **React Router** para navegación
- **Lucide React** para iconos

## Próximos Pasos Sugeridos
1. Integrar con base de datos real (Supabase)
2. Implementar upload de archivos
3. Agregar sistema de comentarios completo
4. Implementar notificaciones
5. Agregar editor de texto rico (rich text editor)
6. Sistema de roles más granular