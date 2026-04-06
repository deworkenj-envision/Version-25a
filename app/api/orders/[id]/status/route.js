const param = params.id;

// detect if it's UUID or order number
const isUUID = /^[0-9a-fA-F-]{36}$/.test(param);

const query = supabaseAdmin.from("orders").select("*");

const { data: order, error } = await query
  .eq(isUUID ? "id" : "order_number", param)
  .single();