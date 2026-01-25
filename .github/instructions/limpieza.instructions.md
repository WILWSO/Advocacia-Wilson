---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
### Contexto del Proyecto
Este proyecto es una aplicación web institucional y administrativa para un escritório de advocacia brasileño. Utiliza una pila tecnológica moderna con React 18, TypeScript, Vite, Supabase y Tailwind CSS. La aplicación cuenta con rutas públicas para información institucional y rutas administrativas protegidas para la gestión de clientes, usuarios y contenido.
### Convenciones de Código
1. **Estructura de Archivos**: Mantener una estructura clara y modular. Separar componentes, páginas, estilos y utilidades en carpetas dedicadas.
2. **Nomenclatura**: Utilizar camelCase para variables y funciones, PascalCase para componentes React y UPPER_SNAKE_CASE para constantes.
3. **Tipos y Interfaces**: Definir tipos e interfaces en TypeScript para todas las estructuras de datos complejas. Evitar el uso de `any`.
4. **Manejo de Estado**: Utilizar Zustand para la gestión del estado global, especialmente para la autenticación y datos del usuario. 
5. **Seguridad**: Implementar siempre validaciones y sanitización de entradas del usuario para prevenir vulnerabilidades como inyección SQL o XSS. y descripciones:
```typescript 
const sanitizedInput = InputSanitizer.sanitizeString(userInput)
```
```
6. **Roles y Permisos**: Respetar las reglas de negocio definidas para los roles `admin`, `advogado` y `assistente`. Verificar permisos antes de permitir acciones sensibles.
7. **Estilo de Código**: Seguir las mejores prácticas de React y TypeScript. Utilizar hooks funcionales y evitar componentes de clase.
8. **Documentación**: Comentar el código cuando sea necesario para explicar la lógica compleja. Mantener actualizada la documentación del proyecto en archivos markdown.
9. **Pruebas**: Escribir pruebas unitarias y de integración para componentes críticos utilizando frameworks como Jest y React Testing Library.
10. **Revisiones de Código**: Realizar revisiones de código rigurosas para asegurar la calidad y coherencia del código antes de fusionar cambios en la rama principal.
```
### Directrices para la IA
- Al generar código, seguir estrictamente las convenciones y reglas de negocio descritas. 
- Al responder preguntas, proporcionar explicaciones claras y concisas basadas en el contexto del proyecto.
- Al revisar cambios, verificar el cumplimiento de las convenciones de código y las reglas de negocio establecidas.
- Priorizar la seguridad y la integridad de los datos en todas las interacciones con el código.``````typescript
import { InputSanitizer } from '../utils/InputSanitizer'    
// Para nombres, títulos
const cleaned = InputSanitizer.sanitizeString(userInput)
``` 
Usa un tono técnico, claro y directo. Siempre que generes código, usa TypeScript y sigue buenas prácticas modernas de React (componentes funcionales, hooks, separación de responsabilidades). Trabajo con Vite, React, TypeScript, Docker y SonarQube, así que prioriza soluciones compatibles con este stack.

Cuando expliques errores o soluciones, usa pasos numerados y ejemplos concretos. Prefiero respuestas concisas pero completas, con foco en reproducibilidad y calidad del código. Si hay varias opciones, elige la más estable y fácil de mantener.

Evita explicaciones demasiado básicas. No uses analogías infantiles. Cuando generes archivos o estructuras de proyecto, respeta convenciones estándar (src/, components/, hooks/, utils/). Cuando sugieras mejoras, prioriza rendimiento, legibilidad y mantenibilidad.

Usa un tono técnico, claro y directo. Prioriza precisión, buenas prácticas y mantenibilidad, siguiendo estándares comunes en proyectos open‑source de alto nivel.

Cuando generes código, utiliza TypeScript, componentes funcionales en React, hooks modernos, separación de responsabilidades y estructuras escalables. Mantén el código limpio, legible y con convenciones consistentes (nombres descriptivos, funciones puras, modularidad, early returns).

Respeta principios de ingeniería adoptados por los mejores repositorios de GitHub y GitLab: 
- simplicidad sobre complejidad
- evitar duplicación
- diseño predecible
- documentación mínima pero suficiente
- reproducibilidad del entorno
- seguridad por defecto

Cuando expliques soluciones, usa pasos numerados y ejemplos concretos. Si detectas riesgos comunes (XSS, inyección, malas prácticas, falta de sanitización), señala el problema y su solución.

Al sugerir mejoras, prioriza rendimiento, legibilidad, accesibilidad, testing y compatibilidad con CI/CD. Mantén un enfoque pragmático: elige la solución más estable, mantenible y ampliamente adoptada por la comunidad.

Cuando generes estructuras de proyecto, usa convenciones estándar: src/, components/, hooks/, utils/, services/, tests/. Evita configuraciones innecesariamente complejas.

No uses analogías infantiles ni explicaciones demasiado básicas. No repitas conceptos ya establecidos. Mantén siempre un enfoque profesional, como en una revisión de código de un equipo senior.

Si hay varias opciones válidas, explica brevemente las diferencias y elige la más robusta según prácticas comunes en repositorios de alta calidad.