import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">EnVision Direct</h1>
            <p className="text-sm text-gray-600">
              Premium Printing Services
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-semibold">Packing Slip</h2>
            <p className="text-sm">Order #: {order.order_number}</p>
            <p className="text-sm">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Customer</h3>
          <p>{order.customer_name}</p>
          <p className="text-sm text-gray-600">{order.customer_email}</p>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Details</h3>

          <div className="border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Specs</th>
                  <th className="p-2 text-center">Qty</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2">{order.product_name}</td>
                  <td className="p-2">
                    {order.size} / {order.paper} / {order.finish} / {order.sides}
                  </td>
                  <td className="p-2 text-center">{order.quantity}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* NOTES */}
        {order.notes && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}

        {/* ARTWORK */}
        {order.artwork_url && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Artwork</h3>
            <a
              href={order.artwork_url}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              Download Artwork
            </a>
          </div>
        )}

        {/* SHIPPING */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Shipping</h3>
          <p className="text-sm">
            Carrier: {order.tracking_carrier || "N/A"}
          </p>
          <p className="text-sm">
            Tracking #: {order.tracking_number || "N/A"}
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-xs text-gray-500">
          Thank you for your order!
        </div>

      </div>

      {/* AUTO PRINT */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.onload = () => {
              window.print();
            }
          `,
        }}
      />
    </div>
  );
}