# @wsolutions Packages - Setup Guide

## ✅ Fase 1 Completada (1 de Marzo de 2026)

Se ha creado exitosamente la estructura inicial de ambos paquetes:

```
packages/
├── form-validation/          # Paquete de validación y formateo
│   ├── src/
│   │   ├── types/           # Interfaces y tipos
│   │   ├── validators/      # Validadores (core + domain)
│   │   ├── formatters/      # Formateadores (core + domain)
│   │   └── utils/           # Utilidades
│   ├── tests/               # Tests unitarios
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── vitest.config.ts
│   └── README.md
│
└── form-components/          # Paquete de componentes React
    ├── src/
    │   ├── config/          # Configuración SSoT
    │   ├── hooks/           # Hooks de React
    │   ├── components/      # Componentes UI
    │   └── utils/           # Utilidades
    ├── tests/               # Tests de React
    ├── package.json
    ├── tsconfig.json
    ├── tsup.config.ts
    ├── vitest.config.ts
    └── README.md
```

## 🚀 Próximos Pasos

### 1. Instalar Dependencias

```bash
# Instalar dependencias de ambos paquetes
npm install

# Alternativa con pnpm (más rápido):
# pnpm install

# O si prefieres instalar cada uno por separado:
cd packages/form-validation
npm install

cd ../form-components
npm install
```

### 2. Verificar Configuración

```bash
# Verificar que TypeScript compile correctamente
cd packages/form-validation
npm run type-check

cd ../form-components
npm run type-check
```

### 3. Iniciar Fase 2

Ahora puedes comenzar con la **Fase 2: Implementación de @wsolutions/form-validation**

Ver plan completo en: [docs/PLAN_MODULARIZACION_VALIDACIONES_FORMATEO.md](../docs/PLAN_MODULARIZACION_VALIDACIONES_FORMATEO.md)

## 📝 Notas Importantes

1. **Workspace**: El proyecto ahora usa pnpm workspaces (configurado en `pnpm-workspace.yaml`)
2. **Private Packages**: Ambos paquetes están marcados como `"private": true` por ahora
3. **Interdependencia**: `form-components` depende de `form-validation` mediante `workspace:*`
4. **Build System**: Configurado con `tsup` para builds rápidos y optimizados

## 🎯 Comandos Útiles

```bash
# Desde la raíz del proyecto
npm install               # Instalar todas las dependencias
npm run build             # Build de todos los paquetes
npm test                  # Tests de todos los paquetes
npm run type-check        # Type-check de todos los paquetes

# Desde un paquete específico
cd packages/form-validation
npm run dev               # Watch mode (rebuild automático)
npm run build             # Build del paquete
npm test                  # Tests del paquete
npm run test:watch        # Tests en watch mode

# 💡 Tip: También puedes usar pnpm (más rápido):
# pnpm install, pnpm run build, pnpm test, etc.
```

## 🎉 Estado Actual

✅ Estructura de carpetas creada
✅ Configuración de TypeScript
✅ Configuración de build (tsup)
✅ Configuración de tests (vitest)
✅ README de ambos paquetes
✅ Licencias MIT
✅ .gitignore configurado
✅ Workspace pnpm configurado

## ⏭️ Siguiente: Fase 2 - Implementación

Ver detalles completos en el plan de implementación.
