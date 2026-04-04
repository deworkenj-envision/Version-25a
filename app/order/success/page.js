export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 p-10 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful
        </h1>

        <p className="text-gray-700 mb-8">
          Thank you. Your payment was completed successfully.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/admin/orders"
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            View Orders
          </a>

          <a
            href="/order"
            className="rounded-lg bg-gray-900 px-5 py-3 text-white"
          >
            Place Another Order
          </a>
        </div>
      </div>
    </main>
  );
}
