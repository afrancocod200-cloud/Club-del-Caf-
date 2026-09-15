import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/**
 * Autenticación del panel de administrador del Club del Café.
 *
 * No hay roles ni tabla de perfiles todavía: cualquier cuenta que exista en
 * Supabase Auth para este proyecto entra al panel. Las cuentas las crea
 * Andrés manualmente desde el dashboard de Supabase (Authentication > Users),
 * así que "tener una cuenta" ya es el control de acceso.
 */

export const isAdminAuthConfigured = Boolean(supabase);

export async function signInAdmin(
  email: string,
  password: string,
): Promise<{ session: Session | null; error: string | null }> {
  if (!supabase) {
    return { session: null, error: "Supabase no está configurado (faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)." };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { session: null, error: error.message };
  return { session: data.session, error: null };
}

export async function signOutAdmin(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getInitialAdminSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export function onAdminAuthChange(callback: (session: Session | null) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
