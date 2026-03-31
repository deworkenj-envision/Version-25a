export default function HomePage() {
  const products = [
    "Business Cards",
    "Postcards",
    "Flyers",
    "Banners",
    "Brochures",
    "Yard Signs",
    "Stickers",
    "Booklets",
  ];

  const steps = [
    "Pick the product you want.",
    "Choose the paper type, quantity and finishes.",
    "Upload your print-ready artwork.",
    "Place your order.",
  ];

  const features = [
    {
      title: "Premium Print Quality",
      text: "Sharp color, clean finishes, and professional results for every order.",
    },
    {
      title: "Easy Ordering",
      text: "Simple product selection, fast uploads, and a smooth checkout experience.",
    },
    {
      title: "Fast Turnaround",
      text: "Order quickly and keep your business moving with dependable production.",
    },
  ];

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.06),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 md:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
              Premium Printing • Fast Turnaround • Professional Quality
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Top Quality Printing at the Best Prices
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Business cards, postcards, flyers, banners and more — printed beautifully
              and delivered with the professional finish your brand deserves.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Start Your Order
              </a>

              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Request a Quote
              </a>
            </div>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200/50">
              <h2 className="text-lg font-semibold text-slate-900">
                We make it easy:
              </h2>

              <ul className="mt-4 space-y-3 text-sm text-slate-700 sm:text-base">
                {steps.map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-blue-100/60 via-transparent to-slate-100/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet="/hero_mobile.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 1280px)"
                  srcSet="/hero_tablet.webp"
                  type="image/webp"
                />
                <source srcSet="/hero_desktop.webp" type="image/webp" />
                <img
                  src="/hero_desktop_fallback.jpg"
                  alt="Printed products including postcards, business cards, flyers, and banners"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Popular Products
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Print essentials for every business
              </h2>
            </div>

            <a
              href="/products"
              className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              View all products →
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <a
                key={product}
                href="/products"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                  {product}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Premium quality printing with clean, professional presentation.
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              A smoother, better print ordering experience
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-16">
          <div className="overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-10 text-white shadow-2xl md:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Ready to Order?
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Start your next print project today
                </h2>
                <p className="mt-4 max-w-2xl text-slate-300">
                  Upload your artwork, choose your options, and place your order with confidence.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <a
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-400"
                >
                  Start Your Order
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/15"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}