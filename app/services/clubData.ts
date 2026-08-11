import { supabase } from "../lib/supabase";

export type MembershipRecord = {
  id: string;
  name: string;
  slug?: string;
  price?: number;
  price_monthly?: number;
  description?: string | null;
  active?: boolean | null;
  is_active?: boolean | null;
  featured?: boolean | null;
  display_order?: number | null;
  [key: string]: unknown;
};

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  price: number;
  member_price?: number | null;
  image_url?: string | null;
  active?: boolean | null;
  is_active?: boolean | null;
  category?: string | null;
  producer_id?: string | null;
  stock_status?: string | null;
  origin_region?: string | null;
  flavor_notes?: string | null;
  [key: string]: unknown;
};

export type ProducerRecord = {
  id: string;
  name: string;
  slug: string;
  region?: string | null;
  image_url?: string | null;
  active?: boolean | null;
  is_active?: boolean | null;
  story?: string | null;
  description_short?: string | null;
  [key: string]: unknown;
};

export type EventRecord = {
  id: string;
  name: string;
  slug: string;
  date?: string;
  event_date?: string;
  event_type?: string | null;
  start_time?: string | null;
  available_spots?: number | null;
  price?: number | null;
  member_price?: number | null;
  is_free?: boolean | null;
  image_url?: string | null;
  status?: string | null;
  [key: string]: unknown;
};

export type EventReservationInput = {
  eventId: string;
  userId?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  numberOfSpots?: number;
  totalPrice?: number;
  paymentStatus?: "pending" | "not_required";
  notes?: string | null;
};

type ClubTable = "memberships" | "products" | "producers" | "events";

// Coinciden con el contenido de demostración que ya muestra la interfaz.
// Permanecen aquí para que las consultas nunca dejen una sección vacía.
export const membershipMocks: MembershipRecord[] = [
  { id: "mock-explorador", name: "Explorador", price: 45000, description: "Empieza a vivir el Club", active: true },
  { id: "mock-catador", name: "Catador", price: 95000, description: "Descubre un café cada mes", active: true },
  { id: "mock-ritual", name: "Ritual", price: 160000, description: "La experiencia completa", active: true },
];

export const productMocks: ProductRecord[] = [
  { id: "mock-huila", slug: "huila-lavado", name: "Huila Lavado", price: 56000, member_price: 48000, active: true },
  { id: "mock-narino", slug: "narino-natural", name: "Nariño Natural", price: 52000, member_price: 46000, active: true },
  { id: "mock-sierra", slug: "sierra-organico", name: "Sierra Nevada Orgánico", price: 49000, member_price: 43000, active: true },
  { id: "mock-v60", slug: "v60-ceramico", name: "V60 Cerámico", price: 85000, member_price: 76000, active: true },
  { id: "mock-prensa", slug: "prensa-francesa", name: "Prensa Francesa", price: 98000, member_price: 88000, active: true },
  { id: "mock-molino", slug: "molino-manual", name: "Molino Manual", price: 135000, member_price: 120000, active: true },
  { id: "mock-kit", slug: "kit-inicio-filtrado", name: "Kit de Inicio Filtrado", price: 189000, member_price: 169000, active: true },
  { id: "mock-filtros", slug: "filtros-papel", name: "Filtros de Papel x100", price: 32000, member_price: 28000, active: true },
];

export const producerMocks: ProducerRecord[] = [
  { id: "mock-sierra-clara", slug: "sierra-clara", name: "Café Sierra Clara", region: "Sierra Nevada", active: true },
  { id: "mock-finca-horizonte", slug: "finca-horizonte", name: "Finca El Horizonte", region: "Huila", active: true },
  { id: "mock-tostadores-sur", slug: "tostadores-sur", name: "Tostadores del Sur", region: "Nariño", active: true },
];

export const eventMocks: EventRecord[] = [
  { id: "mock-cata", slug: "cata-cafe-mes", name: "Cata del Café del Mes", date: "2026-08-22", status: "scheduled" },
  { id: "mock-metodos", slug: "metodos-casa", name: "Taller de Métodos en Casa", date: "2026-08-29", status: "scheduled" },
  { id: "mock-maridaje", slug: "maridaje-postre", name: "Maridaje Café & Postre", date: "2026-09-05", status: "scheduled" },
  { id: "mock-productor", slug: "productor-invitado", name: "Charla con Productor Invitado", date: "2026-09-12", status: "scheduled" },
  { id: "mock-encuentro", slug: "encuentro-club", name: "Encuentro Gratuito del Club", date: "2026-09-20", status: "scheduled" },
];

async function readWithFallback<T>(
  table: ClubTable,
  fallback: readonly T[],
  orderBy: string,
): Promise<T[]> {
  if (!supabase) return [...fallback];

  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: true });

    if (error || !data) {
      console.warn(`[Club del Café] ${table}: usando datos mock.`, error?.message);
      return [...fallback];
    }

    return data as T[];
  } catch (error) {
    console.warn(`[Club del Café] ${table}: Supabase no respondió; usando mocks.`, error);
    return [...fallback];
  }
}

export function getMemberships(): Promise<MembershipRecord[]> {
  return readWithFallback("memberships", membershipMocks, "display_order");
}

export function getProducts(): Promise<ProductRecord[]> {
  return readWithFallback("products", productMocks, "name");
}

export function getProducers(): Promise<ProducerRecord[]> {
  return readWithFallback("producers", producerMocks, "name");
}

export function getEvents(): Promise<EventRecord[]> {
  return readWithFallback("events", eventMocks, "event_date");
}

/**
 * Registra una intención de reserva antes de continuar la coordinación por WhatsApp.
 * Si Supabase no está disponible, el flujo público continúa sin interrumpirse.
 */
export async function createEventReservation(input: EventReservationInput): Promise<{ success: true; data: unknown } | { success: false; error: unknown }> {
  if (!supabase || input.eventId.startsWith("mock-")) {
    return { success: false, error: new Error("Supabase no está disponible o el evento es un mock.") };
  }

  try {
    const { data, error } = await supabase.from("reservations").insert({
      event_id: input.eventId,
      user_id: input.userId ?? null,
      guest_name: input.guestName ?? null,
      guest_email: input.guestEmail ?? null,
      guest_phone: input.guestPhone ?? null,
      number_of_spots: input.numberOfSpots ?? 1,
      reservation_status: "pending",
      payment_status: input.paymentStatus ?? "pending",
      total_price: input.totalPrice ?? 0,
      notes: input.notes ?? null,
    }).select().single();

    if (error) {
      console.warn("[Club del Café] No fue posible registrar la reserva; el flujo de WhatsApp continúa.", error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.warn("[Club del Café] No fue posible registrar la reserva; el flujo de WhatsApp continúa.", error);
    return { success: false, error };
  }
}

/** API agrupada para consumidores que prefieran importar un solo objeto. */
export const clubDataService = {
  memberships: getMemberships,
  products: getProducts,
  producers: getProducers,
  events: getEvents,
  createEventReservation,
};
