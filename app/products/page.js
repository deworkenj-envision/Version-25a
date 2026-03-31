import { products } from "../lib/products";
import ProductVisual from "../components/ProductVisual";

export default function ProductsPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16 lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Products
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Print products with stronger visual feel
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Choose the product, review finishes, and move straight into the
              upload-first order flow.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-16 lg:py-14">
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((item) => (
              <article
                key={item.slug}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="border-b border-slate-100 bg-slate-50 p-4">
                  <ProductVisual type={item.visual} />
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {item.badge}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      {item.size}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-slate-900">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-base font-medium text-slate-700">
                    {item.lead}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.finishes.map((finish) => (
                      <span
                        key={finish}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                      >
                        {finish}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm text-slate-500">
                        {item.turnaround}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-slate-900">
                        From {item.starting}
                      </div>
                    </div>

                    <a
                      href="/upload"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
                    >
                      Upload Artwork
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}