# Bitácora Técnica de Desarrollo: MedicHands Web (`medichands-web`)

> **Documento Vivo de Registro Persistente para Agentes y Desarrolladores**  
> **Última actualización:** 14 de octubre de 2026  
> **Fase actual:** Fase 6 y 7 Validadas (100%) $\rightarrow$ Preparación de Fase 8 (GitHub y Vercel)

---

## 1. Estado y Avance por Fases

| Fase | Descripción | Estado Verificado | Evidencia / Observaciones |
| :---: | :--- | :---: | :--- |
| **Fase 0** | Comprensión, identidad y alcance científico | `COMPLETADA` | Consistencia con `contexto_actual.md` y paper publicado UCol. |
| **Fase 1** | Arquitectura tecnológica oficial | `COMPLETADA` | Astro v5 (SSG) + React v19 + TailwindCSS + Supabase + Vercel. |
| **Fase 2** | UI/UX e Identidad Visual | `COMPLETADA` | Paleta oficial (`#992173`, lavanda, verde) y diseño editorial Substack. |
| **Fase 3** | Frontend Base y Maquetación | `COMPLETADA` | 8 rutas estáticas compiladas (`/`, `/quienes-somos`, `/bitacora`, `/mh-admin-cdc-control`, 4 posts). |
| **Fase 4** | Backend, Persistencia y Administración CDC | `COMPLETADA Y VALIDADA` | Supabase remoto operativo (`posts`, `post_likes`, RPC `increment_like`, bucket `covers`, Auth). |
| **Fase 5** | Interacciones y Redes Comunitarias | `COMPLETADA Y VALIDADA` | Likes bidireccionales en tiempo real (ACID), Facebook Comments oficial y modal de compartir. |
| **Fase 6** | Contenido Oficial e Integraciones Externas | `COMPLETADA Y VALIDADA` | Enlace Mercado Pago integrado, Bitácora real alojada en `/bitacora` y estructura "¿Quiénes somos?". |
| **Fase 7** | QA, Accesibilidad, Seguridad y Testing | `COMPLETADA Y VALIDADA` | Cero enlaces rotos, `robots.txt` activo, tags `aria-label` WCAG 2.1 AA, 0 errores TypeScript, build verificado. |
| **Fase 8** | Repositorio GitHub y Despliegue en Vercel | `PLANIFICADA` | Inicialización de Git, conexión remota GitHub, variables en Vercel y despliegue a producción. |


---

## 2. Decisiones Técnicas Aprobadas

1. **Stack de Persistencia:** PostgreSQL 15+ gestionado en Supabase con RLS estricto.
2. **Lista Blanca de Administradores (3 correos oficiales):**
   - `yerayanguiano@gmail.com` $\rightarrow$ Jetzael Yeray Anguiano Solis
   - `citlallisarar@gmail.com` $\rightarrow$ Citlalli Sarai Rivera Escareño
   - `efrainarias@gmail.com` $\rightarrow$ Efraín Alejandro Arias Meza
3. **Consola Administrativa Secreta:**
   - Ruta: `/mh-admin-cdc-control`.
   - Sin enlaces públicos visibles en el encabezado o pie de página.
   - Protección multinivel: `AdminAuthGuard.tsx` (frontend) + RLS `is_admin_user()` (PostgreSQL) + Storage RLS.
4. **Autoría Dinámica:**
   - El administrador en sesión puede alternar entre **Autoría Individual** (su nombre oficial) y **Autoría Grupal** (`Equipo MedicHands`).
5. **Visibilidad Editorial:**
   - Campo `is_published` integrado para alternar entre *Publicado* y *Borrador*.
6. **Likes Bidireccionales Atómicos y Reconciliación en Tiempo Real:**
   - Huella digital anónima por visitante (`mh_visitor_fp`).
   - Función RPC `toggle_like(target_post_id, visitor_hash)` que inserta o elimina en `post_likes` y actualiza atómicamente `posts.likes_count`.
   - Función RPC `get_post_likes_status(target_post_id, visitor_hash)` ejecutada al montar el cliente para reconciliar al instante el valor estático SSG con la base de datos real.
7. **Widget Oficial de Comentarios de Facebook:**
   - Integración oficial mediante SDK v19 XFBML en `FacebookComments.astro` con fallback defensivo `#fb-adblock-fallback`.
8. **Resiliencia de Compilación:**
   - `supabase.ts` conmuta automáticamente a `mockPosts.ts` si la base de datos está vacía o sin conexión, garantizando que el build SSG nunca falle.

---

## 3. Registro de Archivos del Proyecto

### Modificados y Creados en Fase 5
- `supabase/seed.sql`: Sembrado oficial de 4 artículos científicos en la base de datos remota de Supabase.
- `supabase/migration_likes_toggle.sql`: Script de migración con las funciones RPC `get_post_likes_status` y `toggle_like`.
- `supabase/schema.sql`: Actualizado con las definiciones canónicas de las nuevas funciones RPC.
- `src/lib/supabase.ts`: Funciones `getPostLikesStatus` y `togglePostLike` agregadas y tipadas.
- `src/components/post/LikeButton.tsx`: Botón interactivo con renderizado instantáneo desde `localStorage`, sincronización viva con Supabase y alternancia optimista bidireccional.
- `src/components/post/FacebookComments.astro`: SDK oficial de Meta con inicialización `window.fbAsyncInit` y tarjeta informativa para navegadores con adblock.
- `src/components/common/ShareModal.tsx`: Modal para compartir en Facebook, Twitter (X), Instagram y copiado al portapapeles.
- `src/components/home/PostFeed.tsx`: Buscador interactivo en vivo y ordenamiento por "Más recientes" y "Más populares".

---

## 4. Pruebas Ejecutadas y Resultados Verificados

1. **Chequeo Estático de Tipos TypeScript:**
   - Comando: `npx tsc --noEmit`
   - Resultado: **0 errores de compilación**.
2. **Compilación SSG de Astro:**
   - Comando: `npm run build`
   - Resultado: **8 rutas estáticas generadas en 8.20s** (`/`, `/quienes-somos`, `/bitacora`, `/mh-admin-cdc-control`, 4 artículos dinámicos).
3. **Validación de Likes Bidireccionales en Supabase:**
   - Script de prueba: `test_toggle_likes.mjs`
   - Resultado: **100% exitoso** (Estado inicial `has_liked: false` $\rightarrow$ Toggle ON `has_liked: true, +1` $\rightarrow$ Toggle OFF `has_liked: false, -1`).
4. **Sembrado de Artículos en Remoto:**
   - 4 publicaciones verificadas en `public.posts` con sus slugs oficiales.
5. **Integración de MedicHands-Bitacora como Ruta Nativa:**
   - Ruta `/bitacora` renderiza historia, obstáculos, divulgación UCol, timeline y fotos del equipo de investigación.

---

## 5. Riesgos, Errores y Problemas Abiertos

- **Visualización de Facebook Comments en Localhost:** Meta restringe el renderizado del plugin en dominios locales o no publicados en internet. El widget se inicializará y vinculará a la URL canónica en el despliegue de producción en Vercel (Fase 8).
- **Formulario de Voluntariado Google Forms:** Se mantiene temporalmente el enlace genérico a Google Forms en `Sidebar.astro` a la espera del enlace definitivo del formulario de toma de muestras.

---

## 6. Avance de Fase 6: Contenido Oficial e Integraciones Externas

1. **Tarea 6.1: Enlace de Donaciones Mercado Pago (`COMPLETADA`):**
   - Vinculado a `https://link.mercadopago.com.mx/medichands` en `Sidebar.astro`.
2. **Tarea 6.2: Muestreo Clínico con Voluntarias (`EN ESPERA DE ENLACE FORMULARIO`):**
   - Estructura conservada en `Sidebar.astro` para su posterior vinculación al Google Forms oficial.
3. **Tarea 6.3: Integración de la Bitácora Real y Estructura "¿Quiénes somos?" (`COMPLETADA`):**
   - Estructura sintetizada en `src/pages/quienes-somos.astro` con botón "Descubrir más" vinculado a `/bitacora`.
   - Creada la ruta `/bitacora` (`src/pages/bitacora/index.astro`) importando los componentes y recursos de `MedicHands-Bitacora`.

---

## 7. Resultados de la Fase 7: QA, Accesibilidad, Seguridad y Testing

1. **Auditoría de Enlaces Internos:**
   - Detectado y corregido enlace desactualizado en `Footer.astro` (`/quienes-somos#bitacora` $\rightarrow$ `/bitacora`).
   - Auditoría automatizada en `dist/`: **0 enlaces rotos en las 8 páginas generadas**.
2. **Auditoría SEO y Metadatos:**
   - Creado `public/robots.txt` permitiendo indexación general y bloqueando el rastreo de `/mh-admin-cdc-control` para proteger la consola administrativa secreta.
   - Configurado `site: 'https://medichands.vercel.app'` en `astro.config.mjs` para garantizar URLs canónicas absolutas y metaetiquetas OpenGraph/Twitter válidas.
3. **Accesibilidad (WCAG 2.1 AA):**
   - Etiquetas `aria-label` descriptivas incorporadas en el botón de limpieza de búsqueda (`PostFeed.tsx`) y en los botones de edición y eliminación (`AdminDashboard.tsx`).
   - Atributos `alt` verificados en todas las imágenes del sitio.
4. **Seguridad y Cero Fugas de Secretos:**
   - Verificado que únicamente las variables públicas (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`) están expuestas al cliente; la clave `service_role` permanece protegida y fuera del frontend.

---

## 8. Avance de Fase 8: Repositorio Git y Despliegue en Vercel

1. **Inicialización de Git Local (`COMPLETADA`):**
   - Repositorio inicializado en rama `main`.
   - Autor configurado: `YerayAnguiano <janguiano27@ucol.mx>`.
   - Commit inicial registrado: `dca3fc1` (*54 archivos, 11,946 inserciones*).
   - `.gitignore` verificado: `.env.local` y temporales de compilación debidamente protegidos y excluidos.
2. **Paso Pendiente: Conexión a GitHub:**
   - Crear repositorio en GitHub y ejecutar:
     ```bash
     git remote add origin https://github.com/<TU_USUARIO>/<TU_REPOSITORIO>.git
     git push -u origin main
     ```
3. **Paso Pendiente: Despliegue en Vercel:**
   - Importar repositorio desde Vercel Dashboard.
   - Configurar variables de entorno de producción:
     - `PUBLIC_SUPABASE_URL`
     - `PUBLIC_SUPABASE_ANON_KEY`
   - Desplegar para obtener URL con HTTPS y habilitar el widget oficial de Facebook Comments en vivo.



