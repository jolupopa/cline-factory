# Proyecto: SaaS Factory

## 🎯 Principios de Desarrollo (Context Engineering)

### Filosofía de Diseño

*   **KISS**: Keep It Simple, Stupid - Prefiere soluciones simples y directas.
*   **YAGNI**: You Aren't Gonna Need It - Implementa solo lo que es estrictamente necesario en el momento.
*   **DRY**: Don't Repeat Yourself - Evita la duplicación de código.
*   **SOLID**: Principios de Responsabilidad Única, Abierto/Cerrado, Sustitución de Liskov, Segregación de Interfaces, Inversión de Dependencias.

### Descripción del Proyecto

Aplicación SPA SaaS Factory construida con Laravel, Inertia, React, TypeScript, Tailwind CSS v4, Shadcn/ui y PostgreSQL. Incluye autenticación completa con Laravel Fortify.

## 🏗️ Tech Stack & Architecture

### Core Stack

*   **Backend Framework**: Laravel 12
*   **Frontend Framework**: React (con TypeScript)
*   **SPA Adapter**: Inertia.js v2
*   **Build Tool**: Vite
*   **Base de Datos**: PostgreSQL
*   **Styling**: Tailwind CSS v4
*   **UI Components**: Shadcn/ui
*   **Autenticación**: Laravel Fortify
*   **Gestión de Rutas/Menús**: Wayfinder (integrado en el starter kit; exclusivo para frontend – Ziggy NO se utiliza)
*   **Testing Backend**: PHPUnit / Pest
*   **Testing Frontend**: Vitest / React Testing Library

### Arquitectura: Híbrida (Backend Laravel MVC + Frontend React Feature-First)

Este proyecto combina la robustez de Laravel en el backend con una arquitectura Feature-First en el frontend, optimizada para el desarrollo asistido por IA.

### Backend (Laravel): Estructura MVC Estándar

```text
app/
├── Http/
│   ├── Controllers/        # Controladores para manejar peticiones HTTP
│   ├── Middleware/         # Middleware para lógica de peticiones
│   ├── Requests/           # Form Request para validación
│   └── Resources/          # 🎯 NUEVO: API Resources para transformación de respuestas JSON (Eloquent)
├── Models/                 # Modelos Eloquent para interacción con la BD
├── Providers/              # Service Providers
├── Services/               # (Opcional) Lógica de negocio compleja, desacoplada de controladores
└── Repositories/           # (Opcional) Abstracción de la capa de datos
```

**Principios**: Seguir las convenciones de Laravel. Utilizar Services y/o Repositories para encapsular lógica de negocio y acceso a datos, manteniendo los controladores ligeros.

#### NUEVO: Uso de Eloquent API Resources

Cuando se obtengan datos desde un modelo, crear e implementar un API Resource correspondiente para estandarizar y transformar las respuestas JSON desde el controlador. Esto se recomienda para controlar qué datos se envían al cliente, cómo se formatean, y mantener una estructura consistente, especialmente con modelos y relaciones.

**Beneficios**:

*   **Estandarizar respuestas**: Asegura estructura JSON uniforme (individual o colección), evitando inconsistencias en clientes (ej. React via Inertia).
*   **Transformar datos**: Formatea/renombra campos, incluye datos calculados sin sobrecargar controladores.
*   **Manejar relaciones**: Transforma relaciones complejas de forma limpia (ej. usuario con posts asociados).
*   **Incluir metadatos**: Añade enlaces o info extra (ej. paginación).
*   **Separar lógica**: Capa de presentación entre modelos y respuestas, manteniendo controladores/modelos limpios.

**Implementación**:

*   **Crear Resource**: `php artisan make:resource UserResource` (en `app/Http/Resources`).
*   **Definir Transformación**:
    ```php
    // app/Http/Resources/UserResource.php
    <?php
    namespace App\Http\Resources;
    use Illuminate\Http\Request;
    use Illuminate\Http\Resources\Json\JsonResource;

    class UserResource extends JsonResource
    {
        public function toArray(Request $request): array
        {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'posts' => PostResource::collection($this->whenLoaded('posts')), // Relación cargada
                'created_at' => $this->created_at->format('Y-m-d'),
            ];
        }
    }
    ```
*   **Usar en Controlador**:
    ```php
    // app/Http/Controllers/UserController.php
    use App\Http\Resources\UserResource;

    public function index()
    {
        $users = User::with('posts')->paginate(10);
        return UserResource::collection($users); // O UserResource::make($user) para individual
    }
    ```
*   **Para Colecciones**: Usa `UserResource::collection($users)` o `new UserResourceCollection($users)` si necesitas metadatos adicionales.
*   **Condicionales**: Usa `whenLoaded()`, `when()` para incluir datos opcionales.

**Mejores Prácticas**:

*   Un Resource por modelo principal.
*   Mantén Resources livianos; mueve lógica compleja a Services.
*   Integra con Inertia: Retorna Resources en props para tipado en frontend.
*   Regenera Wayfinder post-cambios en controladores que usen Resources.

### Frontend (React/TypeScript con Inertia): Feature-First

```text
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

**Principios**: Cada "feature" debe ser lo más autónoma posible. Las pages de Inertia deben actuar como orquestadores, utilizando componentes y lógica de las carpetas `components`, `hooks`, `layouts` y `features`. Gestión de Rutas: Usar Laravel Wayfinder exclusivamente para rutas tipadas en frontend (ver sección dedicada abajo). Eliminar cualquier referencia a Ziggy.

**Diseño Responsivo**: Todas las vistas y componentes deben ser responsivos para mobile, tablet y desktop, utilizando las utilidades de Tailwind CSS (ej. breakpoints como sm:, md:, lg:). Priorizar mobile-first y probar en diferentes tamaños de pantalla.

### Gestión de Rutas en Frontend: Laravel Wayfinder (Exclusivo)

⚠️ **Nota Importante**: Wayfinder es el paquete oficial para la gestión de rutas en el frontend (React/TypeScript). Ziggy NO se utiliza; eliminar cualquier archivo relacionado (ej. `resources/js/types/ziggy.d.ts`).

**¿Qué es?**: Puente fuertemente tipado entre Laravel y React para evitar URLs manuales. Resuelve el problema de mantener sincronizadas rutas backend/frontend.

**Funcionamiento**:

*   **Generación**: Ejecuta `php artisan wayfinder:generate` para inspeccionar controladores/rutas y generar archivos TS/JS en `resources/js` (ej. `actions/App/Http/Controllers/PostController.ts` con funciones como `show(id)`).
*   **Uso en React/Inertia**:
    *   **Importa**: `import { update } from '@/actions/App/Http/Controllers/PostController';`
    *   **Llama**: `form.put(update(post.id), data);` – Tipado automático; integra con `useForm` de Inertia.
    *   **Parámetros**: Pasa args directos (ej. `show(1)`) o objetos para bindings personalizados (ej. `show({ slug: 'mi-post' })`).

**Ejemplo Práctico**:

```typescript
import { useForm } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/PostController';

const CreatePost = () => {
    const form = useForm({ title: '', content: '' });
    const submit = (e) => {
        e.preventDefault();
        form.post(store()); // Wayfinder resuelve URL/método
    };
    // ... JSX
};
```

**Mejores Prácticas**: Regenera después de cambios en rutas/controladores. Prioriza para formularios y navegación.

### Manejo de Formularios: Componente Form de Inertia con Wayfinder

Usa el componente `Form` de `@inertiajs/react` para formularios robustos y tipados. Integra Wayfinder para rutas.

**Importaciones**:

```typescript
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
```

**Estructura Básica (ej. `resources/js/pages/settings/profile.tsx`)**:

```typescript
<Form
    {...ProfileController.update.form()} // Integra Wayfinder: URL/método/datos iniciales
    options={{ preserveScroll: true }}
    className="space-y-6"
>
    {({ processing, recentlySuccessful, errors }) => (
        <>
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    defaultValue={auth.user.name}
                    name="name" // Coincide con Form Request de Laravel
                    required
                />
                <InputError message={errors.name} />
            </div>
            {/* ... otros campos */}
            <div className="flex items-center gap-4">
                <Button disabled={processing}>Save</Button>
                <Transition show={recentlySuccessful}>
                    <p>Saved</p>
                </Transition>
            </div>
        </>
    )}
</Form>
```

**Puntos Clave**:

*   **Render Prop**: Recibe `{ processing, recentlySuccessful, errors }` para UI dinámica.
*   **Atributo `name`**: Debe coincidir con validaciones backend.
*   **Opciones**: `onSuccess`, `onError` para lógica post-envío; validación frontend con Zod opcional.
*   **Inicialización**: Usa Wayfinder para datos existentes o `useForm` directo.

## 🛠️ Comandos Importantes

### Desarrollo

*   `cd saas-factory && php artisan serve` - Iniciar servidor Laravel
*   `cd saas-factory && npm run dev` - Iniciar servidor Vite para frontend
*   `cd saas-factory && php artisan migrate` - Ejecutar migraciones de base de datos
*   `cd saas-factory && php artisan migrate:fresh --seed` - Recrear BD y sembrar datos
*   `cd saas-factory && npm install` - Instalar dependencias de Node.js
*   `cd saas-factory && composer install` - Instalar dependencias de PHP
*   `cd saas-factory && php artisan wayfinder:generate` - **NUEVO**: Generar rutas tipadas con Wayfinder
*   `cd saas-factory && php artisan make:resource UserResource` - **NUEVO**: Crear API Resource para un modelo (reemplaza User con el modelo correspondiente)

### Calidad de Código

*   `cd saas-factory && php artisan test` - Ejecutar tests de PHP
*   `cd saas-factory && npm test` - Ejecutar tests de React (Vitest)
*   `cd saas-factory && npm run lint` - Ejecutar ESLint
*   `cd saas-factory && npm run lint:fix` - Corregir automáticamente errores de linting
*   `cd saas-factory && npm run typecheck` - Verificación de tipos TypeScript

## 📝 Convenciones de Código

### Nomenclatura

*   **PHP/Laravel**:
    *   Clases, Traits, Interfaces: `PascalCase` (ej. `UserController`, `UserService`)
    *   Métodos, Funciones, Variables: `camelCase` (ej. `getUserData`, `$userName`)
    *   Constantes: `UPPER_SNAKE_CASE` (ej. `DEFAULT_STATUS`)
    *   Archivos: `PascalCase.php` para clases, `kebab-case.php` para otros (ej. `web.php`)
    *   Base de Datos: `snake_case` para tablas y columnas.

*   **TypeScript/React**:
    *   Componentes React: `PascalCase` (ej. `UserProfileCard`, `Button`)
    *   Hooks React: `useCamelCase` (ej. `useAuth`, `useDebounce`)
    *   Variables, Funciones: `camelCase` (ej. `userName`, `fetchData`)
    *   Tipos, Interfaces: `PascalCase` (ej. `User`, `ProductProps`)
    *   Archivos: `kebab-case.ts(x)` para la mayoría, `PascalCase.ts(x)` para componentes/layouts principales (ej. `user-profile-card.tsx`, `AppLayout.tsx`).
    *   Carpetas: `kebab-case` (ej. `user-settings`, `components`).

### TypeScript Guidelines

*   Siempre usar `type hints` para firmas de funciones y props de componentes.
*   `Interfaces` para definir la forma de objetos.
*   `Types` para uniones, intersecciones y tipos primitivos.
*   Evitar `any`; usar `unknown` si es necesario y tipar adecuadamente.
*   Rutas Wayfinder: Importar y usar funciones generadas con tipado estricto (ej. `update(id: number)`).

### Componentes React

*   Una responsabilidad clara por componente.
*   Utilizar `props` para la comunicación de datos.
*   Preferir componentes funcionales con Hooks.
*   **Formularios**: Usar `Form` de Inertia con Wayfinder para tipado y manejo automático de estado/errores.
*   **Responsividad**: Aplicar clases Tailwind responsivas en todos los componentes (ej. `flex flex-col md:flex-row`); asegurar accesibilidad y fluidez en mobile (≤640px), tablet (641px-1024px) y desktop (≥1025px).

## 🧪 Estrategia de Testing

### Backend (PHPUnit / Pest)

*   **Unit Tests**: Para lógica de negocio, servicios, modelos.
*   **Feature Tests**: Para controladores, rutas, interacciones con la base de datos.
*   **Pest**: Preferido para tests más concisos y legibles.
*   **Tests para API Resources**: Verificar transformaciones JSON con assertions en respuestas (ej. `->assertJsonStructure()`).

### Frontend (Vitest / React Testing Library)

*   **Unit Tests**: Para componentes aislados, hooks, utilidades (incluyendo hooks de Wayfinder).
*   **Integration Tests**: Para la interacción entre componentes y formularios Inertia.
*   **React Testing Library**: Para probar el comportamiento del usuario.
*   **Tests de Responsividad**: Usar herramientas como `@testing-library/jest-dom` o emuladores para verificar renderizado en breakpoints (ej. con `window.matchMedia` mocks).

## 🔒 Mejores Prácticas de Seguridad

### Validación de Entrada

*   Validar todas las entradas de usuario en el backend (Laravel Form Requests) y en el frontend (ej. Zod).
*   Sanitizar datos antes de procesarlos.

### Autenticación y Autorización

*   Utilizar las funcionalidades de Fortify para la autenticación.
*   Implementar control de acceso basado en roles (RBAC) si es necesario.
*   Gestión segura de sesiones.

### Protección de Datos

*   Nunca registrar datos sensibles.
*   Cifrar datos en reposo y en tránsito (HTTPS).
*   En API Resources, excluir campos sensibles (ej. `password`) usando condicionales o traits.

## 🤖 Directrices para Cline AI

### Al Sugerir Código

*   Siempre incluir tipos en TypeScript.
*   Seguir los principios de `CLINE.md`.
*   Implementar manejo de errores robusto.
*   Incluir tests relevantes para el código nuevo o modificado.
*   Priorizar la reutilización de componentes y hooks existentes.
*   Usar Wayfinder para todas las rutas en frontend; integrar `Form` de Inertia para formularios.
*   Siempre que se termine una feature, crear sus tests de prueba correspondientes y solo continuar con la siguiente una vez que estos pasen.
*   Al obtener datos de modelos, sugerir/crear API Resource correspondiente; usarlo en controladores para respuestas JSON.
*   Asegurar que todos los componentes/vistas incluyan diseño responsivo con Tailwind; sugerir pruebas en múltiples dispositivos.

### Al Revisar Código

*   Verificar la adherencia a los principios SOLID y DRY.
*   Validar las mejores prácticas de seguridad.
*   Sugerir optimizaciones de rendimiento.
*   Recomendar mejoras en la estrategia de testing.
*   Asegurar eliminación de Ziggy; validar tipado en Wayfinder y sincronía con backend.
*   Verificar uso de API Resources en endpoints que retornan modelos; asegurar exclusión de datos sensibles.
*   Revisar responsividad en componentes: confirmar uso de breakpoints Tailwind y sugerir fixes si no cubre mobile/tablet/desktop.

### Prioridad de Contexto

*   Reglas de `CLINE.md` (máxima prioridad).
*   Archivos específicos del proyecto (`package.json`, `composer.json`, etc.).
*   Estructura de directorios existente.
*   Mejores prácticas generales de desarrollo.

Este archivo es la fuente de verdad para el desarrollo en este proyecto. Todas las decisiones de código deben alinearse con estos principios.
