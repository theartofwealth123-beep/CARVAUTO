import { detectFlags, extractVinFromText, maskVin, vinHash, textHasCleanTitleClaim } from "../../../packages/shared/parse.js";
import { TITLE_STATUS, RISK_FLAG_TYPES } from "../../../packages/shared/constants.js";

/**
 * Enrich a raw listing object with:
 * - flags
 * - vin masked/hash (from title/description)
 * - title_status (clean-only workflow)
 *
 * Raw listing expected shape (minimal):
 * {
 *   listing_url, title, description, price, year, make, model, trim, mileage,
 *   image_urls: []
 * }
 */
export function enrichListing(raw) {
  const title = raw.title || "";
  const description = raw.description || "";
  const text = `${title}\n${description}`;

  const flags = detectFlags(text);

  const vin = extractVinFromText(text);
  const vin_masked = vin ? maskVin(vin) : null;
  const vin_hash = vin ? vinHash(vin) : null;

  // Title status logic:
  // - If any risk-title types => RISK (not buyable)
  // - Else if explicitly says clean/clear title => CLEAN
  // - Else UNKNOWN
  const hasRiskTitle = flags.some(f => RISK_FLAG_TYPES.has(f.flag_type));
  let title_status = TITLE_STATUS.UNKNOWN;
  if (hasRiskTitle) title_status = TITLE_STATUS.RISK;
  else if (textHasCleanTitleClaim(text)) title_status = TITLE_STATUS.CLEAN;

  // For your buy box, you likely want CLEAN only in the Buy List.
  // Unknown can still be stored for later review/verification.

  return {
    listing: {
      ...raw,
      title_status,
      vin_masked,
      vin_hash,
      vin_source: vin ? "DESCRIPTION" : "UNKNOWN"
    },
    flags
  };
}
