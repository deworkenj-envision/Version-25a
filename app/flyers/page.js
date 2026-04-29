import Link from "next/link";

export const metadata = {
  title: "Flyer Printing | EnVision Direct",
  description:
    "Order high-quality flyers online from EnVision Direct. Perfect for promotions, events, and marketing with fast turnaround and nationwide delivery.",
};

export default function FlyersPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-blue-950 px-8 py-14 text-white shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-200">
            Powerful Marketing Tools
          </p>

          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Flyer Printing
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-blue-50">
            Spread your message with professionally printed flyers designed for
            promotions, events, and local marketing. EnVision Direct makes it
            easy to order flyers online with vibrant color and clean, sharp
            detail.
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
            <h2 className="mb-2 text-xl font-semibold">High Impact Design</h2>
            <p className="text-gray-700">
              Full-color flyer printing that grabs attention and delivers your
              message clearly.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">Versatile Use</h2>
            <p className="text-gray-700">
              Perfect for events, promotions, menus, handouts, and local
              advertising.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadowE-sm">
            <h2 className="mb-2 text-xl font-semibold">Fast Turnaround</h2>
            <p className="text-gray-700">
              Order online quickly and receive your flyers delivered straight to
              your door.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h3 className="mb-3 text-xl font-semibold">
          Color Flyers & Brochures To Make Your Marketing Look Great!
        </h3>

        <p className="text-gray-700">
          EnVision Direct provides flyer and brochure printing services for customers
          all around the country. Whether you are promoting an event, advertising a business, or sharing important
          information, you can order online with fast turnaround and have your
          flyers delivered directly to your door.
        </p>
      </section>
    </main>
  );
}