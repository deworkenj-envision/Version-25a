import Link from "next/link";

export const metadata = {
  title: "Postcard Printing | EnVision Direct",
  description:
    "Order high-quality postcards online from EnVision Direct. Perfect for marketing, mailers, and promotions with fast turnaround and delivery nationwide.",
};

export default function PostcardsPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-blue-950 px-8 py-14 text-white shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-200">
            Marketing Made Easy
          </p>

          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Postcard Printing
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-blue-50">
            Promote your business with high-quality postcards designed for
            direct mail, handouts, and marketing campaigns. EnVision Direct
            makes it simple to order postcards online with vibrant color and
            professional finishes.
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
            <h2 className="mb-2 text-xl font-semibold">Bold Colors</h2>
            <p className="text-gray-700">
              Eye-catching, full-color printing that makes your message stand
              out.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Perfect for Marketing</h2>
            <p className="text-gray-700">
              Ideal for promotions, mail campaigns, announcements, and brand
              awareness.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Fast Delivery</h2>
            <p className="text-gray-700">
              Order online and get your postcards delivered directly to your
              door.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h3 className="mb-3 text-xl font-semibold">
          Postcard Printing For All Of Your Marketing Needs
        </h3>

        <p className="text-gray-700">
          EnVision Direct provides top-quality postcard printing services for
          customers across the country. Whether you're promoting a sale, launching a campaign, or sending
          announcements, you can order online with fast turnaround and have your
          postcards delivered directly to your door.
        </p>
      </section>
    </main>
  );
}