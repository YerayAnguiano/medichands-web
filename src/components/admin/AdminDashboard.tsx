import { useState, useEffect, useRef, type FC, type ChangeEvent, type FormEvent } from 'react';
import type { Post } from '../../types';
import { supabase, createPost, updatePost, deletePost, uploadCoverImage } from '../../lib/supabase';
import { ADMIN_AUTHORS, TEAM_AUTHOR_NAME, resolveAuthorName } from '../../lib/authors';
import { 
  Plus, Edit3, Trash2, LogOut, Image, Eye, CheckCircle2, AlertCircle,
  Bold, Italic, Heading2, Heading3, List, Quote, Link2, ImageIcon, UploadCloud
} from 'lucide-react';
import { marked } from 'marked';

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
  const [category, setCategory] = useState('Investigación');
  const [isTeamAuthor, setIsTeamAuthor] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [readingTime, setReadingTime] = useState(3);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Pestañas de Markdown y subida de imágenes en contenido
  const [contentTab, setContentTab] = useState<'write' | 'preview'>('write');
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentImageFileInputRef = useRef<HTMLInputElement>(null);

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
    setCategory('Investigación');
    setIsTeamAuthor(false);
    setIsPublished(true);
    setReadingTime(4);
    setFormError('');
    setContentTab('write');
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
    setContentTab('write');
    setIsModalOpen(true);
  };

  // Subir imagen de portada principal
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
      setFormError(res.error || 'Error subiendo imagen de portada al storage.');
    }
  };

  // Asistente para insertar sintaxis Markdown en la posición actual del cursor
  const insertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + prefix + defaultText + suffix);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = prefix + selectedText + suffix;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 40);
  };

  // Subir imagen para insertar dentro del contenido (Markdown)
  const handleContentImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingContentImage(true);
    setFormError('');
    const res = await uploadCoverImage(file);
    setUploadingContentImage(false);
    if (res.url) {
      const altDesc = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Imagen del artículo';
      insertMarkdown(`\n\n![${altDesc}](`, `${res.url})\n\n`, '');
    } else {
      setFormError(res.error || 'Error al subir la imagen para el contenido.');
    }
    if (e.target) e.target.value = '';
  };

  // Insertar imagen por URL directa
  const handleInsertImageUrl = () => {
    const url = window.prompt('Pega la URL de la imagen que deseas insertar:');
    if (!url || !url.trim()) return;
    const alt = window.prompt('Texto descriptivo / pie de foto (opcional):') || 'Imagen del artículo';
    insertMarkdown(`\n\n![${alt.trim()}](`, `${url.trim()})\n\n`, '');
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
                    <option value="Investigación">Investigación</option>
                    <option value="Ingeniería de Hardware">Ingeniería de Hardware</option>
                    <option value="Articulo Científico">Articulo Científico</option>
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

              {/* Contenido con Soporte Completo Markdown, Barra de Herramientas y Vista Previa */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-mh-gray-700">
                    Contenido del Artículo (Markdown) *
                  </label>

                  {/* Selector de Pestañas: Escribir / Vista Previa */}
                  <div className="flex items-center bg-mh-lavender-light/50 p-1 rounded-xl border border-mh-lavender">
                    <button
                      type="button"
                      onClick={() => setContentTab('write')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        contentTab === 'write'
                          ? 'bg-white text-mh-primary shadow-xs'
                          : 'text-mh-gray-600 hover:text-mh-primary'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Escribir
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        contentTab === 'preview'
                          ? 'bg-white text-mh-primary shadow-xs'
                          : 'text-mh-gray-600 hover:text-mh-primary'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Vista Previa
                    </button>
                  </div>
                </div>

                {contentTab === 'write' ? (
                  <div className="rounded-xl border border-mh-lavender overflow-hidden bg-white focus-within:border-mh-primary transition-colors">
                    {/* Barra de Herramientas Markdown */}
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-mh-lavender-light/40 border-b border-mh-lavender text-mh-gray-700 text-xs">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('## ', '\n', 'Título de Sección')}
                        className="p-1.5 rounded-lg hover:bg-white hover:text-mh-primary transition-colors font-bold"
                        title="Encabezado H2 (## Título)"
                        aria-label="Encabezado 2"
                      >
                        <Heading2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('### ', '\n', 'Subtítulo')}
                        className="p-1.5 rounded-lg hover:bg-white hover:text-mh-primary transition-colors font-bold"
                        title="Subencabezado H3 (### Subtítulo)"
                        aria-label="Encabezado 3"
                      >
                        <Heading3 className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-mh-lavender mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown('**', '**', 'texto en negrita')}
                        className="p-1.5 rounded-lg hover:bg-white hover:text-mh-primary transition-colors font-bold"
                        title="Negrita (**texto**)"
                        aria-label="Negrita"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('*', '*', 'texto en cursiva')}
                        className="p-1.5 rounded-lg hover:bg-white hover:text-mh-primary transition-colors italic"
                        title="Cursiva (*texto*)"
                        aria-label="Cursiva"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('> ', '\n', 'Cita o frase destacada')}
                        className="p-1.5 rounded-lg hover:bg-white hover:text-mh-primary transition-colors"
                        title="Cita destacada (> cita)"
                        aria-label="Cita"
                      >
                        <Quote className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('- ', '\n', 'Elemento de lista')}
                        className="p-1.5 rounded-lg hover:bg-white hover:text-mh-primary transition-colors"
                        title="Lista de viñetas (- elemento)"
                        aria-label="Lista con viñetas"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('[', '](https://...)', 'Texto del enlace')}
                        className="p-1.5 rounded-lg hover:bg-white hover:text-mh-primary transition-colors"
                        title="Enlace web ([texto](url))"
                        aria-label="Enlace"
                      >
                        <Link2 className="w-4 h-4" />
                      </button>

                      <div className="w-px h-4 bg-mh-lavender mx-1" />

                      {/* Botón para subir e insertar imagen en el contenido */}
                      <label 
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          uploadingContentImage 
                            ? 'bg-mh-lavender text-mh-primary animate-pulse'
                            : 'bg-white hover:bg-mh-lavender-light text-mh-primary border border-mh-lavender/60'
                        }`}
                        title="Subir archivo de imagen e insertarla donde esté el cursor"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{uploadingContentImage ? 'Subiendo imagen...' : 'Subir Imagen'}</span>
                        <input
                          ref={contentImageFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleContentImageUpload}
                          disabled={uploadingContentImage}
                          className="hidden"
                        />
                      </label>

                      {/* Botón para insertar imagen por URL */}
                      <button
                        type="button"
                        onClick={handleInsertImageUrl}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-white hover:text-mh-primary transition-colors text-mh-gray-700"
                        title="Insertar imagen desde enlace web URL (![alt](url))"
                        aria-label="Insertar imagen por URL"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>URL Imagen</span>
                      </button>
                    </div>

                    <textarea
                      ref={textareaRef}
                      required
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-xs p-3.5 bg-transparent text-mh-gray-900 focus:outline-none font-mono text-[11px] leading-relaxed resize-y"
                      placeholder="Escribe el artículo usando Markdown. Puedes insertar imágenes entre párrafos usando el botón 'Subir Imagen' o con la sintaxis: ![Descripción](https://...)"
                    />
                  </div>
                ) : (
                  /* Vista Previa Renderizada */
                  <div className="w-full min-h-[260px] max-h-[420px] overflow-y-auto p-5 rounded-xl border border-mh-lavender bg-[#FCFCFD]">
                    {content.trim() ? (
                      <div 
                        className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-mh-gray-900 prose-a:text-mh-primary prose-a:underline hover:prose-a:text-mh-primary-dark prose-strong:text-mh-gray-900 text-mh-gray-800 leading-relaxed text-sm prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-mh-lavender-light prose-img:my-4 prose-img:w-full prose-img:max-h-64 prose-img:object-cover prose-blockquote:border-l-4 prose-blockquote:border-mh-primary prose-blockquote:bg-mh-lavender-light/30 prose-blockquote:rounded-r-lg prose-blockquote:py-1.5 prose-blockquote:px-3 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal"
                        dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }} 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-mh-gray-400">
                        <Eye className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs italic">Aún no hay contenido escrito. Cambia a la pestaña "Escribir" para redactar tu artículo con Markdown.</p>
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-[11px] text-mh-gray-500 mt-1.5 flex items-center gap-1">
                  <span>💡</span>
                  <span>Soporta sintaxis Markdown completa: encabezados (##), negritas (**), listas (-), citas (&gt;) e imágenes (![alt](url)).</span>
                </p>
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
