export default function HomePage() {
  const products = [
    {
      name: "Business Cards",
      desc: "Premium cards with clean finishes, sharp detail, and fast turnaround.",
    },
    {
      name: "Flyers",
      desc: "High-impact promotional prints for events, menus, and local marketing.",
    },
    {
      name: "Postcards",
      desc: "Professional direct-mail and handout pieces with durable print quality.",
    },
    {
      name: "Brochures",
      desc: "Folded marketing materials that look polished and presentation-ready.",
    },
  ];

  const steps = [
    "Pick the product you want",
    "Choose the paper type, quantity, and finishes",
    "Upload your print-ready artwork",
    "Place your order",
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="bg-[#17307a] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          {/* LEFT */}
          <div>
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-blue-100">
              Professional printing for business and marketing
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-5xl xl:text-6xl">
              Top Quality Printing at the Best Prices
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Business cards, flyers, postcards, brochures, and more — printed
              with a clean professional finish and an easy online ordering
              experience.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/order"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Start Order
              </a>

              <a
                href="/track-order"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-transparent px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Track Order
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
                  Popular products
                </p>
                <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm font-medium text-white">
                  <span>Business Cards</span>
                  <span>Flyers</span>
                  <span>Postcards</span>
                  <span>Brochures</span>
                  <span>Rack Cards</span>
                  <span>Menus</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
                  We make it easy
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white">
                  {steps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-[2px]">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-3xl shadow-2xl sm:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1400&q=80"
                alt="Premium print samples on desk"
                className="h-[320px] w-full object-cover md:h-[380px]"
              />
            </div>

            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
                alt="Printed business cards"
                className="h-48 w-full object-cover"
              />
            </div>

            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80"
                alt="Marketing print materials"
                className="h-48 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-6 text-sm text-slate-600 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 px-5 py-4 font-medium">
            Premium print quality
          </div>
          <div className="rounded-2xl bg-slate-50 px-5 py-4 font-medium">
            Easy online ordering
          </div>
          <div className="rounded-2xl bg-slate-50 px-5 py-4 font-medium">
            Track your order online
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Popular Products
            </h2>
            <p className="mt-3 text-slate-600">
              Start with the items most customers order and customize your paper,
              quantity, finish, and print options.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.name}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
                  {product.name.charAt(0)}
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {product.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {product.desc}
                </p>

                <a
                  href="/order"
                  className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Start Order
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Simple ordering from start to finish
              </h2>
              <p className="mt-4 max-w-xl text-slate-600">
                The goal is to make professional printing easy. Choose your
                specs, upload artwork, pay securely, and track progress online.
              </p>

              <a
                href="/order"
                className="mt-8 inline-flex rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Start Your Order
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-blue-700 shadow-sm">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-base font-semibold text-slate-900">
                    {step}
                  </p>
                </div>
              ))}

              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 md:col-span-2">
                <p className="text-base font-semibold text-slate-900">
                  Already placed an order?
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Use your order number to check production and shipping status.
                </p>
                <a
                  href="/track-order"
                  className="mt-4 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-slate-100"
                >
                  Track Your Order
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to place your print order?
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Customize your order, upload artwork, and continue to secure
              payment in just a few steps.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/order"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Order
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}