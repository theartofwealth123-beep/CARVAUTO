import crypto from "crypto";
import { RISK_KEYWORDS, RISK_FLAG_TYPES, TITLE_STATUS } from "./constants.js";

// VIN regex: 17 chars, excludes I O Q
const VIN_REGEX = /\b([A-HJ-NPR-Z0-9]{17})\b/g;

function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

export function extractVinFromText(text = "") {
  const matches = [...String(text).toUpperCase().matchAll(VIN_REGEX)].map(m => m[1]);
  if (!matches.length) return null;
  return matches[0];
}

export function maskVin(vin) {
  if (!vin || vin.length !== 17) return null;
  return `${"*".repeat(11)}${vin.slice(11)}`; // last 6 visible
}

export function vinHash(vin) {
  if (!vin || vin.length !== 17) return null;
  return sha256(vin);
}

export function detectFlags(text = "") {
  const raw = String(text);
  const t = raw.toLowerCase();
  const flags = [];

  for (const rule of RISK_KEYWORDS) {
    for (const p of rule.patterns) {
      const idx = t.indexOf(p);
      if (idx !== -1) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(raw.length, idx + p.length + 40);
        flags.push({
          flag_type: rule.type,
          confidence: rule.type === "LIEN" ? 0.7 : 0.9,
          evidence: raw.substring(start, end)
        });
        break;
      }
    }
  }

  return flags;
}

export function inferTitleStatus(flags = []) {
  // If any title-risk flag exists -> RISK
  if (flags.some(f => RISK_FLAG_TYPES.has(f.flag_type))) return TITLE_STATUS.RISK;

  // If explicitly says clean title -> CLEAN
  // (This is conservative. You can refine later.)
  return TITLE_STATUS.UNKNOWN;
}

export function textHasCleanTitleClaim(text = "") {
  const t = String(text).toLowerCase();
  return t.includes("clean title") || t.includes("clear title");
}
