# REGLA DE ORO PARA COPILOTE VSCODE
Tu analisas y recomienda, yo decido. Haz todo bajo mi permiso previo.

## Arquitectura y Estructura
ADR - ARCHICTETURAL DECISION RECORD (Dado el contexto de un <requisito r> que trata con una <preocupación c>, decidimos utilizar la <opción o> para lograr el <objetivo o>, aceptando la <desventaja d>)

  Component‑Driven Modular Frontend (CDMF). Sin backend propio, utilizando Supabase. Priorizar modularidad (separacion de camadas y responsabilidades), escalabilidad, mantenibilidad y trabajo en equipo.

### Estado Global
Estas tres herramientas — Zustand, Redux Toolkit y Context API— sirven para manejar estado global en React, pero cada una tiene un propósito distinto y un nivel de complejidad diferente.

Herramienta     | Complejidad | Rendimiento | Escalabilidad | Ideal para
Zustand         | Baja        | Excelente   | Media         | Apps pequenas/Medianas
Redux Toolkit   | Media/Alta  | Muy buena   | Alta          | Apps grandes, equipos grandes
Context API     | Muy baja    | Buena       | Baja          | Estados simples

Eligir siempre Zustand, a menos que la información ubicada en "Ideal para" sea una mejor opción para el tamaño del proyecto.

DESIGN
IMPLEMENTACION

## DEPLOY
Yo utilizo solo vercel.

La aplicación NO es SSR (Server-Side Rendering). Es una SPA (Single Page Application) con CSR (Client-Side Rendering).

Stack Actual:
Vite - Build tool para SPAs por defecto
React 18 - Sin framework SSR
React Router DOM - Client-side routing
index.html - Entry point estático típico de SPA

Opción 1: Vite Plugin SSG (Static Site Generation)
npm install vite-plugin-ssr

Opción 2: Migrar a Astro (mantener React components)
Astro genera HTML estático pero permite React para interactividad


## OPATIMIZACIÓN - DRY (Don't Repeat Yourself) y ARQUITECTURA CDMF
### 1. Separación de camadas y responsabilidades.
 verifica si el archivo <nombre> viola los principios de KISS (Keep It Simple) y DRY (Don't Repeat Yourself), separacion de camadas y responsabilidades, escalabilidad, mantenibilidad y la responsividad. Antes de crear nuevos componentes, verifica la carpeta <components> a ver si ya existe alguno que realiza la funcionalidad. Tu sugieres y recomienda, yo decido. Haz todo bajo mi permiso previo.

### 2. Redundancia o duplicidad de codigo
Verifica la carpeta <AdminDashboard> con sus subcarpetas (si hay) y certifica que no haya redundancia de codigo en los componentes, duplicidad o repetición inecesaria de funciones, estados, reinderización o códigos. Prioriza la separacion de camadas y responsabilidades, escalabilidad, mantenibilidad y la responsividad para celulares, tablets, ipads, laptops y desktops.

### 3. Refactorización
Haz una revisión en la carpeta <nombre> con sus subcarpetas (si hay) y verifica si hace falta refactorar algun archivo para mantener la separacion de camadas y responsabilidades, escalabilidad, mantenibilidad y especialmente la responsividad para celulares, tablets y ipads, y desktops y laptops.

### 4. Duplicidad de componente y funciones - DRY (Don't Repeat Yourself)
Verifica la carpeta <nombre> con sus subcarpetas (si hay) e identifica si viola el principio DRY (Don't Repeat Yourself) y CDMF, o sea, si no hay en el resto del proyecto otro archivo similar o que cumple el mismo objetivo de los archivos en esta carpeta.

### 5. Orden y organización de carpetas
Revisa la carpeta <nombre> con sus subcarpetas (si hay) y verifica sy hay algun archivo que deberia ser movido a otra carpeta más adecuada o si algun archivo del resto del proyecto debaría estar en esta carpeta, conforme nuestra arquitectura adoptada.

### 6.  Fusion - KISS (Keep It Simple) - sobre-modularización
En la carpeta <nombre> con sus subcarpetas (si hay) verifica si todos los archivos son realmente necesarios o se puede fusionar con algun otro archivo del proyecto sin violar los principios KISS (Keep It Simple) y DRY (Don't Repeat Yourself), separacion de camadas y responsabilidades, escalabilidad, mantenibilidad y la responsividad. Sugierir mejoras, yo decido.

### 7. CARPETAS MAYORES - analisis amplia
En la carpeta <nombre> con sus subcarpetas (si hay) verifica los principios KISS (Keep It Simple) y DRY (Don't Repeat Yourself), y compara com nuestra Arquitetura si hay necessidade de fusion o refactorización del codigo. Verifica tambien si hay otros archivos en el proyecto que debe ser movido para estas carpetas o el contrario. No te olvides: Sugerencia tuya, decisión mía.

