import Link from "next/link";

export const metadata = {
  title: "Custom Banner Printing | EnVision Direct",
  description:
    "Order high-quality custom banner printing online from EnVision Direct. Great for business promotions, events, trade shows, storefronts, grand openings, and local marketing.",
  keywords: [
    "custom banners",
    "banner printing",
    "vinyl banners",
    "business banner printing",
    "event banners",
    "promotional banners",
    "online banner printing",
    "EnVision Direct",
  ],
  alternates: {
    canonical: "https://www.envisiondirect.net/banners",
  },
};

export default function BannersPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-100">
              Custom Banner Printing
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
              Durable Custom Banners for Business, Events, and Promotions
            </h1>

            <p className="mb-7 text-lg leading-relaxed text-blue-50">
              Promote your business, event, sale, grand opening, or special
              announcement with professional custom banners designed to get
              attention.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="rounded-md bg-white px-6 py-3 text-center font-semibold text-blue-800 shadow hover:bg-blue-50"
              >
                Start Your Banner Order
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
                <div className="flex h-full flex-col justify-between rounded-md border-4 border-blue-700 bg-white p-5 shadow">
                  <div>
                    <div className="mb-4 h-5 w-40 rounded bg-blue-700" />
                    <div className="mb-2 h-3 w-52 rounded bg-gray-300" />
                    <div className="h-3 w-44 rounded bg-gray-300" />
                  </div>

                  <div className="rounded bg-blue-700 px-4 py-3 text-center text-sm font-bold text-white">
                    GRAND OPENING
                  </div>
                </div>
              </div>

              <p className="text-center text-sm font-medium text-gray-700">
                Banners for storefronts, events, sales, trade shows, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Popular Banner Uses</h2>
            <p className="text-gray-700">
              Great for grand openings, sales, trade shows, events, storefront
              displays, directional signs, and local promotions.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Professional Look</h2>
            <p className="text-gray-700">
              Custom banners help your message stand out with bold graphics,
              clean color, and easy-to-read designs.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Easy Online Ordering</h2>
            <p className="text-gray-700">
              Select your banner options, upload your artwork, and place your
              order online quickly.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-6 text-3xl font-bold">
            Custom Banners for Local Business Marketing
          </h2>

          <div className="space-y-5 text-gray-700">
            <p>
              Banners are one of the most visible ways to advertise your
              business, event, sale, or special promotion. Whether you need a
              banner for a storefront, grand opening, trade show, school event,
              church event, fundraiser, or local campaign, EnVision Direct makes
              it easy to order banner printing online.
            </p>

            <p>
              Custom banner printing is ideal for businesses and organizations
              that need a large, clear, professional display without complicated
              ordering. Upload your artwork, choose your options, and start your
              banner order online.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/order"
              className="inline-block rounded-md bg-blue-700 px-7 py-3 font-semibold text-white shadow hover:bg-blue-800"
            >
              Order Banners Online
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-3xl font-bold">Common Banner Uses</h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            "Grand openings",
            "Storefront promotions",
            "Trade shows",
            "Event signage",
            "Sales and specials",
            "School events",
            "Church events",
            "Fundraisers",
            "Local advertising",
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
            Ready to Print Your Banner?
          </h2>

          <p className="mx-auto mb-7 max-w-2xl text-blue-100">
            Start your banner order online and upload your artwork when you are
            ready.
          </p>

          <Link
            href="/order"
            className="inline-block rounded-md bg-white px-8 py-3 font-semibold text-blue-800 shadow hover:bg-blue-50"
          >
            Start Banner Order
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
            <Link href="/postcards" className="text-blue-600 hover:underline">
              Postcards
            </Link>
            <Link href="/flyers" className="text-blue-600 hover:underline">
              Flyers
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}