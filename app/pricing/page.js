async function getPricing() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/pricing`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!data?.success) {
      return [];
    }

    return data.pricing || [];
  } catch (err) {
    console.error("Failed to fetch pricing:", err);
    return [];
  }
}

function money(value) {
  const n = Number(value);
  return `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
}

export default async function PricingPage() {
  const pricing = await getPricing();

  // Group by product
  const grouped = {};

  pricing.forEach((row) => {
    if (!grouped[row.product_name]) {
      grouped[row.product_name] = [];
    }

    grouped[row.product_name].push(row);
  });

  // Sort each product group
  Object.keys(grouped).forEach((product) => {
    grouped[product].sort((a, b) => a.quantity - b.quantity);
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Pricing</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Live pricing pulled directly from our system.
          </p>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            No pricing available yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {Object.entries(grouped).map(([product, items]) => (
              <section
                key={product}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold text-slate-900">
                  {product}
                </h2>

                <div className="mt-6 space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${product}-${item.quantity}`}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {item.quantity}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {money(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="/order"
                  className="mt-6 block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Start Order
                </a>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}