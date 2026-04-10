# Activum Academy LMS — Guía del proyecto

## Stack tecnológico

- **Framework:** React 18 + Vite 5
- **Estilos:** Tailwind CSS 3 (sin CSS-in-JS, sin styled-components)
- **Estado:** React `useState` / `useEffect` / `useMemo` (sin Redux ni Zustand)
- **Backend:** Supabase (auth, base de datos PostgreSQL, storage)
- **Editor de texto:** TipTap v3 (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`)
- **Extracción de documentos:** `pdfjs-dist` (PDFs), `mammoth` (Word .docx)
- **Tipado:** JavaScript puro (sin TypeScript)
- **Build:** `npm run dev` / `npm run build` / `npm run preview`
- **Deploy:** Vercel (con serverless function en `api/claude.js`)

---

## Variables de entorno (`.env`)

```
VITE_SUPABASE_URL=https://vdutcihbhcannmuzkzry.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...   ← solo usado en dev (direct browser access)
```

En Vercel también se configura `ANTHROPIC_API_KEY` (sin prefijo VITE) para el proxy serverless `api/claude.js`.

El `.env` está en `.gitignore` — nunca se sube al repo.

---

## Build multi-página

El proyecto tiene **tres entradas** de Vite, generando tres apps independientes:

| URL           | Entry HTML      | Entry JS                  | App                        |
|---------------|-----------------|---------------------------|----------------------------|
| `/`           | `index.html`    | `src/main.jsx`            | LMS (alumnos)              |
| `/admin`      | `admin.html`    | `src/admin/main.jsx`      | Panel de administración    |
| `/u/:userId`  | `profile.html`  | `src/profile/main.jsx`    | Perfil público de usuario  |

Configurado en `vite.config.js` con `rollupOptions.input`. La ruta `/u/:userId` se redirige a `profile.html` mediante un rewrite en `vercel.json`.

---

## Estructura de archivos

```
activum-lms/
├── index.html               ← Entry del LMS
├── admin.html               ← Entry del panel admin
├── profile.html             ← Entry del perfil público
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── vercel.json              ← Rewrites + CSP headers
├── migration.sql            ← SQL generado por migrate.js
│
├── api/
│   └── claude.js            ← Proxy serverless para Claude API (Vercel)
│
├── public/
│   ├── logo.svg             ← Logo oficial — usar siempre desde aquí
│   ├── favicon.svg
│   └── og-image.html        ← Plantilla para Open Graph image
│
└── src/
    ├── main.jsx             # Entry del LMS
    ├── App.jsx              # Raíz: auth, progreso, navegación global
    ├── auth.js              # Auth + perfil + progreso via Supabase
    ├── supabase.js          # Cliente Supabase singleton
    ├── index.css            # Estilos globales + fuentes
    │
    ├── data/
    │   ├── courseData.js        # Contenido "Tokenización Inmobiliaria" (fallback estático)
    │   ├── flexLivingData.js    # Contenido "Flex Living en España" (fallback estático)
    │   ├── catalogData.js       # Catálogo de cursos (fallback estático)
    │   └── courseLoader.js      # Carga cursos/catálogo desde Supabase con fallback
    │
    ├── components/          # LMS (alumnos)
    │   ├── AcademyLanding.jsx   # Home: hero + filtro de etiquetas + catálogo
    │   ├── AuthModal.jsx        # Modal login / registro / recuperar contraseña
    │   ├── CourseLayout.jsx     # Layout del curso: sidebar + contenido
    │   ├── Sidebar.jsx          # Navegación de módulos y lecciones (con bloqueo por módulo)
    │   ├── LessonView.jsx       # Renderiza HTML de una lección + vídeo embed
    │   ├── QuizView.jsx         # Quiz por módulo (una sola vez, sin repetición)
    │   ├── Certificate.jsx      # Certificado al completar el curso
    │   ├── Dashboard.jsx        # Dashboard del alumno (cursos, ranking, perfil, seguridad)
    │   └── ActivumLogo.jsx      # Logo SVG inlinado + texto "Activum / Academy"
    │
    ├── profile/             # Perfil público (app separada)
    │   ├── main.jsx         # Entry del perfil
    │   └── ProfileApp.jsx   # Muestra nombre, bio, empresa, cursos completados con scores
    │
    └── admin/               # Panel de administración (app separada)
        ├── main.jsx         # Entry del admin
        ├── AdminLogin.jsx   # Login con verificación de rol admin
        ├── AdminApp.jsx     # Layout: sidebar beige + topbar + navegación entre páginas
        ├── migrate.js       # Script Node.js: genera migration.sql desde archivos JS
        └── pages/
            ├── Dashboard.jsx    # Resumen: stats, actividad reciente con filtros
            ├── Users.jsx        # Tabla de usuarios, cambio de rol, cursos en progreso
            ├── Courses.jsx      # Lista de cursos, toggle estado/tipo, borrar curso
            ├── CourseEditor.jsx # CRUD: metadatos, módulos, lecciones, quizzes, topics
            ├── LessonEditor.jsx # Editor TipTap (visual/HTML/preview) + URL de vídeo
            ├── Assignments.jsx  # Asignación de cursos a usuarios
            ├── AIGenerator.jsx  # Generador de cursos con Claude API + upload PDF/Word
            └── Settings.jsx     # Pesos de la fórmula del ranking (ranking_course_weight, ranking_quiz_weight)
```

---

## Base de datos Supabase — tablas

| Tabla                | Descripción                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------|
| `profiles`           | `id`, `name`, `empresa`, `role`, `avatar_url`, `bio`                                          |
| `progress`           | `user_id`, `course_id`, `progress` (jsonb: `completedLessons[]`, `completedQuizzes{}`, `quizScores{}`) |
| `courses`            | `id` (slug), `title`, `subtitle`, `description`, `category`, `level`, `duration`, `total_modules`, `total_lessons`, `status`, `type`, `badge`, `topics` (jsonb) |
| `modules`            | `id` (uuid), `course_id`, `title`, `position`                                                 |
| `lessons`            | `id`, `module_id`, `course_id`, `title`, `duration`, `content` (HTML), `position`, `video_url` |
| `quiz_questions`     | `module_id`, `course_id`, `question`, `options` (jsonb), `correct_answer`, `position`        |
| `course_assignments` | `user_id`, `course_id`, `assigned_by`                                                         |
| `settings`           | `key`, `value` — ajustes globales (ej. `ranking_course_weight`, `ranking_quiz_weight`)        |

**Storage:** bucket `avatars` — ruta `{userId}/avatar`

**Función RPC:** `get_my_role()` — SECURITY DEFINER, lee el rol del usuario desde `profiles`. Usada en políticas RLS.

**RLS importante:** la tabla `courses` debe tener `USING (true)` para lectura pública, de lo contrario los usuarios no autenticados solo ven cursos `published` y los `coming_soon` desaparecen en producción.

---

## Roles de usuario

| Rol       | Acceso                                                                                |
|-----------|---------------------------------------------------------------------------------------|
| (ninguno) | Solo cursos `type = 'public'` del catálogo                                            |
| `activum` | Cursos `public` + cursos asignados individualmente + sección Ranking en Dashboard     |
| `admin`   | Catálogo completo + panel de administración en `/admin` + sección Ranking             |

El rol se carga una sola vez al hacer login (`loadUserRole` en `auth.js`) y se persiste en `sessionStorage['userRole']`. El estado `userRole` en `App.jsx` es **independiente** del estado `user` — los eventos de auth (`onAuthStateChange`) nunca sobrescriben el rol.

---

## Flujo de la aplicación (LMS)

1. `AcademyLanding` — hero + filtro de etiquetas scrollable con flechas + catálogo
2. Sin sesión → `AuthModal` (registro / login / recuperar contraseña)
3. Al entrar a un curso → `App` cambia a vista `CourseLayout`
4. `CourseLayout`: `Sidebar` (módulos/lecciones) + área de contenido
5. Cada lección → `LessonView` (renderiza HTML + iframe de vídeo si `video_url` existe)
6. Al terminar las lecciones de un módulo → `QuizView`
7. Al completar todos los módulos y quizzes → `Certificate`
8. Progreso persistido en Supabase (`progress` table)

### Carga de datos del curso

`courseLoader.js` carga desde Supabase con fallback automático a los archivos estáticos:
- `loadCatalog()` → tabla `courses`
- `loadCourse(courseId)` → tablas `courses` + `modules` + `lessons` + `quiz_questions`

El LMS usa `module.id = position` (número entero) para identificar módulos internamente. El UUID del módulo se guarda en `module._uuid`.

### Bloqueo de módulos

Un módulo está bloqueado si el módulo anterior no tiene todas las lecciones completadas Y el quiz completado. Implementado en `Sidebar.jsx` → `isModuleLocked(modIdx)`. El progreso avanza siempre después de completar el quiz (independientemente de la nota).

### Quizzes

- Solo se pueden realizar **una vez** por módulo.
- El resultado se guarda siempre en `progress.quizScores`.
- Tras completar el quiz, el alumno puede avanzar al siguiente módulo.
- No hay nota mínima para avanzar.

---

## Panel de administración (`/admin`)

Acceso solo con rol `admin`. `AdminLogin.jsx` hace dos verificaciones: auth de Supabase + `profiles.role === 'admin'`. Si el rol no es admin, cierra sesión inmediatamente.

### Páginas del admin

- **Dashboard** — stats (usuarios, cursos, progreso) + actividad reciente filtrable por usuario y curso
- **Users** — tabla con avatar, búsqueda, cambio de rol, cursos en progreso, modal de detalle
- **Courses** — lista de cursos, toggle de `status` (`published`/`coming_soon`) y `type` (`public`/`internal`) inline, borrar curso (cascade)
- **CourseEditor** — edición completa: metadatos, módulos (reordenar con flechas, añadir/borrar), lecciones (navega a LessonEditor), quizzes (preguntas + 4 opciones + respuesta correcta), **topics** con editor de chips (Enter/coma para añadir, × para borrar, Backspace elimina el último)
- **LessonEditor** — TipTap con tabs Visual / HTML + panel de Preview. Toolbar: bold, italic, H2, H3, listas, blockquote, HR, snippets. Campo `video_url` con preview live del embed (YouTube/Vimeo)
- **Assignments** — asignar/desasignar cursos a usuarios individuales o masivamente a todos los `activum`
- **AIGenerator** — genera estructura y contenido de cursos con Claude API. Permite adjuntar PDF o Word (.docx) como contexto
- **Settings** — configura los pesos de la fórmula del ranking: `ranking_course_weight` (por defecto 300) y `ranking_quiz_weight` (por defecto 1)

### Claude API

Se usa de dos formas:

**En desarrollo** — llamada directa desde el navegador con `anthropic-dangerous-direct-browser-access`:
```js
fetch('https://api.anthropic.com/v1/messages', {
  headers: {
    'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  },
  body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 8000, messages: [...] })
})
```

**En producción** — proxy serverless en `api/claude.js` que usa `ANTHROPIC_API_KEY` (variable de entorno de Vercel, sin prefijo VITE):
```js
// api/claude.js — handler de Vercel
fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, ... },
  body: JSON.stringify(req.body),
})
```

---

## Gamificación — Sistema de Ranking

Visible en `Dashboard.jsx` (tab "Ranking") para usuarios con rol `activum` o `admin`.

**Fórmula:**
```
Score = cursos_completados × ranking_course_weight + media_quizzes × ranking_quiz_weight
```

Los pesos los configura el admin en **Settings**. Valores por defecto: 300 y 1.

La sección carga todos los perfiles `activum`/`admin` y su progreso desde Supabase, calcula el score de cada uno y muestra un leaderboard ordenado por puntuación. La fila del usuario actual aparece resaltada en burdeos.

---

## Perfiles públicos

Cada usuario tiene un perfil público en `/u/{userId}` (redirigido a `profile.html` por Vercel). Muestra:
- Nombre, empresa, bio, avatar
- Cursos completados (100% de progreso) con nota media de quizzes y fecha de finalización

No requiere autenticación. La tabla `profiles` debe tener RLS de lectura pública.

---

## Migración de datos

Para poblar Supabase con los datos estáticos:

```bash
node src/admin/migrate.js > migration.sql
# Luego ejecutar migration.sql en Supabase SQL Editor
```

El script lee `courseData.js` y `catalogData.js` y genera SQL con `INSERT ... ON CONFLICT DO UPDATE`.

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

| Familia       | Token Tailwind | Uso                              | App                    |
|---------------|----------------|----------------------------------|------------------------|
| Roboto Serif  | `font-display` | Títulos, headings                | LMS + Admin            |
| Roboto        | `font-sans`    | Cuerpo, UI                       | LMS + Admin            |
| Cormorant Garamond | (inline) | Títulos, headings               | Perfil público         |
| DM Sans       | (inline)       | Cuerpo, UI                       | Perfil público         |

El perfil público (`profile.html`) carga sus propias fuentes desde Google Fonts directamente en el HTML.

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

| ID                                    | Estado      | Módulos | Lecciones | Contenido en Supabase       |
|---------------------------------------|-------------|---------|-----------|------------------------------|
| `tokenizacion-inmobiliaria`           | published   | 11      | 52        | Completo                     |
| `flex-living-modelo-negocio`          | coming_soon | —       | —         | Fallback en flexLivingData.js|
| `inteligencia-artificial-real-estate` | coming_soon | 9       | 40        | Solo catálogo                |
| `inversion-inmobiliaria-espana`       | coming_soon | 12      | 58        | Solo catálogo                |
