import { randomUUID, randomBytes } from "crypto";
import { getSupabase } from "./supabase";

/**
 * Server-only data access for club members.
 *
 * Uses Supabase when its env vars are present; otherwise falls back to an
 * in-memory Map (the stage-1 behavior), so the app still runs with zero config.
 *
 * The function signatures are stable across both backends so route handlers do
 * not care which one is active. They are async because the Supabase path makes
 * network calls; the in-memory path just resolves immediately.
 *
 * Keep this module server-side only — it must never be imported by a client
 * component, since it pulls in the (server-only) Supabase client.
 */

export interface Member {
  id: string;
  name: string;
  email: string;
  serial_number: string;
  auth_token: string;
  created_at: string; // ISO 8601 timestamp
}

// ---------------------------------------------------------------------------
// In-memory fallback store (used only when Supabase is not configured).
//
// Pinned to globalThis on purpose: in Next.js dev, route handlers are bundled
// separately and modules get re-evaluated on hot reload, which would otherwise
// give each route its own Map (and wipe it on every recompile). A single
// global instance keeps issued passes readable across routes and reloads.
// ---------------------------------------------------------------------------
const globalStore = globalThis as unknown as {
  __aiyaraMembers?: Map<string, Member>;
};

const membersBySerial =
  globalStore.__aiyaraMembers ?? new Map<string, Member>();

if (!globalStore.__aiyaraMembers) {
  globalStore.__aiyaraMembers = membersBySerial;
}

/**
 * Create a member, generating a unique serial number and a random auth token.
 * Returns the stored member row.
 */
export async function createMember(
  name: string,
  email: string
): Promise<Member> {
  const serial_number = randomUUID();
  const auth_token = randomBytes(20).toString("hex");

  const supabase = getSupabase();
  if (supabase) {
    // Let the DB fill id (gen_random_uuid) and created_at (now()) defaults.
    const { data, error } = await supabase
      .from("members")
      .insert({ name, email, serial_number, auth_token })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create member: ${error.message}`);
    }

    return data as Member;
  }

  // In-memory fallback.
  const member: Member = {
    id: randomUUID(),
    name,
    email,
    serial_number,
    auth_token,
    created_at: new Date().toISOString(),
  };
  membersBySerial.set(member.serial_number, member);
  return member;
}

/**
 * Look up a member by serial number. Returns null if not found.
 */
export async function getMemberBySerial(
  serial: string
): Promise<Member | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("serial_number", serial)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to look up member: ${error.message}`);
    }

    return (data as Member) ?? null;
  }

  // In-memory fallback.
  return membersBySerial.get(serial) ?? null;
}
