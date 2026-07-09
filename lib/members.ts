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
  user_id?: string | null;
  password_hash?: string | null;
  created_at: string; // ISO 8601 timestamp
  // Optional profile fields the member can edit from their account page. When
  // using Supabase these require matching columns (faculty, program, year).
  faculty?: string | null;
  program?: string | null;
  year?: string | null;
}

/** Editable personal details. `name` is the recombined first + last name. */
export interface ProfileUpdate {
  name: string;
  faculty: string;
  program: string;
  year: string;
}

/** Normalize an email for storage and lookup (trim + lowercase). */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
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
 * Raised by member creation when the email is already registered. Callers map this
 * to a 409 so the client can show a friendly "account exists" message.
 */
export class DuplicateEmailError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "DuplicateEmailError";
  }
}

/**
 * Create a member profile for a Supabase Auth user, generating a unique serial
 * number and random pass auth token. Rejects duplicate emails/users.
 */
export async function createMemberForAuthUser(
  userId: string,
  name: string,
  email: string
): Promise<Member> {
  const normalizedEmail = normalizeEmail(email);
  const serial_number = randomUUID();
  const auth_token = randomBytes(20).toString("hex");

  // Reject duplicates up front (also enforced by the unique index in Supabase).
  if ((await getMemberByUserId(userId)) || (await getMemberByEmail(normalizedEmail))) {
    throw new DuplicateEmailError();
  }

  const supabase = getSupabase();
  if (supabase) {
    // Let the DB fill id (gen_random_uuid) and created_at (now()) defaults.
    const { data, error } = await supabase
      .from("members")
      .insert({
        name,
        email: normalizedEmail,
        user_id: userId,
        serial_number,
        auth_token,
      })
      .select()
      .single();

    if (error) {
      // 23505 = unique_violation (race between the check above and insert).
      if (error.code === "23505") {
        throw new DuplicateEmailError();
      }
      throw new Error(`Failed to create member: ${error.message}`);
    }

    return data as Member;
  }

  // In-memory fallback.
  const member: Member = {
    id: randomUUID(),
    name,
    email: normalizedEmail,
    user_id: userId,
    serial_number,
    auth_token,
    created_at: new Date().toISOString(),
  };
  membersBySerial.set(member.serial_number, member);
  return member;
}

/** Find, link, or create a member profile for a Supabase Auth user. */
export async function getOrCreateAuthMember(
  userId: string,
  name: string,
  email: string
): Promise<Member> {
  const existingByUser = await getMemberByUserId(userId);
  if (existingByUser) {
    return existingByUser;
  }

  const existing = await getMemberByEmail(email);
  if (existing?.user_id && existing.user_id !== userId) {
    return existing;
  }

  if (existing && !existing.user_id) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("members")
        .update({ user_id: userId })
        .eq("email", normalizeEmail(email))
        .select()
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to link member to auth user: ${error.message}`);
      }

      return (data as Member) ?? existing;
    }

    existing.user_id = userId;
    membersBySerial.set(existing.serial_number, existing);
    return existing;
  }

  try {
    return await createMemberForAuthUser(userId, name, email);
  } catch (err) {
    if (err instanceof DuplicateEmailError) {
      const member = (await getMemberByUserId(userId)) ?? (await getMemberByEmail(email));
      if (member) return member;
    }
    throw err;
  }
}

export async function getMemberByUserId(userId: string): Promise<Member | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to look up member: ${error.message}`);
    }

    return (data as Member) ?? null;
  }

  for (const member of membersBySerial.values()) {
    if (member.user_id === userId) {
      return member;
    }
  }
  return null;
}

/**
 * Look up a member by email. Returns null if not found. Email comparison is
 * case-insensitive (emails are stored normalized).
 */
export async function getMemberByEmail(email: string): Promise<Member | null> {
  const normalizedEmail = normalizeEmail(email);

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to look up member: ${error.message}`);
    }

    return (data as Member) ?? null;
  }

  // In-memory fallback: scan the serial-keyed map by email.
  for (const member of membersBySerial.values()) {
    if (member.email === normalizedEmail) {
      return member;
    }
  }
  return null;
}

/** Look up a member by serial number. Returns null if not found. */
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

/**
 * Update a member's editable personal details (name + faculty/program/year).
 * Returns the updated member, or null if the serial is unknown.
 */
export async function updateMemberProfile(
  serial: string,
  update: ProfileUpdate
): Promise<Member | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("members")
      .update({
        name: update.name,
        faculty: update.faculty,
        program: update.program,
        year: update.year,
      })
      .eq("serial_number", serial)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update member: ${error.message}`);
    }

    return (data as Member) ?? null;
  }

  // In-memory fallback.
  const member = membersBySerial.get(serial);
  if (!member) return null;

  member.name = update.name;
  member.faculty = update.faculty;
  member.program = update.program;
  member.year = update.year;
  membersBySerial.set(serial, member);
  return member;
}

/**
 * Store the scrypt password hash for a member (looked up by auth user id). We
 * keep this alongside the Supabase Auth password so the app can tell whether a
 * member has set a password yet and verify the current one on change, without
 * an extra Supabase round-trip.
 */
export async function setMemberPasswordHash(
  userId: string,
  passwordHash: string
): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("members")
      .update({ password_hash: passwordHash })
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to update password hash: ${error.message}`);
    }
    return;
  }

  for (const member of membersBySerial.values()) {
    if (member.user_id === userId) {
      member.password_hash = passwordHash;
      membersBySerial.set(member.serial_number, member);
      return;
    }
  }
}
