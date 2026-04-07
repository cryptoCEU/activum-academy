# Activum Academy LMS — Guía del proyecto

## Stack tecnológico

- **Framework:** React 18 + Vite 5
- **Estilos:** Tailwind CSS 3 (sin CSS-in-JS, sin styled-components)
- **Estado:** React `useState` / `useEffect` (sin Redux ni Zustand)
- **Persistencia:** `localStorage` (sin backend — demo/prototipo)
- **Tipado:** JavaScript puro (sin TypeScript)
- **Build:** `npm run dev` / `npm run build` / `npm run preview`

---

## Estructura de archivos

```
activum-lms/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
│
├── public/
│   ├── logo.svg          ← logo oficial (usar siempre desde aquí)
│   └── favicon.svg
│
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Raíz: gestiona user, progress y navegación global
    ├── auth.js               # Auth mock + progreso via localStorage
    ├── index.css             # Estilos globales + import de fuentes
    │
    ├── data/
    │   ├── courseData.js     # Contenido completo del curso activo (módulos + lecciones en HTML)
    │   └── catalogData.js    # Catálogo de cursos (publicados y próximamente)
    │
    └── components/
        ├── AcademyLanding.jsx  # Home: hero + catálogo
        ├── AuthModal.jsx       # Modal login / registro
        ├── CourseLayout.jsx    # Layout del curso: sidebar + área de contenido
        ├── Sidebar.jsx         # Navegación lateral de módulos y lecciones
        ├── LessonView.jsx      # Renderiza el HTML de una lección
        ├── QuizView.jsx        # Quiz por módulo (al finalizar las lecciones del módulo)
        ├── Certificate.jsx     # Certificado al completar el curso
        └── ActivumLogo.jsx     # Logo SVG inlinado + texto (Activum / Academy)
```

---

## Flujo de la aplicación

1. El usuario llega a `AcademyLanding` — ve el catálogo de cursos.
2. Si intenta entrar sin sesión → se abre `AuthModal` (registro o login).
3. Los datos de usuario se guardan en `localStorage` (contraseñas en texto plano — solo demo).
4. Al entrar a un curso → `App` cambia a vista `CourseLayout`.
5. `CourseLayout` muestra `Sidebar` (módulos/lecciones) + área de contenido.
6. Cada lección se muestra en `LessonView` (HTML embebido en `courseData.js`).
7. Al terminar las lecciones de un módulo → `QuizView` con preguntas del módulo.
8. Al completar todos los módulos y quizzes → `Certificate`.
9. El progreso se persiste por `userId + courseId` en `localStorage`.

---

## Paleta de colores

Definida en `tailwind.config.js` y usable como clases Tailwind:

| Token Tailwind   | Hex       | Uso principal                        |
|------------------|-----------|--------------------------------------|
| `act-black`      | `#1E1D16` | Texto principal, fondos oscuros      |
| `act-white`      | `#F7F2EA` | Fondo general de la app (crema)      |
| `act-beige1`     | `#EDE3D8` | Bordes, separadores suaves           |
| `act-beige2`     | `#D9C9B8` | Hover states, fondos secundarios     |
| `act-beige3`     | `#C4B09A` | Texto secundario, iconos suaves      |
| `act-burg`       | `#8C1736` | Burdeos — color de acento principal  |
| `act-burg-d`     | `#6E1129` | Hover oscuro del burdeos             |
| `act-burg-l`     | `#A81D42` | Variante clara del burdeos           |

---

## Tipografía

| Familia               | Token Tailwind   | Uso                                    |
|-----------------------|------------------|----------------------------------------|
| Cormorant Garamond    | `font-display`   | Títulos, headings, el nombre "Activum" |
| DM Sans               | `font-sans`      | Cuerpo de texto, UI, el subtítulo "Academy" |

Las fuentes se cargan desde Google Fonts en `index.html` o `index.css`.

---

## Reglas de diseño

- **Fondo siempre claro:** el fondo base de la app es siempre `act-white` (`#F7F2EA`). No usar fondos oscuros en páginas principales.
- **Sin emoticonos en la UI:** no usar emojis como elementos de interfaz. Usar únicamente SVG o iconos vectoriales.
- **Logo:** cargar siempre desde `/public/logo.svg` o usar el componente `ActivumLogo.jsx`. No duplicar el SVG inline salvo en ese componente.
- **Border radius mínimo:** los botones y tarjetas usan `border-radius: 2px` (casi cuadrado). No usar `rounded-lg` ni radios grandes.
- **Sombras:** usar los tokens `shadow-card` y `shadow-card-hover` definidos en `tailwind.config.js`.
- **Transiciones:** preferir `transition-colors` para hovers, duración corta.

---

## Cursos disponibles

| ID                              | Estado        | Módulos | Lecciones |
|---------------------------------|---------------|---------|-----------|
| `tokenizacion-inmobiliaria`     | Publicado     | 11      | 52        |
| `inteligencia-artificial-real-estate` | Próximo | 9       | 40        |
| `flex-living-modelo-negocio`    | Próximo       | 10      | 45        |
| `inversion-inmobiliaria-espana` | Próximo       | 12      | 58        |

---

## Cómo añadir un nuevo curso

### 1. Registrar el curso en el catálogo

Abrir `src/data/catalogData.js` y añadir una entrada al array `catalogData`:

```js
{
  id: 'mi-nuevo-curso',                  // slug único
  title: 'Título del curso',
  subtitle: 'Subtítulo descriptivo',
  description: 'Descripción corta para la tarjeta del catálogo.',
  category: 'PropTech',                  // o 'Real Estate', 'Inversion', etc.
  level: 'Intermedio',
  duration: '6 horas',
  modules: 8,
  lessons: 35,
  status: 'published',                   // 'published' | 'coming_soon'
  badge: 'Nuevo',                        // texto de la etiqueta (o null)
  topics: ['Tema 1', 'Tema 2', 'Tema 3'],
}
```

### 2. Crear el archivo de datos del curso

Crear `src/data/miNuevoCursoData.js` siguiendo exactamente la misma estructura que `courseData.js`:

```js
export const miNuevoCursoData = {
  title: "Título del curso",
  subtitle: "Subtítulo",
  duration: "6 horas",
  lessons: 35,
  modules: [
    {
      id: 0,
      title: "Nombre del módulo",
      emoji: "🎯",           // solo en datos internos, no en UI
      color: "#C4A96A",
      lessons: [
        {
          id: "0-1",
          title: "Nombre de la lección",
          duration: "10 min",
          content: `<h2>...</h2><p>...</p>` // HTML del contenido
        },
        // más lecciones...
      ],
      quiz: {
        questions: [
          {
            question: "Pregunta del quiz",
            options: ["Opción A", "Opción B", "Opción C", "Opción D"],
            correct: 0  // índice de la respuesta correcta
          },
          // más preguntas...
        ]
      }
    },
    // más módulos...
  ]
}
```

### 3. Importar y conectar en App.jsx

En `src/App.jsx`:

```js
// Importar el nuevo dato
import { miNuevoCursoData } from './data/miNuevoCursoData'

// Añadir al mapa de cursos (si se generaliza el sistema multi-curso):
const courseMap = {
  'tokenizacion-inmobiliaria': courseData,
  'mi-nuevo-curso': miNuevoCursoData,
}

// Usar courseMap[activeCourse] en lugar de courseData directamente
```

> Nota: actualmente `App.jsx` está hardcodeado para un solo curso (`tokenizacion-inmobiliaria`). Al añadir el segundo curso publicado habrá que refactorizar `App.jsx` para que el estado de progreso y la lógica de navegación sean dinámicos por `courseId`.

---

## Auth (sistema mock)

- Los usuarios se guardan en `localStorage['activum_users']` como objeto `{ [email]: { ...user, password } }`.
- Las contraseñas se guardan en texto plano — **solo válido para demo**. En producción conectar a Supabase u otro backend.
- La sesión activa se guarda en `localStorage['activum_session']`.
- El progreso se guarda en `localStorage['activum_progress_{userId}_{courseId}']`.
- Las funciones de auth están en `src/auth.js`: `register`, `login`, `logout`, `getSession`, `loadProgress`, `saveProgress`.
