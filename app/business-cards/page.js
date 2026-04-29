import Link from "next/link";

export const metadata = {
  title: "Business Card Printing | EnVision Direct",
  description:
    "Order high-quality business cards online from EnVision Direct. Fast turnaround, professional printing, and delivery available in Huntington Beach, Orange County, and nationwide.",
};

export default function BusinessCardsPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-blue-950 px-8 py-14 text-white shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-200">
            Professional Printing
          </p>

          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Business Card Printing
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-blue-50">
            Make a strong first impression with premium business cards printed
            with clean color, sharp detail, and professional finishing options.
            EnVision Direct makes it easy to order business cards online and
            have them delivered directly to your door.
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
            <h2 className="mb-2 text-xl font-semibold">Premium Quality</h2>
            <p className="text-gray-700">
              Crisp printing, clean edges, and professional paper options for a
              polished business card.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Easy Online Ordering</h2>
            <p className="text-gray-700">
              Upload your artwork, choose your options, and complete checkout
              securely online.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Delivered to You</h2>
            <p className="text-gray-700">
              We are an online print provider, so your finished order ships
              directly to your address.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h3 className="mb-3 text-xl font-semibold">
          Quality Business Card Printing To Make A Great Impression
        </h3>

        <p className="text-gray-700">
          EnVision Direct provides business card printing services for
          customers nationwide. Whether you need business cards for networking,sales meetings,
          events, or everyday brand promotion, you can order online with fast
          turnaround and have your prints delivered directly to your door.
        </p>
      </section>
    </main>
  );
}