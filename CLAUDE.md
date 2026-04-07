# Activum Academy LMS — Guía del proyecto

## Stack tecnológico

- **Framework:** React 18 + Vite 5
- **Estilos:** Tailwind CSS 3 (sin CSS-in-JS, sin styled-components)
- **Estado:** React `useState` / `useEffect` / `useMemo` (sin Redux ni Zustand)
- **Backend:** Supabase (auth, base de datos PostgreSQL, storage)
- **Editor de texto:** TipTap v3 (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`)
- **Tipado:** JavaScript puro (sin TypeScript)
- **Build:** `npm run dev` / `npm run build` / `npm run preview`

---

## Variables de entorno (`.env`)

```
VITE_SUPABASE_URL=https://vdutcihbhcannmuzkzry.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

El `.env` está en `.gitignore` — nunca se sube al repo. En Vercel están como environment variables.

---

## Build multi-página

El proyecto tiene **dos entradas** de Vite, lo que genera dos apps independientes:

| URL      | Entry HTML   | Entry JS             | App                     |
|----------|--------------|----------------------|-------------------------|
| `/`      | `index.html` | `src/main.jsx`       | LMS (alumnos)           |
| `/admin` | `admin.html` | `src/admin/main.jsx` | Panel de administración |

Configurado en `vite.config.js` con `rollupOptions.input`.

---

## Estructura de archivos

```
activum-lms/
├── index.html               ← Entry del LMS
├── admin.html               ← Entry del panel admin
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── migration.sql            ← SQL generado por migrate.js (datos del curso)
│
├── public/
│   ├── logo.svg             ← Logo oficial — usar siempre desde aquí
│   └── favicon.svg
│
└── src/
    ├── main.jsx             # Entry del LMS
    ├── App.jsx              # Raíz: auth, progreso, navegación global
    ├── auth.js              # Auth + perfil + progreso via Supabase
    ├── supabase.js          # Cliente Supabase singleton
    ├── index.css            # Estilos globales + fuentes
    │
    ├── data/
    │   ├── courseData.js    # Contenido del curso (fallback estático)
    │   ├── catalogData.js   # Catálogo de cursos (fallback estático)
    │   └── courseLoader.js  # Carga cursos/catálogo desde Supabase con fallback
    │
    ├── components/          # LMS (alumnos)
    │   ├── AcademyLanding.jsx   # Home: hero + filtro de etiquetas + catálogo
    │   ├── AuthModal.jsx        # Modal login / registro / recuperar contraseña
    │   ├── CourseLayout.jsx     # Layout del curso: sidebar + contenido
    │   ├── Sidebar.jsx          # Navegación de módulos y lecciones
    │   ├── LessonView.jsx       # Renderiza HTML de una lección
    │   ├── QuizView.jsx         # Quiz por módulo
    │   ├── Certificate.jsx      # Certificado al completar el curso
    │   ├── Dashboard.jsx        # Dashboard del alumno (mis cursos, perfil, seguridad)
    │   ├── ActivumLogo.jsx      # Logo SVG inlinado + texto "Activum / Academy"
    │   ├── AdminPanel.jsx       # OBSOLETO — pendiente de eliminar
    │   └── LandingPage.jsx      # OBSOLETO — reemplazado por AcademyLanding.jsx
    │
    └── admin/               # Panel de administración (app separada)
        ├── main.jsx         # Entry del admin
        ├── AdminLogin.jsx   # Login con verificación de rol admin
        ├── AdminApp.jsx     # Layout: sidebar beige + topbar + navegación entre páginas
        ├── migrate.js       # Script Node.js: genera migration.sql desde archivos JS
        └── pages/
            ├── Dashboard.jsx    # Resumen: stats, actividad reciente
            ├── Users.jsx        # Tabla de usuarios, cambio de rol
            ├── Courses.jsx      # Lista de cursos, toggle estado/tipo
            ├── CourseEditor.jsx # CRUD: metadatos, módulos, lecciones, quizzes, topics (chips)
            ├── LessonEditor.jsx # Editor TipTap (visual/HTML/preview) + toolbar
            ├── Assignments.jsx  # Asignación de cursos a usuarios
            └── AIGenerator.jsx  # Generador de cursos con Claude API
```

---

## Base de datos Supabase — tablas

| Tabla                | Descripción                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------|
| `profiles`           | `id`, `name`, `empresa`, `role`, `avatar_url`                                                 |
| `progress`           | `user_id`, `course_id`, `completed_lessons[]`, `completed_quizzes{}`, `quiz_scores{}`        |
| `courses`            | `id` (slug), `title`, `subtitle`, `description`, `category`, `level`, `duration`, `total_modules`, `total_lessons`, `status`, `type`, `badge`, `topics` (jsonb) |
| `modules`            | `id` (uuid), `course_id`, `title`, `position`                                                 |
| `lessons`            | `id`, `module_id`, `course_id`, `title`, `duration`, `content` (HTML), `position`            |
| `quiz_questions`     | `module_id`, `course_id`, `question`, `options` (jsonb), `correct_answer`, `position`        |
| `course_assignments` | `user_id`, `course_id`, `assigned_by`                                                         |

**Storage:** bucket `avatars` — ruta `{userId}/avatar`

**Función RPC:** `get_my_role()` — SECURITY DEFINER, lee el rol del usuario desde `profiles`. Usada en políticas RLS.

**RLS importante:** la tabla `courses` debe tener `USING (true)` para lectura pública, de lo contrario los usuarios no autenticados solo ven cursos `published` y los `coming_soon` desaparecen en producción.

---

## Roles de usuario

| Rol       | Acceso                                                            |
|-----------|-------------------------------------------------------------------|
| (ninguno) | Solo cursos `type = 'public'` del catálogo                        |
| `activum` | Cursos `public` + cursos asignados individualmente               |
| `admin`   | Catálogo completo + panel de administración en `/admin`           |

El rol se carga una sola vez al hacer login (`loadUserRole` en `auth.js`) y se persiste en `sessionStorage['userRole']`. El estado `userRole` en `App.jsx` es **independiente** del estado `user` — los eventos de auth (`onAuthStateChange`) nunca sobrescriben el rol.

---

## Flujo de la aplicación (LMS)

1. `AcademyLanding` — hero + filtro de etiquetas scrollable con flechas + catálogo
2. Sin sesión → `AuthModal` (registro / login / recuperar contraseña)
3. Al entrar a un curso → `App` cambia a vista `CourseLayout`
4. `CourseLayout`: `Sidebar` (módulos/lecciones) + área de contenido
5. Cada lección → `LessonView` (renderiza HTML del campo `content`)
6. Al terminar las lecciones de un módulo → `QuizView`
7. Al completar todos los módulos y quizzes → `Certificate`
8. Progreso persistido en Supabase (`progress` table)

### Carga de datos del curso

`courseLoader.js` carga desde Supabase con fallback automático a los archivos estáticos:
- `loadCatalog()` → tabla `courses`
- `loadCourse(courseId)` → tablas `courses` + `modules` + `lessons` + `quiz_questions`

El LMS usa `module.id = position` (número entero) para identificar módulos internamente. El UUID del módulo se guarda en `module._uuid`.

---

## Panel de administración (`/admin`)

Acceso solo con rol `admin`. `AdminLogin.jsx` hace dos verificaciones: auth de Supabase + `profiles.role === 'admin'`. Si el rol no es admin, cierra sesión inmediatamente.

### Páginas del admin

- **Dashboard** — stats (usuarios, cursos, progreso) + actividad reciente
- **Users** — tabla con avatar, búsqueda, cambio de rol, modal de detalle
- **Courses** — lista de cursos, toggle de `status` (`published`/`coming_soon`) y `type` (`public`/`internal`) inline
- **CourseEditor** — edición completa: metadatos, módulos (reordenar con flechas, añadir/borrar), lecciones (navega a LessonEditor), quizzes (preguntas + 4 opciones + respuesta correcta), **topics** con editor de chips (Enter/coma para añadir, × para borrar, Backspace elimina el último)
- **LessonEditor** — TipTap con tabs Visual / HTML + panel de Preview. Toolbar: bold, italic, H2, H3, listas, blockquote, HR, snippets (highlight-box, info-grid), undo/redo
- **Assignments** — asignar/desasignar cursos a usuarios individuales o masivamente a todos los `activum`
- **AIGenerator** — genera estructura y contenido de cursos con Claude API, guarda en Supabase

### Claude API (AIGenerator)

```js
fetch('https://api.anthropic.com/v1/messages', {
  headers: {
    'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
    'content-type': 'application/json',
  },
  body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 8000, messages: [...] })
})
```

---

## Migración de datos

Para poblar Supabase con los datos estáticos:

```bash
node src/admin/migrate.js > migration.sql
# Luego ejecutar migration.sql en Supabase SQL Editor
```

El script lee `courseData.js` y `catalogData.js` y genera SQL con `INSERT ... ON CONFLICT DO UPDATE` para los 4 cursos del catálogo + módulos/lecciones/quizzes de `tokenizacion-inmobiliaria`.

Nota: en `courseData.js` las preguntas usan `q` (no `question`) y `answer` (no `correct`). El script ya lo contempla.

---

## Paleta de colores

| Token Tailwind | Hex       | Uso                                  |
|----------------|-----------|--------------------------------------|
| `act-black`    | `#1E1D16` | Texto principal, fondos oscuros      |
| `act-white`    | `#F7F2EA` | Fondo general (crema)                |
| `act-beige1`   | `#EDE3D8` | Bordes suaves, fondo sidebar admin   |
| `act-beige2`   | `#D9C9B8` | Hover states, fondos secundarios     |
| `act-beige3`   | `#C4B09A` | Texto secundario, iconos             |
| `act-burg`     | `#8C1736` | Acento principal (burdeos)           |
| `act-burg-d`   | `#6E1129` | Hover oscuro del burdeos             |
| `act-burg-l`   | `#A81D42` | Variante clara del burdeos           |

---

## Tipografía

| Familia            | Token Tailwind | Uso                          |
|--------------------|----------------|------------------------------|
| Cormorant Garamond | `font-display` | Títulos, headings, "Activum" |
| DM Sans            | `font-sans`    | Cuerpo, UI, "Academy"        |

---

## Reglas de diseño

- **Fondo siempre claro:** `act-white` (`#F7F2EA`). No usar fondos oscuros en páginas principales.
- **Sin emoticonos en la UI:** solo SVG o iconos vectoriales.
- **Logo:** siempre `/public/logo.svg` o el componente `ActivumLogo.jsx`. No duplicar el SVG salvo en ese componente.
- **Border radius mínimo:** `borderRadius: '2px'` en botones y tarjetas. No usar `rounded-lg`.
- **Sombras:** tokens `shadow-card` y `shadow-card-hover` de `tailwind.config.js`.
- **Admin sidebar:** fondo `#EDE3D8` con texto oscuro, active item con burdeos.

---

## Cursos en el catálogo

| ID                                    | Estado      | Módulos | Lecciones | Contenido en Supabase |
|---------------------------------------|-------------|---------|-----------|----------------------|
| `tokenizacion-inmobiliaria`           | published   | 11      | 52        | Completo             |
| `inteligencia-artificial-real-estate` | coming_soon | 9       | 40        | Solo catálogo        |
| `flex-living-modelo-negocio`          | coming_soon | 10      | 45        | Solo catálogo        |
| `inversion-inmobiliaria-espana`       | coming_soon | 12      | 58        | Solo catálogo        |
