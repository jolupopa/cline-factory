# Principios de Desarrollo Frontend

Cada "feature" debe ser lo más autónoma posible. Las `pages` de Inertia deben actuar como orquestadores, utilizando componentes y lógica de las carpetas `components`, `hooks`, `layouts` y `features`.

## Gestión de Rutas en Frontend: Laravel Wayfinder (Exclusivo)

⚠️ **Nota Importante**: Wayfinder es el paquete oficial para la gestión de rutas en el frontend (React/TypeScript). **Ziggy NO se utiliza**; eliminar cualquier archivo relacionado (ej. `resources/js/types/ziggy.d.ts`).

### ¿Qué es?
Puente fuertemente tipado entre Laravel y React para evitar URLs manuales. Resuelve el problema de mantener sincronizadas rutas backend/frontend.

### Funcionamiento:

1.  **Generación**: Ejecuta `php artisan wayfinder:generate` para inspeccionar controladores/rutas y generar archivos TS/JS en `resources/js` (ej. `actions/App/Http/Controllers/PostController.ts` con funciones como `show(id)`).

2.  **Uso en React/Inertia**:
    *   **Importa**: `import { update } from 'actions/App/Http/Controllers/PostController'`
    *   **Llama**: `form.put(update(post.id), data);` – Tipado automático; integra con `useForm` de Inertia.
    *   **Parámetros**: Pasa argumentos directos (ej. `show(1)`) o objetos para bindings personalizados (ej. `show({ slug: 'mi-post' })`).

### Ejemplo Práctico:

```typescript
import { useForm } from '@inertiajs/react';
import { store } from 'actions/App/Http/Controllers/PostController';

const CreatePost = () => {
    const form = useForm({ title: '', content: '' });
    const submit = (e) => {
        e.preventDefault();
        form.post(store()); // Wayfinder resuelve URL/método
    };
    // ... JSX
};
```

### Mejores Prácticas:
*   Regenera después de cambios en rutas/controladores.
*   Prioriza para formularios y navegación.

## Manejo de Formularios: Componente Form de Inertia con Wayfinder

Usa el componente `Form` de `@inertiajs/react` para formularios robustos y tipados. Integra Wayfinder para rutas.

### Importaciones:

```typescript
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from 'actions/App/Http/Controllers/Settings/ProfileController';
```

### Estructura Básica (ej. `resources/js/pages/settings/profile.tsx`):

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

### Puntos Clave:

*   **Render Prop**: Recibe `{ processing, recentlySuccessful, errors }` para UI dinámica.
*   **Atributo `name`**: Debe coincidir con validaciones backend.
*   **Opciones**: `onSuccess`, `onError` para lógica post-envío; validación frontend con Zod opcional.
*   **Inicialización**: Usa Wayfinder para datos existentes o `useForm` directo.
