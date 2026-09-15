import { supabase } from "../lib/supabase";
import type {
  EventRecord,
  MembershipRecord,
  ProducerRecord,
  ProductRecord,
} from "./clubData";

/**
 * Escrituras reales del panel de administrador contra Supabase.
 *
 * Requiere políticas RLS en Supabase que permitan insert/update/delete al
 * rol "authenticated" en las tablas products, events, producers y
 * memberships (ver el SQL entregado aparte). Sin esas políticas, Supabase
 * devuelve un error de permisos y esta capa lo reporta en `error`.
 */

type WriteResult<T> = { data: T | null; error: string | null };

function notConfigured<T>(): WriteResult<T> {
  return { data: null, error: "Supabase no está configurado (faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)." };
}

// ---------- Productos ----------

export async function createProduct(input: Partial<ProductRecord>): Promise<WriteResult<ProductRecord>> {
  if (!supabase) return notConfigured();
  const { data, error } = await supabase.from("products").insert(input).select().single();
  return { data: (data as ProductRecord) ?? null, error: error?.message ?? null };
}

export async function updateProduct(id: string, patch: Partial<ProductRecord>): Promise<WriteResult<ProductRecord>> {
  if (!supabase) return notConfigured();
  const { data, error } = await supabase.from("products").update(patch).eq("id", id).select().single();
  return { data: (data as ProductRecord) ?? null, error: error?.message ?? null };
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("products").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ---------- Eventos ----------

export async function createEvent(input: Partial<EventRecord>): Promise<WriteResult<EventRecord>> {
  if (!supabase) return notConfigured();
  const { data, error } = await supabase.from("events").insert(input).select().single();
  return { data: (data as EventRecord) ?? null, error: error?.message ?? null };
}

export async function updateEvent(id: string, patch: Partial<EventRecord>): Promise<WriteResult<EventRecord>> {
  if (!supabase) return notConfigured();
  const { data, error } = await supabase.from("events").update(patch).eq("id", id).select().single();
  return { data: (data as EventRecord) ?? null, error: error?.message ?? null };
}

export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("events").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ---------- Productores ----------

export async function createProducer(input: Partial<ProducerRecord>): Promise<WriteResult<ProducerRecord>> {
  if (!supabase) return notConfigured();
  const { data, error } = await supabase.from("producers").insert(input).select().single();
  return { data: (data as ProducerRecord) ?? null, error: error?.message ?? null };
}

export async function updateProducer(id: string, patch: Partial<ProducerRecord>): Promise<WriteResult<ProducerRecord>> {
  if (!supabase) return notConfigured();
  const { data, error } = await supabase.from("producers").update(patch).eq("id", id).select().single();
  return { data: (data as ProducerRecord) ?? null, error: error?.message ?? null };
}

export async function deleteProducer(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("producers").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ---------- Membresías (planes) ----------

export async function createMembership(input: Partial<MembershipRecord>): Promise<WriteResult<MembershipRecord>> {
  if (!supabase) return notConfigured();
  const { data, error } = await supabase.from("memberships").insert(input).select().single();
  return { data: (data as MembershipRecord) ?? null, error: error?.message ?? null };
}

export async function updateMembership(id: string, patch: Partial<MembershipRecord>): Promise<WriteResult<MembershipRecord>> {
  if (!supabase) return notConfigured();
  const { data, error } = await supabase.from("memberships").update(patch).eq("id", id).select().single();
  return { data: (data as MembershipRecord) ?? null, error: error?.message ?? null };
}

export async function deleteMembership(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase no está configurado." };
  const { error } = await supabase.from("memberships").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ---------- Reservas (solo lectura desde el admin, se crean desde el sitio público) ----------

export type ReservationRecord = {
  id: string;
  event_id: string;
  guest_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  number_of_spots?: number | null;
  reservation_status?: string | null;
  payment_status?: string | null;
  total_price?: number | null;
  notes?: string | null;
  created_at?: string;
  [key: string]: unknown;
};

export async function getReservations(): Promise<{ data: ReservationRecord[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase no está configurado." };
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return { data: [], error: error.message };
  return { data: (data as ReservationRecord[]) ?? [], error: null };
}
