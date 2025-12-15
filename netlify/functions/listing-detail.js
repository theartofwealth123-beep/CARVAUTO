import { getSupabase } from "./_supabase.js";

export async function handler(event) {
  try {
    const supabase = getSupabase();
    const id = event.queryStringParameters?.id;

    if (!id) return { statusCode: 400, body: JSON.stringify({ error: "Missing id" }) };

    const { data: listing, error: e1 } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();
    if (e1) throw e1;

    const { data: flags, error: e2 } = await supabase
      .from("listing_flags")
      .select("*")
      .eq("listing_id", id)
      .order("confidence", { ascending: false });
    if (e2) throw e2;

    const { data: images, error: e3 } = await supabase
      .from("listing_images")
      .select("*")
      .eq("listing_id", id);
    if (e3) throw e3;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listing, flags, images })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || "Unknown error" }) };
  }
}
