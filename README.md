# MedicHands Web — Plataforma de Divulgación Científica

> **Portal oficial de difusión e información preventiva del proyecto MedicHands**  
> Desarrollado en la Facultad de Ingeniería Mecánica y Eléctrica (FIME), **Universidad de Colima (UCol)**.

---

## 1. Descripción del Proyecto

**MedicHands Web** es una plataforma editorial y de divulgación enfocada en la democratización del triaje preventivo de anomalías térmicas mamarias. Su propósito es comunicar los avances de investigación en Internet de las Cosas Médicas (IoMT), el kit ergonómico de copas 3D en poliuretano termoplástico (TPU 95A), la instrumentación con 16 sensores de grado clínico (Maxim Integrated MAX30205) y el algoritmo de asimetría térmica intermamaria ($\Delta T > 0.8^\circ\text{C}$).

---

## 2. Stack Tecnológico Oficial

- **Frontend & SSG:** [Astro v5](https://astro.build/) (Static Site Generation de alto rendimiento).
- **Componentes Interactivos:** [React v19](https://react.dev/) hidratados bajo demanda (`client:load`, `client:only="react"`).
- **Estilos:** [TailwindCSS v3](https://tailwindcss.com/) con paleta oficial de MedicHands y plugin `@tailwindcss/typography`.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) estricto.
- **Backend as a Service:** [Supabase](https://supabase.com/) (PostgreSQL 15+, Supabase Auth, Supabase Storage, Row Level Security).
- **Hosting y Despliegue:** [Vercel](https://vercel.com/) (Arquitectura serverless / static).

---

## 3. Estructura del Repositorio

```text
medichands-web/
├── public/                 # Recursos estáticos públicos (logo.ico, favicon.svg)
├── src/
│   ├── components/
│   │   ├── admin/          # Consola CDC: AdminAuthGuard.tsx, AdminDashboard.tsx
│   │   ├── common/         # Componentes transversales: Header.astro, Footer.astro, ShareModal.tsx
│   │   ├── home/           # Vistas principales: FeaturedHero.astro, PostFeed.tsx, Sidebar.astro
│   │   └── post/           # Vistas de artículo: LikeButton.tsx, PostActions.tsx, FacebookComments.astro
│   ├── data/               # mockPosts.ts (mecanismo de respaldo resiliente)
│   ├── layouts/            # BaseLayout.astro (SEO, Open Graph, fuentes y meta tags)
│   ├── lib/                # authors.ts (lista blanca y autoría), supabase.ts (cliente y métodos CRUD/RPC)
│   ├── pages/              # Rutas Astro: index.astro, quienes-somos.astro, mh-admin-cdc-control.astro, post/[slug].astro
│   ├── styles/             # global.css (tokens y tema Tailwind)
│   └── types/              # Definiciones TypeScript (Post, PostFilter)
├── supabase/
│   └── schema.sql          # DDL completo de PostgreSQL, RLS, Storage y RPC
├── .env.example            # Plantilla de variables de entorno
├── desarrollo_web.md       # Bitácora técnica viva del desarrollo
├── astro.config.mjs        # Configuración de integraciones de Astro
├── tailwind.config.mjs     # Configuración de diseño y paleta cromática
└── tsconfig.json           # Configuración de compilador TypeScript
```

---

## 4. Requisitos e Instalación Local

### Requisitos Previos
- **Node.js:** Versión 18.x o superior (Node 20+ recomendado).
- **npm:** Versión 9.x o superior.

### Instalación
```bash
# Navegar al directorio del frontend
cd medichands-web

# Instalar dependencias
npm install
```

---

## 5. Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y configura tus claves de Supabase:

```bash
cp .env.example .env.local
```

Contenido requerido en `.env.local`:
```ini
# URL de la API del proyecto Supabase
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co

# Clave pública anónima de Supabase (anon/public)
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> **Nota de Seguridad:** Nunca agregues claves de servicio (`service_role`) ni contraseñas a este archivo. Las variables con prefijo `PUBLIC_` son expuestas al cliente por Astro/Vite.

---

## 6. Comandos de Desarrollo y Compilación

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local en `http://localhost:4321`. |
| `npx tsc --noEmit` | Ejecuta la comprobación estática de tipos de TypeScript sin generar archivos. |
| `npm run build` | Compila el sitio para producción en modo estático en el directorio `dist/`. |
| `npm run preview` | Previsualiza localmente el build de producción generado. |

---

## 7. Integración con Supabase

### Inicialización de Base de Datos
El archivo [supabase/schema.sql](supabase/schema.sql) contiene las definiciones requeridas:
1. **Tabla `public.posts`:** Artículos, extractos, slugs únicos, autoría, categorías, tiempo de lectura y conteo de likes.
2. **Tabla `public.post_likes`:** Registro de huellas anónimas de visitantes por publicación para evitar duplicados.
3. **Función RPC `public.increment_like(target_post_id, visitor_hash)`:** Incremento atómico transaccional (ACID).
4. **Bucket de Almacenamiento `covers`:** Para imágenes de portada públicas.
5. **Row Level Security (RLS):**
   - Lectura pública de artículos publicados (`is_published = true`).
   - Operaciones privilegiadas (Insert/Update/Delete) restringidas estrictamente a los 3 correos oficiales mediante la función SQL `public.is_admin_user()`:
     - `yerayanguiano@gmail.com`
     - `citlallisarar@gmail.com`
     - `efrainarias@gmail.com`

---

## 8. Consola Administrativa CDC

- **Ruta de acceso:** `/mh-admin-cdc-control`
- **Mecanismo:** La ruta es discreta y no se muestra en el menú de navegación general.
- **Funcionalidades:**
  - Autenticación segura mediante Supabase Auth.
  - Creación, edición y eliminación de artículos.
  - Selección de visibilidad: **Publicado** o **Borrador**.
  - Modalidad de autoría dinámica: **Individual** (nombre oficial del admin) o **Grupal** (`Equipo MedicHands`).
  - Subida directa de imágenes de portada hacia Supabase Storage con validación de tipo MIME y tamaño máximo (≤ 5MB).

---

## 9. Despliegue en Vercel

1. Conectar el repositorio de GitHub al proyecto en **Vercel**.
2. **Framework Preset:** Astro.
3. **Root Directory:** `medichands-web`.
4. **Environment Variables:** Configurar en Vercel Dashboard:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
5. Vercel ejecutará automáticamente `npm run build` y servirá las páginas estáticas a través de su CDN global.
