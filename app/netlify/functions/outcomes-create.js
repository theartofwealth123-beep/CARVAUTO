const { getSupabase } = require("./_supabase");

exports.handler = async (event, context) => {
  try {
    const supabase = getSupabase();

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { listing_id, offered_price, accepted_price, outcome, reason } = body;

    if (!listing_id || !outcome) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const { data, error } = await supabase
      .from('outcomes')
      .insert({
        listing_id,
        offered_price: offered_price ? parseInt(offered_price) : null,
        accepted_price: accepted_price ? parseInt(accepted_price) : null,
        outcome,
        reason
      })
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};