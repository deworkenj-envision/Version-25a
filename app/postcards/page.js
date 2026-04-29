import Link from "next/link";

export const metadata = {
  title: "Custom Postcard Printing | EnVision Direct",
  description:
    "Order high-quality custom postcard printing online from EnVision Direct. Great for direct mail, promotions, announcements, coupons, and local marketing.",
  keywords: [
    "custom postcards",
    "postcard printing",
    "business postcard printing",
    "direct mail postcards",
    "promotional postcards",
    "online postcard printing",
    "EnVision Direct",
  ],
  alternates: {
    canonical: "https://www.envisiondirect.net/postcards",
  },
};

export default function PostcardsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-100">
              Custom Postcard Printing
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
              Custom Postcards for Promotions, Mailers, and Local Marketing
            </h1>

            <p className="mb-7 text-lg leading-relaxed text-blue-50">
              Promote your business, announce an event, send a coupon, or reach
              customers with professional custom postcards printed with clean
              color and sharp detail.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="rounded-md bg-white px-6 py-3 text-center font-semibold text-blue-800 shadow hover:bg-blue-50"
              >
                Start Your Postcard Order
              </Link>

              <Link
                href="/track"
                className="rounded-md border border-white px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 shadow-xl backdrop-blur">
            <div className="rounded-xl bg-white p-5 text-gray-900 shadow-lg">
              <div className="mb-4 h-56 rounded-lg bg-gradient-to-br from-blue-100 to-gray-100 p-6">
                <div className="flex h-full flex-col justify-between rounded-md border-2 border-blue-700 bg-white p-5 shadow">
                  <div>
                    <div className="mb-3 h-4 w-36 rounded bg-blue-700" />
                    <div className="mb-2 h-3 w-48 rounded bg-gray-300" />
                    <div className="h-3 w-40 rounded bg-gray-300" />
                  </div>

                  <div>
                    <div className="mb-3 h-14 rounded bg-blue-100" />
                    <div className="h-8 w-28 rounded bg-blue-700" />
                  </div>
                </div>
              </div>

              <p className="text-center text-sm font-medium text-gray-700">
                Postcards for mailers, coupons, announcements, and promotions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Popular Sizes</h2>
            <p className="text-gray-700">
              Choose standard postcard sizes for promotions, mailers, coupons,
              invitations, and announcements.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Marketing Ready</h2>
            <p className="text-gray-700">
              Great for direct mail campaigns, local promotions, real estate,
              restaurants, events, and service businesses.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Easy Online Ordering</h2>
            <p className="text-gray-700">
              Upload your postcard artwork, choose your options, and place your
              order online quickly.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-6 text-3xl font-bold">
            Custom Postcards for Business Marketing
          </h2>

          <div className="space-y-5 text-gray-700">
            <p>
              Postcards are a practical and affordable way to promote your
              business, share announcements, send coupons, and reach customers.
              EnVision Direct makes it easy to order custom postcard printing
              online.
            </p>

            <p>
              Whether you need postcards for direct mail, handouts, events,
              real estate marketing, restaurant promotions, or local advertising,
              our online ordering process keeps it simple.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/order"
              className="inline-block rounded-md bg-blue-700 px-7 py-3 font-semibold text-white shadow hover:bg-blue-800"
            >
              Order Postcards Online
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-3xl font-bold">Common Postcard Uses</h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            "Direct mail",
            "Coupons",
            "Event announcements",
            "Real estate marketing",
            "Restaurant promotions",
            "Grand openings",
            "Service reminders",
            "Local advertising",
            "Customer follow-ups",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border bg-white px-5 py-4 font-medium shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Print Your Postcards?
          </h2>

          <p className="mx-auto mb-7 max-w-2xl text-blue-100">
            Start your postcard order online and upload your artwork when you
            are ready.
          </p>

          <Link
            href="/order"
            className="inline-block rounded-md bg-white px-8 py-3 font-semibold text-blue-800 shadow hover:bg-blue-50"
          >
            Start Postcard Order
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="border-t pt-8">
          <h3 className="mb-4 text-lg font-semibold">
            Explore Other Printing Products
          </h3>

          <div className="flex flex-wrap gap-4">
            <Link href="/business-cards" className="text-blue-600 hover:underline">
              Business Cards
            </Link>
            <Link href="/flyers" className="text-blue-600 hover:underline">
              Flyers
            </Link>
            <Link href="/banners" className="text-blue-600 hover:underline">
              Banners
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}