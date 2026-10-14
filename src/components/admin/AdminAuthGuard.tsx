import { useState, useEffect, type FC, type FormEvent } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isAuthorizedAdminEmail, ADMIN_AUTHORS } from '../../lib/authors';
import { AdminDashboard } from './AdminDashboard';
import { ShieldCheck, Lock, Mail, AlertTriangle, ArrowRight, Info } from 'lucide-react';

export const AdminAuthGuard: FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 1. Si Supabase está configurado, verificar la sesión activa
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          if (isAuthorizedAdminEmail(session.user.email)) {
            setUserEmail(session.user.email);
          } else {
            setErrorMessage('Acceso denegado: Esta cuenta no está en la lista blanca de administradores.');
            supabase.auth.signOut();
          }
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.email) {
          if (isAuthorizedAdminEmail(session.user.email)) {
            setUserEmail(session.user.email);
            setErrorMessage('');
          } else {
            setUserEmail(null);
            setErrorMessage('Acceso denegado: Cuenta no autorizada.');
            supabase.auth.signOut();
          }
        } else {
          setUserEmail(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // 2. Modo Desarrollo Local / Fallback sin credenciales activas de Supabase
      const savedEmail = localStorage.getItem('medichands_mock_admin_email');
      if (savedEmail && isAuthorizedAdminEmail(savedEmail)) {
        setUserEmail(savedEmail);
      }
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedEmail = emailInput.trim().toLowerCase();

    // Validación preventiva de lista blanca de 3 administradores
    if (!isAuthorizedAdminEmail(trimmedEmail)) {
      setErrorMessage(
        'Acceso restringido: El correo ingresado no forma parte de la dirección autorizada de MedicHands.'
      );
      return;
    }

    setSubmitting(true);

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: passwordInput,
      });

      setSubmitting(false);

      if (error) {
        setErrorMessage(`Credenciales inválidas: ${error.message}`);
        return;
      }

      if (data?.user?.email && isAuthorizedAdminEmail(data.user.email)) {
        setUserEmail(data.user.email);
      } else {
        setErrorMessage('Acceso denegado: Usuario sin permisos de administración.');
        await supabase.auth.signOut();
      }
    } else {
      // Modo demostración local mientras se conecta el proyecto Supabase definitivo
      setTimeout(() => {
        setSubmitting(false);
        setUserEmail(trimmedEmail);
        localStorage.setItem('medichands_mock_admin_email', trimmedEmail);
      }, 400);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('medichands_mock_admin_email');
    }
    setUserEmail(null);
    setEmailInput('');
    setPasswordInput('');
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-mh-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-mh-gray-500 uppercase tracking-widest font-mono">
          Verificando sesión segura CDC...
        </p>
      </div>
    );
  }

  // Si está autenticado y autorizado, mostrar el Dashboard
  if (userEmail) {
    return <AdminDashboard userEmail={userEmail} onLogout={handleLogout} />;
  }

  // Formulario de Inicio de Sesión
  return (
    <div className="max-w-md mx-auto my-8">
      <div className="bg-[#FEFEFE] rounded-3xl p-8 border border-mh-lavender shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-mh-lavender-light flex items-center justify-center text-mh-primary">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-display font-black text-mh-gray-900 tracking-tight">
            Acceso Administrativo CDC
          </h2>
          <p className="text-xs text-mh-gray-500 leading-relaxed">
            Consola privada para la creación y curación de artículos científicos de MedicHands.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-tight space-y-1">
              <strong className="font-bold">Modo de Demostración Local</strong>
              <p>
                Supabase no tiene variables en `.env`. Puedes ingresar con cualquiera de los correos autorizados:
                <br />
                <code className="bg-amber-100/80 px-1 py-0.5 rounded text-[10px]">yerayanguiano@gmail.com</code> o <code className="bg-amber-100/80 px-1 py-0.5 rounded text-[10px]">citlallisarar@gmail.com</code>.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-mh-gray-700 mb-1.5">
              Correo Institucional Autorizado
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mh-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="ejemplo@gmail.com"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 placeholder-mh-gray-400 focus:outline-none focus:border-mh-primary focus:ring-1 focus:ring-mh-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-mh-gray-700 mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mh-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required={isSupabaseConfigured}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-mh-lavender bg-mh-lavender-light/20 text-mh-gray-900 placeholder-mh-gray-400 focus:outline-none focus:border-mh-primary focus:ring-1 focus:ring-mh-primary font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-mh-primary hover:bg-mh-primary-dark transition-all shadow-md shadow-mh-primary/20 disabled:opacity-50"
          >
            {submitting ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Ingresar al Panel CDC</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-mh-lavender-light text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-mh-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-mh-primary" />
            <span>Protección RLS PostgreSQL & Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};
