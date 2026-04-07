function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function money(value) {
  return `$${toNumber(value).toFixed(2)}`;
}

const pricingData = [
  {
    product: "Business Cards",
    options: [
      { quantity: 100, price: 24.99 },
      { quantity: 250, price: 39.99 },
      { quantity: 500, price: 59.99 },
      { quantity: 1000, price: 89.99 },
    ],
  },
  {
    product: "Flyers",
    options: [
      { quantity: 100, price: 49.99 },
      { quantity: 250, price: 79.99 },
      { quantity: 500, price: 119.99 },
      { quantity: 1000, price: 189.99 },
    ],
  },
  {
    product: "Postcards",
    options: [
      { quantity: 100, price: 54.99 },
      { quantity: 250, price: 84.99 },
      { quantity: 500, price: 129.99 },
      { quantity: 1000, price: 209.99 },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Pricing</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Clear starting prices for our most popular print products.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingData.map((group) => (
            <section
              key={group.product}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-slate-900">
                {group.product}
              </h2>

              <div className="mt-6 space-y-3">
                {group.options.map((item) => (
                  <div
                    key={`${group.product}-${item.quantity}`}
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
      </div>
    </main>
  );
}