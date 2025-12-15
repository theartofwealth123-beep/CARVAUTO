const { getSupabase } = require("./_supabase");

exports.handler = async (event, context) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('markets')
      .select('id, name, state')
      .order('name');

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