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
- **Gestión de Rutas/Menús**: Wayfinder (integrado en el starter kit; **exclusivo para frontend** – Ziggy NO se utiliza)
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
- **Principios**: Cada "feature" debe ser lo más autónoma posible. Las `pages` de Inertia deben actuar como orquestadores, utilizando componentes y lógica de las carpetas `components`, `hooks`, `layouts` y `features`. **Gestión de Rutas**: Usar **Laravel Wayfinder** exclusivamente para rutas tipadas en frontend (ver sección dedicada abajo). Eliminar cualquier referencia a Ziggy.

### Gestión de Rutas en Frontend: Laravel Wayfinder (Exclusivo)
**⚠️ Nota Importante**: Wayfinder es el paquete oficial para la gestión de rutas en el frontend (React/TypeScript). **Ziggy NO se utiliza**; eliminar cualquier archivo relacionado (`ej. resources/js/types/ziggy.d.ts`).
**¿Qué es?**: Puente fuertemente tipado entre Laravel y React para evitar URLs manuales. Resuelve el problema de mantener sincronizadas rutas backend/frontend.
Funcionamiento:

Generación: Ejecuta php artisan wayfinder:generate para inspeccionar controladores/rutas y generar archivos TS/JS en resources/js (ej. actions/App/Http/Controllers/PostController.ts con funciones como show(id)).
Uso en React/Inertia:
Importa: import { update } from '@/actions/App/Http/Controllers/PostController';
Llama: form.put(update(post.id), data); – Tipado automático; integra con useForm de Inertia.
Parámetros: Pasa args directos (ej. show(1)) o objetos para bindings personalizados (ej. show({ slug: 'mi-post' })).


Ejemplo Práctico:

