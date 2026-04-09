"use client";

import Link from "next/link";

const featuredProducts = [
  {
    name: "Business Cards",
    desc: "Sharp, professional cards for everyday networking, handouts, and leave-behinds.",
    href: "/order?product=Business%20Cards",
  },
  {
    name: "Postcards",
    desc: "Great for promotions, announcements, and direct-mail pieces that need to stand out.",
    href: "/order?product=Postcards",
  },
  {
    name: "Flyers",
    desc: "Simple, effective print pieces for events, sales, menus, and local advertising.",
    href: "/order?product=Flyers",
  },
  {
    name: "Banners",
    desc: "Large-format prints for storefronts, trade shows, events, and outdoor visibility.",
    href: "/order?product=Banners",
  },
];

const trustPoints = [
  "Easy online ordering",
  "Upload print-ready artwork",
  "Track order progress",
  "Professional finished products",
];

const processSteps = [
  {
    title: "Pick a product",
    text: "Choose the print item you need and submit the order without a complicated checkout flow.",
  },
  {
    title: "Upload your file",
    text: "Send your artwork with the order so everything stays together from the start.",
  },
  {
    title: "We move it into production",
    text: "Your order is reviewed, organized, and updated through each step of the process.",
  },
  {
    title: "Track it through delivery",
    text: "Customers can check status updates and shipping progress from the tracking page.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3f7ff_0%,#f8fbff_26%,#ffffff_58%,#f6f9ff_100%)] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-8 md:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[36px] border-2 border-black bg-white shadow-[0_24px_80px_rgba(37,99,235,0.10)]">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative px-7 py-10 md:px-10 md:py-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_30%)]" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center rounded-full border-2 border-black bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                  Online Print Shop
                </div>

                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 md:text-6xl">
                  Professional printing without the confusing ordering process.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
                  EnVision Direct makes it easy to place a print order, upload artwork,
                  and follow the job through production and shipping.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/order"
                    className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-gradient-to-r from-blue-600 to-indigo-600 px-7 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(79,70,229,0.28)] transition hover:scale-[1.01] hover:opacity-95"
                  >
                    Start Your Order
                  </Link>
                  <Link
                    href="/track"
                    className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-white px-7 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
                  >
                    Track an Order
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {trustPoints.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-4 shadow-sm"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-bold text-white">
                        ✓
                      </div>
                      <span className="text-sm font-medium text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t-2 border-black bg-[linear-gradient(180deg,rgba(219,234,254,0.62),rgba(238,242,255,0.72),rgba(255,255,255,0.94))] px-7 py-10 lg:border-l-2 lg:border-t-0 md:px-10 md:py-14">
              <div className="rounded-[30px] border-2 border-black bg-white p-5 shadow-[0_16px_45px_rgba(59,130,246,0.12)]">
                <div className="mb-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-blue-700/70">
                    What this site does
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Order, upload, and track in one place
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border-2 border-black bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-5 text-white shadow-[0_18px_40px_rgba(30,41,59,0.30)]">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-blue-200/80">
                      Simple workflow
                    </p>
                    <p className="mt-3 text-2xl font-semibold leading-tight">
                      Customers can send artwork, place the order, and check status without back-and-forth.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border-2 border-black bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-blue-700/65">
                        Clear updates
                      </p>
                      <p className="mt-3 text-lg font-semibold text-slate-900">
                        Real order progress
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        From order placed to shipped and delivered, customers can see where things stand.
                      </p>
                    </div>

                    <div className="rounded-3xl border-2 border-black bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-blue-700/65">
                        Cleaner experience
                      </p>
                      <p className="mt-3 text-lg font-semibold text-slate-900">
                        Better first impression
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        A cleaner storefront helps the business look more established and easier to trust.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border-2 border-black bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      Good fit for
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Business printing", "Marketing pieces", "Repeat customers", "Uploaded artwork"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full border-2 border-black bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-black bg-[linear-gradient(90deg,rgba(239,246,255,0.95),rgba(244,247,255,0.95),rgba(239,246,255,0.95))] px-7 py-6 md:px-10">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                  Why this helps
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Easier to use. Easier to trust.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white px-5 py-4 text-sm text-slate-700 shadow-sm">
                Customers can place orders and upload files without guessing what to do next.
              </div>
              <div className="rounded-2xl border-2 border-black bg-white px-5 py-4 text-sm text-slate-700 shadow-sm">
                The tracking page gives them a clear place to check progress after checkout.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 md:px-10 lg:px-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
              Featured products
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
              Popular print products
            </h2>
          </div>
          <Link
            href="/order"
            className="hidden rounded-2xl border-2 border-black bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 md:inline-flex"
          >
            View Ordering
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group overflow-hidden rounded-[28px] border-2 border-black bg-white shadow-[0_14px_38px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(59,130,246,0.14)]"
            >
              <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-500" />
              <div className="p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-gradient-to-br from-blue-600 to-indigo-500 text-lg font-semibold text-white shadow-lg">
                  {product.name.charAt(0)}
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  {product.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{product.desc}</p>
                <div className="mt-6 text-sm font-semibold text-blue-700">
                  Order now <span className="inline-block transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 md:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border-2 border-black bg-[linear-gradient(145deg,#0f172a_0%,#1d4ed8_52%,#4338ca_100%)] p-7 text-white shadow-[0_22px_70px_rgba(79,70,229,0.22)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.26em] text-blue-100/75">
              Built for real orders
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
              A storefront that feels more organized and more professional.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-blue-50/90 md:text-base">
              The goal is simple: give customers an easier way to order print, send files,
              and stay informed without needing emails back and forth for every step.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border-2 border-black bg-white/10 p-5 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">Ordering</p>
                <p className="mt-3 text-lg font-semibold">Straightforward checkout</p>
              </div>
              <div className="rounded-3xl border-2 border-black bg-white/10 p-5 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">Tracking</p>
                <p className="mt-3 text-lg font-semibold">Clear status visibility</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border-2 border-black bg-white p-7 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
              Four simple steps
            </h2>

            <div className="mt-8 space-y-4">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-4 rounded-3xl border-2 border-black bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="inline-flex h-13 items-center justify-center rounded-2xl border-2 border-black bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.24)] transition hover:opacity-95"
              >
                Place an Order
              </Link>
              <Link
                href="/track"
                className="inline-flex h-13 items-center justify-center rounded-2xl border-2 border-black bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
              >
                Check Order Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-6 md:px-10 lg:px-12">
        <div className="rounded-[32px] border-2 border-black bg-[linear-gradient(120deg,#ffffff_0%,#eff6ff_55%,#eef2ff_100%)] px-7 py-10 shadow-[0_14px_40px_rgba(59,130,246,0.07)] md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                Ready to order?
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
                Submit your next print job online.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 md:text-base">
                Start with the product you need, upload your artwork, and follow the order through shipping.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/order"
                className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-gradient-to-r from-blue-600 to-indigo-600 px-7 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.24)] transition hover:opacity-95"
              >
                Start Your Order
              </Link>
              <Link
                href="/track"
                className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-white px-7 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
              >
                Track Existing Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}