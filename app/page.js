import Link from "next/link";

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <section className="bg-[#1f4be3] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.05fr_1.25fr] lg:items-center lg:py-16">
          <div>
            <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/95 ring-1 ring-white/10">
              Premium Printing · Fast Turnaround · Professional Quality
            </div>

            <h1 className="mt-6 max-w-xl text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
              Top Quality
              <br />
              Printing at the
              <br />
              Best Prices
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-blue-100">
              Business cards, postcards, flyers, banners and more — printed
              beautifully and delivered with the professional finish your brand
              deserves.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-lg font-semibold text-[#1f4be3] shadow-sm transition hover:bg-blue-50"
              >
                Start Your Order
              </Link>

              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-2xl border border-white/40 px-7 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
              >
                Request a Quote
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/8 p-5 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
                <h2 className="text-2xl font-bold">Popular Products</h2>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    "Business Cards",
                    "Postcards",
                    "Flyers",
                    "Banners",
                    "Brochures",
                    "Yard Signs",
                  ].map((item) => (
                    <Link
                      key={item}
                      href={`/order?product=${encodeURIComponent(item)}`}
                      className="rounded-xl bg-white/10 px-4 py-3 text-base font-medium text-white transition hover:bg-white/20"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white/8 p-5 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
                <h2 className="text-2xl font-bold">We make it easy:</h2>

                <ul className="mt-5 space-y-4 text-lg text-blue-50">
                  <li className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                    <span>Pick the product you want.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                    <span>Choose the paper type, quantity and finishes.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                    <span>Upload your print-ready artwork.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                    <span>Place your order.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/10 aspect-[16/10] lg:aspect-[16/9] xl:aspect-[1.75/1]">
              <picture>
                <source media="(max-width: 640px)" srcSet="/hero_mobile.webp" />
                <source media="(max-width: 1024px)" srcSet="/hero_tablet.webp" />
                <source srcSet="/hero_desktop.webp" />
                <img
                  src="/hero_desktop_fallback.jpg"
                  alt="Print samples"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#1f4be3]">
              Popular Products
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
              Print essentials for every business
            </h2>
          </div>

          <Link
            href="/order"
            className="hidden text-lg font-semibold text-slate-800 hover:text-[#1f4be3] md:inline-flex"
          >
            View all products →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product}
              href={`/order?product=${encodeURIComponent(product)}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-2xl font-bold text-slate-950">{product}</h3>
              <p className="mt-4 text-lg leading-7 text-slate-600">
                Premium quality printing with clean, professional presentation.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#1f4be3]">
            Why Choose Us
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
            A smoother, better print ordering experience
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-950">
              Premium Print Quality
            </h3>
            <p className="mt-4 text-lg leading-7 text-slate-600">
              Sharp color, clean finishes, and professional results for every
              order.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-950">Easy Ordering</h3>
            <p className="mt-4 text-lg leading-7 text-slate-600">
              Simple product selection, fast order-artworkworkwork, and a smooth checkout
              experience.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-950">
              Fast Turnaround
            </h3>
            <p className="mt-4 text-lg leading-7 text-slate-600">
              Order quickly and keep your business moving with dependable
              production.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
