import { getSupabase } from "./supabase.js";
import { enrichListing } from "./enrich.js";
import { fetchListings } from "./adapters/exampleAdapter.js";

/**
 * This ingestion runner:
 * - fetches listings from an adapter
 * - enriches (flags + VIN from text + title status)
 * - upserts into Supabase
 * - inserts flags and images
 *
 * Run:
 *  cd services/ingestion
 *  npm i
 *  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node src/ingest.js
 */
async function upsertListing(supabase, listing) {
  // Upsert by listing_url (unique constraint)
  const { data, error } = await supabase
    .from("listings")
    .upsert(
      [{
        market_id: listing.market_id,
        source: listing.source || "unknown",
        source_listing_id: listing.source_listing_id || null,
        listing_url: listing.listing_url,
        title: listing.title || null,
        description: listing.description || null,
        posted_at: listing.posted_at || null,
        price: listing.price ?? null,
        location_text: listing.location_text || null,
        year: listing.year ?? null,
        make: listing.make || null,
        model: listing.model || null,
        trim: listing.trim || null,
        mileage: listing.mileage ?? null,
        title_status: listing.title_status || "UNKNOWN",
        vin_masked: listing.vin_masked || null,
        vin_hash: listing.vin_hash || null,
        vin_source: listing.vin_source || "UNKNOWN",
        plate_detected: !!listing.plate_detected,
        vin_label_detected: !!listing.vin_label_detected,
        vin_text_detected: !!listing.vin_text_detected,

        // Placeholder scoring fields (you will compute in CVE engine later)
        deal_score: listing.deal_score ?? 50,
        confidence: listing.confidence ?? 50
      }],
      { onConflict: "listing_url" }
    )
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function insertFlags(supabase, listingId, flags) {
  if (!flags?.length) return;
  const payload = flags.map(f => ({
    listing_id: listingId,
    flag_type: f.flag_type,
    confidence: f.confidence,
    evidence: f.evidence
  }));

  // For MVP, we do a simple insert; in production, you'd de-dupe by (listing_id, flag_type).
  const { error } = await supabase.from("listing_flags").insert(payload);
  if (error) {
    // tolerate duplicates if you rerun ingestion
    // you can also implement upsert here if you add unique constraints
    console.warn("Flags insert warning:", error.message);
  }
}

async function insertImages(supabase, listingId, imageUrls) {
  if (!imageUrls?.length) return;

  const payload = imageUrls.map(u => ({
    listing_id: listingId,
    image_url: u
  }));

  const { error } = await supabase.from("listing_images").insert(payload);
  if (error) {
    console.warn("Images insert warning:", error.message);
  }
}

async function main() {
  const supabase = getSupabase();
  const rawListings = await fetchListings();

  console.log(`Fetched ${rawListings.length} listings`);

  for (const raw of rawListings) {
    const { listing, flags } = enrichListing(raw);

    const listingId = await upsertListing(supabase, listing);
    await insertFlags(supabase, listingId, flags);
    await insertImages(supabase, listingId, raw.image_urls || []);

    console.log(`Upserted: ${listing.listing_url} -> ${listingId} [${listing.title_status}]`);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
