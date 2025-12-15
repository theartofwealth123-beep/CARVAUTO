const { getSupabase } = require("./_supabase");

exports.handler = async (event, context) => {
  try {
    const supabase = getSupabase();
    const query = event.queryStringParameters || {};

    let q = supabase
      .from('listings')
      .select(`
        id, market_id, listing_url, title, price, location_text,
        year, make, model, trim, mileage, title_status, deal_score,
        vin_masked, plate_detected, vin_label_detected, vin_text_detected
      `)
      .order('deal_score', { ascending: false });

    if (query.market_id) {
      q = q.eq('market_id', query.market_id);
    }

    if (query.min_score) {
      q = q.gte('deal_score', parseInt(query.min_score));
    }

    if (query.min_price) {
      q = q.gte('price', parseInt(query.min_price));
    }

    if (query.max_price) {
      q = q.lte('price', parseInt(query.max_price));
    }

    if (query.min_miles) {
      q = q.gte('mileage', parseInt(query.min_miles));
    }

    if (query.max_miles) {
      q = q.lte('mileage', parseInt(query.max_miles));
    }

    let titleStatuses = ['CLEAN'];
    if (query.include_unknown === 'true') {
      titleStatuses.push('UNKNOWN');
    }
    if (query.include_risk === 'true') {
      titleStatuses.push('RISK');
    }
    q = q.in('title_status', titleStatuses);

    const { data, error } = await q.limit(100);

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