import "server-only";

import path from "path";
import { PKPass } from "passkit-generator";
import type { Member } from "./members";

/**
 * Apple Wallet pass signing. Server-only: the `import "server-only"` above makes
 * the build fail if any client component ever imports this module, because it
 * reads the private signer key from the environment.
 *
 * This module knows nothing about HTTP or React. Give it a member record, get
 * back a signed .pkpass buffer. The route handler is responsible for streaming.
 */

// TODO: models/aiyara.pass/pass.json ships with a PLACEHOLDER passTypeIdentifier
// ("pass.com.example.aiyara") and teamIdentifier ("ABCDE12345"). Swap both for
// the real Pass Type ID and Team ID from your Apple Developer account — they
// must match the signer certificate, or Wallet will reject the pass.
const PASS_MODEL_DIR = path.join(process.cwd(), "models", "aiyara.pass");

/**
 * The four Apple certificate materials, each stored base64-encoded in an env
 * var (base64 keeps the multi-line PEM/passphrase intact in a single value).
 * None are NEXT_PUBLIC_-prefixed, so they never reach the client bundle.
 */
function loadCertificates() {
  const signerCert = decodeRequired("APPLE_SIGNER_CERT");
  const signerKey = decodeRequired("APPLE_SIGNER_KEY");
  const wwdr = decodeRequired("APPLE_WWDR_CERT");
  // The passphrase is stored base64 too, for consistency with the others.
  const signerKeyPassphrase = decodeRequired("APPLE_SIGNER_KEY_PASSPHRASE");

  return { signerCert, signerKey, wwdr, signerKeyPassphrase };
}

function decodeRequired(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env var ${name}. See .env.example and the README for how to ` +
        `create and base64-encode the Apple certificates.`
    );
  }
  return Buffer.from(value, "base64").toString("utf-8");
}

/**
 * Build and sign a .pkpass for the given member, returning the raw buffer.
 */
export async function generatePass(member: Member): Promise<Buffer> {
  const certificates = loadCertificates();

  const pass = await PKPass.from(
    {
      model: PASS_MODEL_DIR,
      certificates,
    },
    {
      // Per-member overrides of the static pass.json.
      serialNumber: member.serial_number,
    }
  );

  // Dynamic, per-member field values are injected here (the model declares the
  // pass as generic with empty field arrays; we populate them at runtime).
  pass.primaryFields.push({
    key: "member",
    label: "MEMBER",
    value: member.name,
  });

  pass.secondaryFields.push({
    key: "status",
    label: "STATUS",
    value: "Active",
  });

  // QR barcode encoding the serial number (used for check-in / verification).
  pass.setBarcodes({
    message: member.serial_number,
    format: "PKBarcodeFormatQR",
    messageEncoding: "iso-8859-1",
  });

  return pass.getAsBuffer();
}
