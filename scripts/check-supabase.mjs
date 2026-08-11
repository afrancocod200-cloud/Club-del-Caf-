import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL?.trim();
const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!url || !anonKey) {
  console.error(
    "Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env.",
  );
  process.exitCode = 1;
} else {
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await client.from("memberships").select("id").limit(1);

  if (error) {
    console.error(`Supabase respondió, pero la consulta falló: ${error.message}`);
    process.exitCode = 1;
  } else {
    console.log("Conexión correcta: Supabase y la tabla memberships responden.");
  }
}
