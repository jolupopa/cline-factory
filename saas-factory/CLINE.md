# Proyecto: SaaS Factory

## 🎯 Principios de Desarrollo (Context Engineering)

### Filosofía de Diseño
- **KISS**: Keep It Simple, Stupid - Prefiere soluciones simples y directas.
- **YAGNI**: You Aren't Gonna Need It - Implementa solo lo que es estrictamente necesario en el momento.
- **DRY**: Don't Repeat Yourself - Evita la duplicación de código.
- **SOLID**: Principios de Responsabilidad Única, Abierto/Cerrado, Sustitución de Liskov, Segregación de Interfaces, Inversión de Dependencias.

### Descripción del Proyecto
Aplicación SPA SaaS Factory construida con Laravel, Inertia, React, TypeScript, Tailwind CSS v4, Shadcn/ui y PostgreSQL. Incluye autenticación completa con Laravel Fortify.

## 🏗️ Tech Stack & Architecture

### Core Stack
- **Backend Framework**: Laravel 12
- **Frontend Framework**: React (con TypeScript)
- **SPA Adapter**: Inertia.js v2
- **Build Tool**: Vite
- **Base de Datos**: PostgreSQL
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Autenticación**: Laravel Fortify
- **Gestión de Rutas/Menús**: Wayfinder (integrado en el starter kit)
- **Testing Backend**: PHPUnit / Pest
- **Testing Frontend**: Vitest / React Testing Library

### Arquitectura: Híbrida (Backend Laravel MVC + Frontend React Feature-First)

Este proyecto combina la robustez de Laravel en el backend con una arquitectura **Feature-First** en el frontend, optimizada para el desarrollo asistido por IA.

#### Backend (Laravel): Estructura MVC Estándar
```
app/
├── Http/
│   ├── Controllers/        # Controladores para manejar peticiones HTTP
│   ├── Middleware/         # Middleware para lógica de peticiones
│   └── Requests/           # Form Request para validación
├── Models/                 # Modelos Eloquent para interacción con la BD
├── Providers/              # Service Providers
├── Services/               # (Opcional) Lógica de negocio compleja, desacoplada de controladores
└── Repositories/           # (Opcional) Abstracción de la capa de datos
```
- **Principios**: Seguir las convenciones de Laravel. Utilizar Services y/o Repositories para encapsular lógica de negocio y acceso a datos, manteniendo los controladores ligeros.

#### Frontend (React/TypeScript con Inertia): Feature-First
```
resources/js/
├── app.tsx                 # Punto de entrada principal de la aplicación Inertia
├── ssr.tsx                 # Configuración para Server-Side Rendering (si aplica)
│
├── components/             # Componentes React reutilizables y genéricos
│   ├── ui/                 # Componentes de Shadcn/ui (ya configurados)
│   └── [componente-generico].tsx
│
├── hooks/                  # Hooks React reutilizables y genéricos
│   └── [hook-generico].ts(x)
│
├── layouts/                # Layouts principales de la aplicación
│   ├── app-layout.tsx
│   ├── auth-layout.tsx
│   └── [layout-personalizado].tsx
│
├── pages/                  # Páginas de Inertia (vistas principales)
│   ├── auth/               # Páginas de autenticación (login, register, etc.)
│   ├── dashboard.tsx       # Página de ejemplo
│   ├── welcome.tsx         # Página de bienvenida
│   └── [pagina-personalizada].tsx
│
├── features/               # 🎯 NUEVO: Organizadas por funcionalidad (Feature-First)
│   ├── [nombre-feature]/   # Ejemplo: users, products, settings, billing
│   │   ├── components/     # Componentes específicos de la feature
│   │   ├── hooks/          # Hooks específicos de la feature
│   │   ├── services/       # Lógica de llamadas API o negocio de la feature
│   │   ├── types/          # Tipos TypeScript específicos de la feature
│   │   └── store/          # (Opcional) Estado local de la feature (ej. Zustand)
│   │
│   └── ...                 # Otras features
│
├── types/                  # Definiciones de tipos TypeScript globales
│   ├── index.d.ts
│   └── vite-env.d.ts
│
└── lib/                    # Utilidades y configuraciones compartidas (ej. `utils.ts`)
```
- **Principios**: Cada "feature" debe ser lo más autónoma posible. Las `pages` de Inertia deben actuar como orquestadores, utilizando componentes y lógica de las carpetas `components`, `hooks`, `layouts` y `features`.

## 🛠️ Comandos Importantes

### Desarrollo
- `cd saas-factory && php artisan serve` - Iniciar servidor Laravel
- `cd saas-factory && npm run dev` - Iniciar servidor Vite para frontend
- `cd saas-factory && php artisan migrate` - Ejecutar migraciones de base de datos
- `cd saas-factory && php artisan migrate:fresh --seed` - Recrear BD y sembrar datos
- `cd saas-factory && npm install` - Instalar dependencias de Node.js
- `cd saas-factory && composer install` - Instalar dependencias de PHP

### Calidad de Código
- `cd saas-factory && php artisan test` - Ejecutar tests de PHP
- `cd saas-factory && npm test` - Ejecutar tests de React (Vitest)
- `cd saas-factory && npm run lint` - Ejecutar ESLint
- `cd saas-factory && npm run lint:fix` - Corregir automáticamente errores de linting
- `cd saas-factory && npm run typecheck` - Verificación de tipos TypeScript

## 📝 Convenciones de Código

### Nomenclatura
- **PHP/Laravel**:
    - Clases, Traits, Interfaces: `PascalCase` (ej. `UserController`, `UserService`)
    - Métodos, Funciones, Variables: `camelCase` (ej. `getUserData`, `$userName`)
    - Constantes: `UPPER_SNAKE_CASE` (ej. `DEFAULT_STATUS`)
    - Archivos: `PascalCase.php` para clases, `kebab-case.php` para otros (ej. `web.php`)
    - Base de Datos: `snake_case` para tablas y columnas.
- **TypeScript/React**:
    - Componentes React: `PascalCase` (ej. `UserProfileCard`, `Button`)
    - Hooks React: `useCamelCase` (ej. `useAuth`, `useDebounce`)
    - Variables, Funciones: `camelCase` (ej. `userName`, `fetchData`)
    - Tipos, Interfaces: `PascalCase` (ej. `User`, `ProductProps`)
    - Archivos: `kebab-case.ts(x)` para la mayoría, `PascalCase.ts(x)` para componentes/layouts principales (ej. `user-profile-card.tsx`, `AppLayout.tsx`).
    - Carpetas: `kebab-case` (ej. `user-settings`, `components`).

### TypeScript Guidelines
- **Siempre usar type hints** para firmas de funciones y props de componentes.
- **Interfaces** para definir la forma de objetos.
- **Types** para uniones, intersecciones y tipos primitivos.
- **Evitar `any`**; usar `unknown` si es necesario y tipar adecuadamente.

### Componentes React
- Una responsabilidad clara por componente.
- Utilizar props para la comunicación de datos.
- Preferir componentes funcionales con Hooks.

## 🧪 Estrategia de Testing

### Backend (PHPUnit / Pest)
- **Unit Tests**: Para lógica de negocio, servicios, modelos.
- **Feature Tests**: Para controladores, rutas, interacciones con la base de datos.
- **Pest**: Preferido para tests más concisos y legibles.

### Frontend (Vitest / React Testing Library)
- **Unit Tests**: Para componentes aislados, hooks, utilidades.
- **Integration Tests**: Para la interacción entre componentes.
- **React Testing Library**: Para probar el comportamiento del usuario.

## 🔒 Mejores Prácticas de Seguridad

### Validación de Entrada
- Validar todas las entradas de usuario en el backend (Laravel Form Requests) y en el frontend (ej. Zod).
- Sanitizar datos antes de procesarlos.

### Autenticación y Autorización
- Utilizar las funcionalidades de Fortify para la autenticación.
- Implementar control de acceso basado en roles (RBAC) si es necesario.
- Gestión segura de sesiones.

### Protección de Datos
- Nunca registrar datos sensibles.
- Cifrar datos en reposo y en tránsito (HTTPS).

## 🤖 Directrices para Cline AI

### Al Sugerir Código
- Siempre incluir tipos en TypeScript.
- Seguir los principios de `CLINE.md`.
- Implementar manejo de errores robusto.
- Incluir tests relevantes para el código nuevo o modificado.
- Priorizar la reutilización de componentes y hooks existentes.

### Al Revisar Código
- Verificar la adherencia a los principios SOLID y DRY.
- Validar las mejores prácticas de seguridad.
- Sugerir optimizaciones de rendimiento.
- Recomendar mejoras en la estrategia de testing.

### Prioridad de Contexto
1.  **Reglas de `CLINE.md`** (máxima prioridad).
2.  Archivos específicos del proyecto (`package.json`, `composer.json`, etc.).
3.  Estructura de directorios existente.
4.  Mejores prácticas generales de desarrollo.

---

*Este archivo es la fuente de verdad para el desarrollo en este proyecto. Todas las decisiones de código deben alinearse con estos principios.*
