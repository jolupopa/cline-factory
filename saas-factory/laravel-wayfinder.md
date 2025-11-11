# Laravel Wayfinder

## ⚠️ Nota Importante: Wayfinder es el sistema de rutas oficial para el Frontend

En este proyecto, **Laravel Wayfinder es el paquete exclusivo y preferido para la gestión de rutas en el frontend (React/TypeScript)**.

**Ziggy NO se utiliza** en este stack. Cualquier referencia o archivo relacionado con Ziggy (como `resources/js/types/ziggy.d.ts`) debe ser eliminado y no debe ser introducido en el proyecto.

## ¿Qué es Laravel Wayfinder?
Laravel Wayfinder es un paquete que actúa como un puente de comunicación fuertemente tipado entre tu backend de Laravel y tu frontend de React/TypeScript. Su objetivo principal es eliminar la necesidad de escribir manualmente URLs (caminos) en el código de tu frontend.

## El Problema que Resuelve
Normalmente, para enviar un formulario en React a una ruta de Laravel, escribirías algo como:
```javascript
// En tu componente React
const form = useForm({ /* ... */ });
form.post('/posts/' + post.id + '/edit'); // ¡URL escrita a mano!
```
Si cambias la ruta en Laravel de `/posts/{post}/edit` a `/articulos/{post}/editar`, tienes que buscar y actualizar esa cadena en todos tus componentes de React. Aquí es donde entra Wayfinder.

## ✨ ¿Cómo Funciona Wayfinder con Inertia/React?
Wayfinder simplifica tu código frontend a través de la generación automática de código TypeScript.

### 1. Generación de Código
Cuando ejecutas el comando de Artisan:
```bash
php artisan wayfinder:generate
```
Wayfinder hace dos cosas:
- Inspecciona tus Controladores y Rutas de Laravel.
- Genera automáticamente archivos de TypeScript (o JavaScript con tipado) en tu directorio `resources/js` (por defecto).

Estos archivos generados contienen funciones que representan tus rutas de Laravel. Por ejemplo, si tienes un controlador `PostController` con un método `show`, Wayfinder generará una función `show` en tu frontend.

### 2. Uso en React (con Inertia)
En lugar de construir la URL manualmente, ahora importas y llamas a la función generada por Wayfinder:

**Antes (Ruta Manual)**
```javascript
form.put('/posts/' + post.id, data)
```

**Ahora (Usando Wayfinder)**
```javascript
import { update } from "'actions/App/Http/Controllers/PostController'" // (see below for file content);
form.put(update(post.id), data)
```

**Puntos Clave:**
- **Tipado (TypeScript):** La mayor ventaja es que la función `update()` sabe exactamente qué argumentos espera (ej. el `id` del post). Si intentas llamar a la función sin el argumento, tu IDE o el compilador de TypeScript te alertará inmediatamente, antes de que el código llegue al navegador.
- **Inertia Form Helper:** Wayfinder tiene una integración perfecta con el helper de formularios de Inertia (`useForm`). Simplemente pasas el resultado de la función Wayfinder directamente al método `post`, `put`, o `delete` de Inertia.

**Ejemplo Práctico en tu Componente React:**
```javascript
import React from 'react';
import { useForm } from '@inertiajs/react';
// 1. Importas la función generada por Wayfinder
import { store } from "'actions/App/Http/Controllers/PostController'" // (see below for file content);

export default function CreatePost() {
    const form = useForm({
        title: '',
        content: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // 2. Usas la función 'store()' de Wayfinder
        // Wayfinder resuelve la URL y el método HTTP (POST)
        form.post(store());
    };

    return (
        <form onSubmit={submit}>
            {/* ... campos de formulario ... */}
            <button type="submit" disabled={form.processing}>
                Crear Post
            </button>
        </form>
    );
}
```

### 3. Wayfinder y los Parámetros
Si la ruta de Laravel espera un parámetro, simplemente se lo pasas a la función de Wayfinder:

| Ruta Laravel                                     | Función Wayfinder | Resultado                       |
| :----------------------------------------------- | :---------------- | :------------------------------ |
| `Route::get('/posts/{post}', [PostController::class, 'show']);` | `show(1);`        | `{ url: "/posts/1", method: "get" }` |

Si utilizas Binding por Clave Personalizada (ej. `/posts/{post:slug}`), Wayfinder lo detecta y puedes pasar un objeto: `show({ slug: "mi-post" })`.
