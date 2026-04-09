"use client";

import Link from "next/link";

const quickCategories = [
  { name: "Business Cards", href: "/order?product=Business%20Cards" },
  { name: "Flyers", href: "/order?product=Flyers" },
  { name: "Postcards", href: "/order?product=Postcards" },
  { name: "Banners", href: "/order?product=Banners" },
  { name: "Yard Signs", href: "/order?product=Yard%20Signs" },
  { name: "Brochures", href: "/order?product=Brochures" },
];

const featuredProducts = [
  {
    name: "Business Cards",
    desc: "Professional cards for networking, handouts, and everyday business use.",
    href: "/order?product=Business%20Cards",
    badge: "Best Seller",
  },
  {
    name: "Flyers",
    desc: "Simple, effective marketing prints for promotions, events, and menus.",
    href: "/order?product=Flyers",
    badge: "Popular",
  },
  {
    name: "Postcards",
    desc: "Great for direct mail, special offers, announcements, and promotions.",
    href: "/order?product=Postcards",
    badge: "Great for Mailers",
  },
  {
    name: "Banners",
    desc: "Large-format signage for storefronts, trade shows, and outdoor visibility.",
    href: "/order?product=Banners",
    badge: "Large Format",
  },
];

const reasons = [
  {
    title: "Upload your own artwork",
    text: "Already have a print-ready file? Send it with your order and keep things moving.",
  },
  {
    title: "Track your order online",
    text: "Customers can check production and shipping progress from the tracking page.",
  },
  {
    title: "Simple checkout flow",
    text: "A cleaner ordering process makes it easier to submit jobs without confusion.",
  },
];

const steps = [
  {
    title: "Choose your product",
    text: "Pick the print item you need and start the order.",
  },
  {
    title: "Upload your file",
    text: "Send your artwork so production has everything in one place.",
  },
  {
    title: "We process the order",
    text: "Your job moves through production with status updates.",
  },
  {
    title: "Track it through delivery",
    text: "Follow the order online once it ships.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b-2 border-black bg-[#f4f8ff]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm md:px-10 lg:px-12">
          <div className="font-medium text-slate-800">
            Print products for business, events, promotions, and everyday marketing.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/order"
              className="rounded-full border-2 border-black bg-white px-4 py-2 font-semibold hover:bg-slate-50"
            >
              Start Order
            </Link>
            <Link
              href="/track"
              className="rounded-full border-2 border-black bg-[#0f62fe] px-4 py-2 font-semibold text-white hover:opacity-90"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-10 lg:px-12">
          <div className="flex flex-wrap gap-3">
            {quickCategories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold hover:bg-[#eef4ff]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-6 py-8 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
          <div className="rounded-t-[28px] border-2 border-black bg-[#0f62fe] p-8 text-white lg:rounded-l-[28px] lg:rounded-r-none lg:p-12">
            <div className="mb-4 inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#0f62fe]">
              Shop print products online
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.03em] md:text-6xl">
              Upload your artwork. Place your order. Track it online.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50 md:text-lg">
              EnVision Direct gives customers a straightforward way to order print products,
              submit files, and stay updated from production through delivery.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-white px-7 text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                Shop Products
              </Link>
              <Link
                href="/track"
                className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-[#ffd54a] px-7 text-sm font-bold text-slate-900 hover:brightness-95"
              >
                Check Order Status
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border-2 border-black bg-white/15 px-4 py-4">
                <div className="text-sm font-bold">Artwork Uploads</div>
                <div className="mt-1 text-sm text-blue-50">Submit print-ready files with the order.</div>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white/15 px-4 py-4">
                <div className="text-sm font-bold">Order Tracking</div>
                <div className="mt-1 text-sm text-blue-50">Customers can follow progress online.</div>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white/15 px-4 py-4">
                <div className="text-sm font-bold">Business Printing</div>
                <div className="mt-1 text-sm text-blue-50">Cards, flyers, postcards, banners, and more.</div>
              </div>
            </div>
          </div>

          <div className="rounded-b-[28px] border-x-2 border-b-2 border-black bg-[#f7f9fc] p-6 lg:rounded-b-none lg:rounded-r-[28px] lg:border-l-0 lg:border-t-2 lg:p-8">
            <div className="rounded-[24px] border-2 border-black bg-white p-6">
              <div className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Popular starting points
              </div>

              <div className="mt-5 space-y-4">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.name}
                    href={product.href}
                    className="block rounded-2xl border-2 border-black bg-white p-4 transition hover:bg-[#eef4ff]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{product.desc}</p>
                      </div>
                      <span className="shrink-0 rounded-full border-2 border-black bg-[#ffd54a] px-3 py-1 text-xs font-bold text-slate-900">
                        {product.badge}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/order"
                className="mt-5 inline-flex rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-bold hover:bg-slate-50"
              >
                View all products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Shop by product</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-4xl">
                Print products customers order most
              </h2>
            </div>
            <Link
              href="/order"
              className="hidden rounded-xl border-2 border-black bg-white px-5 py-3 text-sm font-bold hover:bg-slate-50 md:inline-flex"
            >
              Start order
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group rounded-[24px] border-2 border-black bg-white p-6 transition hover:-translate-y-1 hover:bg-[#eef4ff]"
              >
                <div className="mb-4 h-36 rounded-[20px] border-2 border-black bg-[linear-gradient(135deg,#d9e8ff_0%,#ffffff_100%)]" />
                <span className="inline-flex rounded-full border-2 border-black bg-[#ffd54a] px-3 py-1 text-xs font-bold">
                  {product.badge}
                </span>
                <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em]">{product.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{product.desc}</p>
                <div className="mt-5 text-sm font-bold text-[#0f62fe]">
                  Shop now <span className="inline-block transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-[#f7f9fc]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="grid gap-5 md:grid-cols-3">
            {reasons.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border-2 border-black bg-white p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-[#0f62fe] text-lg font-bold text-white">
                  ✓
                </div>
                <h3 className="text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[28px] border-2 border-black bg-[#ffd54a] p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
                How ordering works
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
                A simple process from file upload to delivery
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-800">
                The goal is to make ordering feel more like shopping and less like sending a long email.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/order"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-white px-6 text-sm font-bold hover:bg-slate-50"
                >
                  Start an Order
                </Link>
                <Link
                  href="/track"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-[#0f62fe] px-6 text-sm font-bold text-white hover:opacity-90"
                >
                  Track an Existing Order
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border-2 border-black bg-white p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[22px] border-2 border-black bg-[#f8fbff] p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
          <div className="rounded-[30px] border-2 border-black bg-[#0f62fe] px-8 py-10 text-white md:px-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-100">
                  Ready to get started?
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-4xl">
                  Shop print products and submit your artwork online
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
                  Start with the product you need, upload your file, and keep track of the order in one place.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/order"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-white px-7 text-sm font-bold text-slate-900 hover:bg-slate-100"
                >
                  Shop Products
                </Link>
                <Link
                  href="/track"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-[#ffd54a] px-7 text-sm font-bold text-slate-900 hover:brightness-95"
                >
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}