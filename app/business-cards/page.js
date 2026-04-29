import Link from "next/link";

export const metadata = {
  title: "Custom Business Card Printing | EnVision Direct",
  description:
    "Order high-quality custom business card printing online from EnVision Direct. Professional business cards with fast turnaround, clean printing, and easy online ordering.",
  keywords: [
    "business cards",
    "business card printing",
    "custom business cards",
    "professional business cards",
    "online business card printing",
    "EnVision Direct",
  ],
  alternates: {
    canonical: "https://www.envisiondirect.net/business-cards",
  },
};

export default function BusinessCardsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-100">
              Custom Business Card Printing
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
              Professional Business Cards That Make a Strong First Impression
            </h1>

            <p className="mb-7 text-lg leading-relaxed text-blue-50">
              Order custom business cards online with clean printing,
              professional quality, and fast turnaround.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="rounded-md bg-white px-6 py-3 text-center font-semibold text-blue-800 shadow hover:bg-blue-50"
              >
                Start Your Business Card Order
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
                <div className="mx-auto flex h-full max-w-sm flex-col justify-between rounded-lg border border-blue-700 bg-white p-5 shadow">
                  <div>
                    <div className="mb-4 h-5 w-36 rounded bg-blue-700" />
                    <div className="mb-2 h-3 w-48 rounded bg-gray-300" />
                    <div className="h-3 w-40 rounded bg-gray-300" />
                  </div>

                  <div>
                    <div className="mb-2 h-3 w-32 rounded bg-gray-300" />
                    <div className="h-3 w-44 rounded bg-gray-300" />
                  </div>
                </div>
              </div>

              <p className="text-center text-sm font-medium text-gray-700">
                Business cards for professionals, teams, and small businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Professional Quality</h2>
            <p className="text-gray-700">
              Business cards printed with clean color, sharp text, and a polished
              professional look.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Easy Ordering</h2>
            <p className="text-gray-700">
              Upload your artwork, select your options, and place your order
              online quickly.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Great for Businesses</h2>
            <p className="text-gray-700">
              Perfect for owners, sales teams, real estate agents, contractors,
              consultants, and local businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-6 text-3xl font-bold">
            Custom Business Cards for Your Brand
          </h2>

          <div className="space-y-5 text-gray-700">
            <p>
              Business cards are still one of the easiest ways to share your
              contact information and make your brand memorable. EnVision Direct
              makes it simple to order custom business card printing online.
            </p>

            <p>
              Whether you need cards for yourself, your staff, your sales team,
              or your next event, we help you get professional business cards
              with a smooth online ordering process.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/order"
              className="inline-block rounded-md bg-blue-700 px-7 py-3 font-semibold text-white shadow hover:bg-blue-800"
            >
              Order Business Cards Online
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-3xl font-bold">Common Business Card Uses</h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            "Small businesses",
            "Sales teams",
            "Real estate agents",
            "Contractors",
            "Consultants",
            "Networking events",
            "Trade shows",
            "Professional services",
            "Local marketing",
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
            Ready to Print Your Business Cards?
          </h2>

          <p className="mx-auto mb-7 max-w-2xl text-blue-100">
            Start your business card order online and upload your artwork when
            you are ready.
          </p>

          <Link
            href="/order"
            className="inline-block rounded-md bg-white px-8 py-3 font-semibold text-blue-800 shadow hover:bg-blue-50"
          >
            Start Business Card Order
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="border-t pt-8">
          <h3 className="mb-4 text-lg font-semibold">
            Explore Other Printing Products
          </h3>

          <div className="flex flex-wrap gap-4">
            <Link href="/postcards" className="text-blue-600 hover:underline">
              Postcards
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