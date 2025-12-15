import { getSupabase } from "./_supabase.js";

export async function handler(event) {
  try {
    const supabase = getSupabase();
    const params = event.queryStringParameters || {};

    const marketId = params.market_id || null;
    const minPrice = params.min_price ? parseInt(params.min_price, 10) : null;
    const maxPrice = params.max_price ? parseInt(params.max_price, 10) : null;
    const minMiles = params.min_miles ? parseInt(params.min_miles, 10) : null;
    const maxMiles = params.max_miles ? parseInt(params.max_miles, 10) : null;
    const minScore = params.min_score ? parseInt(params.min_score, 10) : 0;

    const includeUnknown = params.include_unknown === "true";
    const includeRisk = params.include_risk === "true";

    // Clean-title-only enforcement:
    // Default is CLEAN only. You can explicitly include UNKNOWN/RISK for admin review.
    let statuses = ["CLEAN"];
    if (includeUnknown) statuses.push("UNKNOWN");
    if (includeRisk) statuses.push("RISK");

    let q = supabase
      .from("listings")
      .select(
        "id, listing_url, title, price, year, make, model, trim, mileage, market_id, title_status, deal_score, confidence, plate_detected, vin_text_detected, vin_label_detected, expected_spread, target_buy_private, target_buy_wholesale"
      )
      .in("title_status", statuses)
      .order("deal_score", { ascending: false })
      .limit(200);

    if (marketId) q = q.eq("market_id", marketId);
    if (minPrice !== null) q = q.gte("price", minPrice);
    if (maxPrice !== null) q = q.lte("price", maxPrice);
    if (minMiles !== null) q = q.gte("mileage", minMiles);
    if (maxMiles !== null) q = q.lte("mileage", maxMiles);
    if (minScore) q = q.gte("deal_score", minScore);

    const { data, error } = await q;
    if (error) throw error;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || "Unknown error" }) };
  }
}
