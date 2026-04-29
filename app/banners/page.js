import Link from "next/link";

export const metadata = {
  title: "Banner Printing | EnVision Direct",
  description:
    "Order high-quality banners online from EnVision Direct. Perfect for events, promotions, and signage with fast turnaround and nationwide delivery.",
};

export default function BannersPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-blue-950 px-8 py-14 text-white shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-200">
            Large Format Printing
          </p>

          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Banner Printing
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-blue-50">
            Get noticed with durable, high-quality banners designed for indoor
            and outdoor use. EnVision Direct makes it easy to order banners
            online with bold colors, strong materials, and professional
            finishing.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/order"
              className="rounded-full bg-white px-6 py-3 font-semibold text-blue-950 shadow hover:bg-blue-50"
            >
              Start Your Order
            </Link>

            <Link
              href="/track"
              className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Durable Materials</h2>
            <p className="text-gray-700">
              Strong vinyl banner options built to withstand indoor and outdoor
              conditions.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">High Visibility</h2>
            <p className="text-gray-700">
              Bold, vibrant printing that ensures your message is seen from a
              distance.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Custom Sizes</h2>
            <p className="text-gray-700">
              Choose the size that fits your needs for events, storefronts, or
              promotions.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h3 className="mb-3 text-xl font-semibold">
          Top Quality Banner Printing At The Best Prices
        </h3>

        <p className="text-gray-700">
         <p className="text-gray-700">
            EnVision Direct provides online banner printing services nationwide.
            Whether you need banners for events, business promotions, or signage,
            you can order online with fast turnaround and have your banners
            delivered directly to your door, including customers in Huntington
            Beach and across Orange County.
</p>
        </p>
      </section>
    </main>
  );
}