async function getOrder(orderNumber) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/orders`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load order");
  }

  const data = await response.json();
  const orders = data.orders || [];

  return orders.find((order) => order.order_number === orderNumber) || null;
}

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams;
  const orderNumber = params?.order || "";
  const order = orderNumber ? await getOrder(orderNumber) : null;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div
          className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${
            order?.status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {order?.status === "paid" ? "Payment Received" : "Order Received"}
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight">
          {order?.status === "paid"
            ? "Your order is confirmed"
            : "Your order has been received"}
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          {order
            ? "Here are the live details from your saved order."
            : "We could not load the full order details, but your request was submitted."}
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Order Number</span>
            <span className="font-semibold text-slate-900">
              {order?.order_number || orderNumber || "Unavailable"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Product</span>
            <span className="font-semibold text-slate-900">
              {order?.product_name || "Unavailable"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Quantity</span>
            <span className="font-semibold text-slate-900">
              {order?.quantity || "Unavailable"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Paper</span>
            <span className="font-semibold text-slate-900">
              {order?.paper || "Unavailable"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Finish</span>
            <span className="font-semibold text-slate-900">
              {order?.finish || "Unavailable"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <span
              className={`font-semibold ${
                order?.status === "paid"
                  ? "text-green-700"
                  : "text-amber-700"
              }`}
            >
              {order?.status || "pending_review"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/products"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Start Another Order
          </a>
          <a
            href="/"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}