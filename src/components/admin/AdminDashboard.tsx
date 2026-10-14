import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import type { Post } from '../../types';
import { supabase, createPost, updatePost, deletePost, uploadCoverImage } from '../../lib/supabase';
import { ADMIN_AUTHORS, TEAM_AUTHOR_NAME, resolveAuthorName } from '../../lib/authors';
import { Plus, Edit3, Trash2, LogOut, Image, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export const AdminDashboard: FC<AdminDashboardProps> = ({ userEmail, onLogout }: AdminDashboardProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Formulario
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Investigación UCol');
  const [isTeamAuthor, setIsTeamAuthor] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [readingTime, setReadingTime] = useState(3);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Cargar publicaciones
  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && data) {
        setPosts(
          data.map((db: any) => ({
            id: db.id,
            slug: db.slug,
            title: db.title,
            excerpt: db.excerpt,
            content: db.content,
            coverImage: db.cover_image,
            category: db.category,
            authorName: db.author_name,
            authorEmail: db.author_email,
            isTeamAuthor: db.is_team_author,
            readingTimeMinutes: db.reading_time_minutes,
            likesCount: db.likes_count,
            isPublished: db.is_published,
            publishedAt: db.published_at,
          }))
        );
      }
    } catch {
      // Manejado
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Generar slug automático a partir del título
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      const generated = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80');
    setCategory('Investigación UCol');
    setIsTeamAuthor(false);
    setIsPublished(true);
    setReadingTime(4);
    setFormError('');
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setCategory(post.category);
    setIsTeamAuthor(post.isTeamAuthor);
    setIsPublished(post.isPublished !== false);
    setReadingTime(post.readingTimeMinutes);
    setFormError('');
    setIsModalOpen(true);
  };

  // Subir imagen de archivo
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    setFormError('');
    const res = await uploadCoverImage(file);
    setUploadingImage(false);
    if (res.url) {
      setCoverImage(res.url);
    } else {
      setFormError(res.error || 'Error subiendo imagen al storage.');
    }
  };

  // Guardar publicación
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setFormError('Por favor completa todos los campos requeridos (Título, Slug, Contenido).');
      return;
    }

    setSaving(true);
    setFormError('');

    const resolvedAuthor = resolveAuthorName(userEmail, isTeamAuthor);

    if (editingPost) {
      // Actualizar
      const res = await updatePost(editingPost.id, {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        authorName: resolvedAuthor,
        authorEmail: userEmail,
        isTeamAuthor,
        isPublished,
        readingTimeMinutes: readingTime,
      });

      if (!res.success) {
        setFormError(res.error || 'Error al actualizar.');
        setSaving(false);
        return;
      }
    } else {
      // Crear
      const res = await createPost({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        authorName: resolvedAuthor,
        authorEmail: userEmail,
        isTeamAuthor,
        isPublished,
        readingTimeMinutes: readingTime,
        publishedAt: new Date().toISOString(),
      });

      if (!res.success) {
        setFormError(res.error || 'Error al crear la publicación.');
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setIsModalOpen(false);
    await loadPosts();
  };

  // Eliminar
  const handleDelete = async (post: Post) => {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la publicación "${post.title}"?`)) {
      const res = await deletePost(post.id);
      if (res.success) {
        await loadPosts();
      } else {
        alert(res.error || 'No se pudo eliminar la publicación.');
      }
    }
  };

  // Resolver nombre actual del admin en sesión
  const currentAdminName = ADMIN_AUTHORS[userEmail.toLowerCase()] || userEmail;

  return (
    <div className="space-y-8">
      {/* Barra de Usuario y Sesión */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-mh-lavender-light/40 border border-mh-lavender">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-mh-primary bg-mh-lavender px-2 py-0.5 rounded">
            Sesión Administrativa Autorizada
          </span>
          <h2 className="text-xl font-display font-black text-mh-gray-900 mt-1">
            {currentAdminName}
          </h2>
          <span className="text-xs text-mh-gray-500">{userEmail}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-mh-primary hover:bg-mh-primary-dark transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Publicación</span>
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-mh-gray-700 bg-white border border-mh-lavender hover:bg-mh-lavender-light transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Tabla de Publicaciones */}
      <div className="rounded-2xl border border-mh-lavender-light bg-[#FEFEFE] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-mh-lavender-light flex items-center justify-between">
          <h3 className="font-display font-bold text-mh-gray-900 text-lg">
            Gestión de Publicaciones ({posts.length})
          </h3>
          <span className="text-xs text-mh-gray-500">
            Sincronizado con Supabase PostgreSQL
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-mh-gray-500">
            Cargando publicaciones desde la base de datos...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-sm text-mh-gray-500">
            No hay publicaciones en la base de datos. Pulsa "Nueva Publicación" para crear la primera.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-mh-lavender-light bg-mh-lavender-light/20 text-[11px] font-bold uppercase tracking-wider text-mh-gray-500">
                  <th className="py-3 px-4">Portada</th>
                  <th className="py-3 px-4">Título</th>
                  <th className="py-3 px-4">Autoría</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Likes</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mh-lavender-light text-xs">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-mh-lavender-light/10 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={p.coverImage}
                        alt=""
                        className="w-12 h-8 object-cover rounded border border-mh-lavender-light"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-mh-gray-900 max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-mh-gray-700">{p.authorName}</span>
                      {p.isTeamAuthor && (
                        <span className="ml-1 text-[10px] text-mh-primary font-bold">(Equipo)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {p.isPublished !== false ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          Borrador
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-mh-gray-500">{p.category}</td>
                    <td className="py-3 px-4 font-semibold text-mh-primary">{p.likesCount}</td>
                    <td className="py-3 px-4 text-mh-gray-500">
                      {new Date(p.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-mh-gray-700 hover:text-mh-primary rounded hover:bg-mh-lavender-light transition-colors"
                        title="Editar"
                        aria-label={`Editar ${p.title}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar"
                        aria-label={`Eliminar ${p.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Creación / Edición */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FEFEFE] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-mh-lavender my-8">
            <h3 className="text-xl font-display font-bold text-mh-gray-900 mb-4">
              {editingPost ? 'Editar Publicación' : 'Crear Nueva Publicación'}
            </h3>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700 mb-1">
                  Título del Artículo *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 focus:outline-none focus:border-mh-primary"
                  placeholder="Ej. Avance clave en termografía mamaria..."
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700 mb-1">
                  URL Slug (Identificador único) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 focus:outline-none focus:border-mh-primary font-mono text-[11px]"
                  placeholder="avance-clave-termografia..."
                />
              </div>

              {/* Selector de Autoría Dinámica (Requerimiento Clave) */}
              <div className="p-4 rounded-xl border border-mh-lavender bg-mh-lavender-light/30 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-mh-primary">
                  Modalidad de Autoría de la Publicación
                </label>
                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="authorMode"
                      checked={!isTeamAuthor}
                      onChange={() => setIsTeamAuthor(false)}
                      className="text-mh-primary focus:ring-mh-primary"
                    />
                    <span>
                      Autoría Individual:{' '}
                      <strong className="text-mh-gray-900">{currentAdminName}</strong>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="authorMode"
                      checked={isTeamAuthor}
                      onChange={() => setIsTeamAuthor(true)}
                      className="text-mh-primary focus:ring-mh-primary"
                    />
                    <span>
                      Autoría Grupal:{' '}
                      <strong className="text-mh-gray-900">{TEAM_AUTHOR_NAME}</strong>
                    </span>
                  </label>
                </div>
              </div>

              {/* Selector de Estado de Publicación */}
              <div className="p-3.5 rounded-xl border border-mh-lavender bg-[#FEFEFE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700">
                    Estado de Publicación
                  </span>
                  <span className="text-[11px] text-mh-gray-500">
                    {isPublished ? 'Visible públicamente en el blog y feed principal.' : 'Guardado como borrador (no visible para visitantes).'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="publishStatus"
                      checked={isPublished}
                      onChange={() => setIsPublished(true)}
                      className="text-mh-primary focus:ring-mh-primary"
                    />
                    <span className="text-emerald-700 font-bold">Publicado</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="publishStatus"
                      checked={!isPublished}
                      onChange={() => setIsPublished(false)}
                      className="text-mh-primary focus:ring-mh-primary"
                    />
                    <span className="text-amber-700 font-bold">Borrador</span>
                  </label>
                </div>
              </div>

              {/* Categoría y Tiempo de Lectura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 focus:outline-none focus:border-mh-primary"
                  >
                    <option value="Investigación UCol">Investigación UCol</option>
                    <option value="Ingeniería de Hardware">Ingeniería de Hardware</option>
                    <option value="Fundamento Científico">Fundamento Científico</option>
                    <option value="Prevención Comunitaria">Prevención Comunitaria</option>
                    <option value="Noticias">Noticias</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700 mb-1">
                    Tiempo de lectura (minutos)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 focus:outline-none focus:border-mh-primary"
                  />
                </div>
              </div>

              {/* Imagen de Portada */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700 mb-1">
                  Imagen de Portada (URL o Subir archivo a Supabase Storage)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs p-2.5 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 focus:outline-none focus:border-mh-primary"
                  />
                  <label className="flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-mh-lavender-light text-mh-primary hover:bg-mh-lavender transition-all">
                    <Image className="w-4 h-4" />
                    <span>{uploadingImage ? 'Subiendo...' : 'Subir'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {coverImage && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden border border-mh-lavender-light">
                    <img src={coverImage} alt="Vista previa" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Extracto */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700 mb-1">
                  Extracto Breve *
                </label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 focus:outline-none focus:border-mh-primary"
                  placeholder="Resumen corto de 2 líneas para la tarjeta de portada..."
                />
              </div>

              {/* Contenido Enriquecido */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700 mb-1">
                  Contenido Completo (Markdown / HTML) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 focus:outline-none focus:border-mh-primary font-mono text-[11px]"
                  placeholder="Escribe el artículo usando Markdown: ### Subtítulo, > Cita, **Negrita**..."
                />
              </div>

              {/* Botones Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-mh-lavender-light">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-mh-gray-700 hover:bg-mh-lavender-light transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-mh-primary hover:bg-mh-primary-dark transition-all shadow-sm"
                >
                  {saving ? 'Guardando en Supabase...' : editingPost ? 'Actualizar Artículo' : 'Publicar Artículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
