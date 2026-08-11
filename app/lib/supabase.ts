import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * Indica si el frontend recibió las dos variables públicas de Supabase.
 * La aplicación puede seguir usando sus mocks cuando devuelve false.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Cliente público para operaciones protegidas por Row Level Security (RLS).
 * Nunca se debe usar una service_role key en este archivo ni en VITE_*.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  if (!supabase) {
    return {
      connected: false,
      message: "Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
    };
  }

  const { error } = await supabase.from("memberships").select("id").limit(1);

  return error
    ? { connected: false, message: error.message }
    : { connected: true, message: "Conexión con Supabase disponible." };
}
