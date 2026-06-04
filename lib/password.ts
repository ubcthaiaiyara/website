import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * Password hashing with Node's built-in scrypt — no external dependency.
 *
 * Hashes are stored as a single self-describing string:
 *   scrypt$<saltHex>$<derivedKeyHex>
 * so verification needs only the stored value (the salt travels with the hash).
 *
 * Server-only in practice: this is imported by lib/members, which route
 * handlers call. Never import it from a client component.
 */

const KEYLEN = 64;

/** Hash a plaintext password for storage. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/**
 * Verify a plaintext password against a stored hash. Uses a constant-time
 * compare so a wrong password does not leak timing information. Returns false
 * for malformed or empty stored hashes rather than throwing.
 */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored?.split("$") ?? [];
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }

  const [, saltHex, keyHex] = parts;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(keyHex, "hex");
  const derived = scryptSync(password, salt, expected.length);

  // Lengths must match for timingSafeEqual; expected.length guards that above.
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
