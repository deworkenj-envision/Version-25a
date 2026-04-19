import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

export default async function PackingSlipPage({ params }) {
  const { id } = params;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) {
    return <div className="p-10">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-white p-10 text-black">
      <div className="max-w-3xl mx-auto border p-8">

        <h1 className="text-2xl font-bold mb-4">EnVision Direct</h1>
        <h2 className="text-xl mb-6">Packing Slip</h2>

        <p><strong>Order #:</strong> {order.order_number}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>

        <div className="mt-6">
          <h3 className="font-semibold">Customer</h3>
          <p>{order.customer_name}</p>
          <p>{order.customer_email}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Product</h3>
          <p>{order.product_name}</p>
          <p>{order.size} / {order.paper} / {order.finish} / {order.sides}</p>
          <p>Qty: {order.quantity}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Artwork</h3>
          {order.artwork_url && (
            <a href={order.artwork_url} target="_blank" className="text-blue-600 underline">
              Download Artwork
            </a>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Shipping</h3>
          <p>Carrier: {order.tracking_carrier || "N/A"}</p>
          <p>Tracking: {order.tracking_number || "N/A"}</p>
        </div>

      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `window.onload = () => window.print();`,
        }}
      />
    </div>
  );
}