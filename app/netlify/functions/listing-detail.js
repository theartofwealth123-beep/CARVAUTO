const { getSupabase } = require("./_supabase");

exports.handler = async (event, context) => {
  try {
    const supabase = getSupabase();
    const { id } = event.queryStringParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing id' })
      };
    }

    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (listingError) throw listingError;

    const { data: flags, error: flagsError } = await supabase
      .from('listing_flags')
      .select('flag_type, confidence, evidence')
      .eq('listing_id', id);

    if (flagsError) throw flagsError;

    const { data: images, error: imagesError } = await supabase
      .from('listing_images')
      .select('image_url')
      .eq('listing_id', id);

    if (imagesError) throw imagesError;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing, flags, images })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};