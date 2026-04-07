# Activum Academy — LMS Tokenización Inmobiliaria

Plataforma de aprendizaje online (LMS) de Activum para el curso de **Tokenización de Activos Inmobiliarios en España**.

## Stack Técnico

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- Fuentes: Cormorant Garamond + DM Sans (Google Fonts)
- Progreso persistente via **localStorage**
- Sin dependencias externas de backend

## Contenido del Curso

- 11 módulos temáticos
- 52 lecciones con contenido estructurado
- Quiz de evaluación por módulo (mínimo 70% para superar)
- Seguimiento de progreso en tiempo real
- Certificado de finalización personalizable

## Desarrollo Local

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Despliegue en Vercel

### Opción 1: Desde CLI

```bash
npm install -g vercel
vercel
```

### Opción 2: Desde GitHub (recomendado)

1. Sube este proyecto a un repositorio GitHub
2. Ve a [vercel.com](https://vercel.com) → New Project
3. Importa el repositorio
4. Vercel detecta automáticamente que es un proyecto Vite
5. Haz clic en **Deploy**

No es necesario configurar ninguna variable de entorno ni ajuste adicional.

## Subir a GitHub

```bash
git init
git add .
git commit -m "feat: Activum Academy LMS - Tokenización Inmobiliaria"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/activum-lms.git
git push -u origin main
```

## Personalización

### Colores de marca (tailwind.config.js)
```js
'act-black': '#1E1D16',    // Negro corporativo
'act-white': '#F7F2EA',    // Blanco crema
'act-burgundy': '#8C1736', // Burdeos corporativo
'act-beige': '#E8E0D0',    // Beige
'act-gold': '#C4A96A',     // Dorado
```

### Añadir o editar contenido
Todo el contenido del curso está en `src/data/courseData.js`:
- Edita el HTML de cada lección en el campo `content`
- Añade preguntas de quiz en el array `questions`
- Añade nuevas lecciones al array `lessons` de cada módulo

### Añadir el logo oficial
Reemplaza el componente SVG en `src/components/ActivumLogo.jsx` con el logo oficial en formato SVG.

## Estructura del Proyecto

```
src/
├── App.jsx                  # Lógica principal + gestión de estado
├── main.jsx                 # Entry point
├── index.css                # Estilos globales + Tailwind + prose
├── data/
│   └── courseData.js        # TODO el contenido del curso
└── components/
    ├── ActivumLogo.jsx      # Logo SVG de Activum
    ├── LandingPage.jsx      # Página de inicio del curso
    ├── CourseLayout.jsx     # Layout principal del LMS
    ├── Sidebar.jsx          # Panel de navegación lateral
    ├── LessonView.jsx       # Vista de lección
    ├── QuizView.jsx         # Vista de quiz con corrección
    └── Certificate.jsx      # Generador de certificado
```

---

© 2025 Activum · Todos los derechos reservados
