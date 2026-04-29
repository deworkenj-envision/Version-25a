import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Custom Flyer Printing | EnVision Direct",
  description:
    "Order high-quality custom flyer printing online from EnVision Direct. Great for promotions, events, sales, menus, announcements, and local marketing.",
  keywords: [
    "custom flyers",
    "flyer printing",
    "business flyer printing",
    "event flyers",
    "promotional flyers",
    "online flyer printing",
    "EnVision Direct",
  ],
  alternates: {
    canonical: "https://www.envisiondirect.net/flyers",
  },
};

export default function FlyersPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-100">
              Custom Flyer Printing
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
              High-Quality Flyers That Help Your Business Get Noticed
            </h1>

            <p className="mb-7 text-lg leading-relaxed text-blue-50">
              Promote your business, event, sale, menu, service, or special
              announcement with professional custom flyers printed with clean
              color, sharp detail, and fast turnaround.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="rounded-md bg-white px-6 py-3 text-center font-semibold text-blue-800 shadow hover:bg-blue-50"
              >
                Start Your Flyer Order
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
                    <div className="mb-3 h-4 w-32 rounded bg-blue-700" />
                    <div className="mb-2 h-3 w-44 rounded bg-gray-300" />
                    <div className="h-3 w-36 rounded bg-gray-300" />
                  </div>

                  <div>
                    <div className="mb-3 h-16 rounded bg-blue-100" />
                    <div className="h-8 w-28 rounded bg-blue-700" />
                  </div>
                </div>
              </div>

              <p className="text-center text-sm font-medium text-gray-700">
                Flyers for promotions, events, sales, menus, and more.
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
              Choose standard flyer sizes like 8.5 x 11, 5.5 x 8.5, or other
              options available during ordering.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Professional Finish</h2>
            <p className="text-gray-700">
              Great for full-color designs, promotional graphics, coupons,
              menus, handouts, and local advertising.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Easy Online Ordering</h2>
            <p className="text-gray-700">
              Upload your artwork, select your quantity and options, then place
              your flyer order online.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-6 text-3xl font-bold">
            Custom Flyers for Business Marketing
          </h2>

          <div className="space-y-5 text-gray-700">
            <p>
              Flyers are one of the most useful and affordable ways to promote
              your business. Whether you need flyers for a grand opening, sale,
              event, restaurant menu, real estate promotion, nonprofit campaign,
              or local service, EnVision Direct makes it easy to order custom
              flyer printing online.
            </p>

            <p>
              Our flyer printing options are ideal for small businesses,
              organizations, schools, churches, restaurants, contractors, real
              estate professionals, and event promoters who need professional
              marketing materials without the hassle.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/order"
              className="inline-block rounded-md bg-blue-700 px-7 py-3 font-semibold text-white shadow hover:bg-blue-800"
            >
              Order Flyers Online
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-3xl font-bold">Common Flyer Uses</h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            "Business promotions",
            "Event announcements",
            "Restaurant menus",
            "Grand openings",
            "Coupons and specials",
            "Real estate flyers",
            "Service advertising",
            "Fundraisers",
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
            Ready to Print Your Flyers?
          </h2>

          <p className="mx-auto mb-7 max-w-2xl text-blue-100">
            Start your flyer order online and upload your artwork when you are
            ready.
          </p>

          <Link
            href="/order"
            className="inline-block rounded-md bg-white px-8 py-3 font-semibold text-blue-800 shadow hover:bg-blue-50"
          >
            Start Flyer Order
          </Link>
        </div>
      </section>
    </main>
  );
}