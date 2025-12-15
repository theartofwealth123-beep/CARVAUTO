import { getSupabase } from "./_supabase.js";

export async function handler() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("markets")
      .select("id, name, state, radius_miles")
      .order("name", { ascending: true });

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
