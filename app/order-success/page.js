export default function OrderSuccessPage({ searchParams }) {
  const order = searchParams?.order || "PL-000000";
  const product = searchParams?.product || "Print Product";
  const qty = searchParams?.qty || "500";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="inline-flex rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
          Order Received
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight">
          Your order has been placed
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          This is a demo confirmation page for your fake order flow.
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Order Number</span>
            <span className="font-semibold text-slate-900">{order}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Product</span>
            <span className="font-semibold text-slate-900">{product}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Quantity</span>
            <span className="font-semibold text-slate-900">{qty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <span className="font-semibold text-green-700">Pending review</span>
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