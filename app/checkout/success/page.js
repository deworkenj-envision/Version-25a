export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
          Payment Received
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
          Thank you for your order
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Your payment was submitted successfully. We received your order and will
          begin processing it shortly.
        </p>

        <div className="mt-8">
          <a
            href="/"
            className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Return Home
          </a>
        </div>
      </div>
    </main>
  );
}
