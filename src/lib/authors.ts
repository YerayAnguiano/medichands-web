// Mapeo oficial de correos de administradores a nombres de autor
export const ADMIN_AUTHORS: Record<string, string> = {
  'yerayanguiano@gmail.com': 'Jetzael Yeray Anguiano Solis',
  'citlallisarar@gmail.com': 'Citlalli Sarai Rivera Escareño',
  'efrainarias@gmail.com': 'Efraín Alejandro Arias Meza',
};

export const TEAM_AUTHOR_NAME = 'Equipo MedicHands';

export function isAuthorizedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized === 'yerayanguiano@gmail.com' ||
    normalized === 'citlallisarar@gmail.com' ||
    normalized === 'efrainarias@gmail.com' ||
    normalized in ADMIN_AUTHORS
  );
}

export function resolveAuthorName(email: string, isTeamAuthor: boolean): string {
  if (isTeamAuthor) {
    return TEAM_AUTHOR_NAME;
  }
  const normalized = email.trim().toLowerCase();
  return ADMIN_AUTHORS[normalized] || 'Investigador MedicHands';
}
