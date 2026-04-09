"use client";

import Link from "next/link";

const featuredProducts = [
  {
    name: "Business Cards",
    desc: "Premium cards with sharp print, rich color, and finishes that feel high-end.",
    href: "/order?product=Business%20Cards",
  },
  {
    name: "Postcards",
    desc: "Direct-mail and promo postcards built to stand out and drive response.",
    href: "/order?product=Postcards",
  },
  {
    name: "Flyers",
    desc: "Clean, bold marketing prints for events, promotions, and local advertising.",
    href: "/order?product=Flyers",
  },
  {
    name: "Banners",
    desc: "Large-format signage for stores, events, launches, and everyday visibility.",
    href: "/order?product=Banners",
  },
];

const trustPoints = [
  "Professional print products",
  "Fast order updates and tracking",
  "Simple artwork upload flow",
  "Premium customer experience",
];

const processSteps = [
  {
    title: "Choose Your Product",
    text: "Select the print product you need and move through a clean, guided ordering flow.",
  },
  {
    title: "Upload Your Artwork",
    text: "Send print-ready files directly with your order so production can begin faster.",
  },
  {
    title: "We Produce & Review",
    text: "Your order moves through production with status visibility and organized fulfillment.",
  },
  {
    title: "Track to Delivery",
    text: "Customers can check live order progress and shipping updates from the tracking page.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-8 md:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.06)]">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="px-7 py-10 md:px-10 md:py-14">
              <div className="mb-6 inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-black/70">
                Premium Print Ordering
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.03em] md:text-6xl">
                Print that feels premium from the first click to final delivery.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-black/65 md:text-lg">
                EnVision Direct gives customers a polished way to order professional print
                products online, upload artwork, and track progress with confidence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/order"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-black px-7 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Start Your Order
                </Link>
                <Link
                  href="/track"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-black/10 bg-white px-7 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                >
                  Track an Order
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-black/8 bg-[#fafaf8] px-4 py-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                      ✓
                    </div>
                    <span className="text-sm font-medium text-black/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-black/8 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(240,240,236,0.95)_45%,_rgba(231,231,226,1)_100%)] px-7 py-10 lg:border-l lg:border-t-0 md:px-10 md:py-14">
              <div className="rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-black/45">
                      Featured Experience
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      Clean ordering, professional results
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl bg-black p-5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">
                      Fast ordering
                    </p>
                    <p className="mt-3 text-2xl font-semibold leading-tight">
                      Upload artwork and move to production without confusion.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-black/10 bg-[#fafaf8] p-5">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                        Live status
                      </p>
                      <p className="mt-3 text-lg font-semibold">Order progress visibility</p>
                      <p className="mt-2 text-sm leading-6 text-black/60">
                        Customers can check updates from order placement through delivery.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-[#fafaf8] p-5">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                        Premium feel
                      </p>
                      <p className="mt-3 text-lg font-semibold">Built for trust and conversion</p>
                      <p className="mt-2 text-sm leading-6 text-black/60">
                        A cleaner storefront gives your business a more established look.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-black/10 bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                      Best for
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Business printing", "Marketing materials", "Repeat customers", "Fast fulfillment"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-xs font-medium text-black/70"
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

          <div className="border-t border-black/8 bg-[#fbfbf9] px-7 py-6 md:px-10">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-black/45">Why customers stay</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  Better presentation. Better trust.
                </p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white px-5 py-4 text-sm text-black/70">
                Simple upload flow and clean order submission for less friction at checkout.
              </div>
              <div className="rounded-2xl border border-black/8 bg-white px-5 py-4 text-sm text-black/70">
                Order tracking and status visibility create a stronger post-purchase experience.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 md:px-10 lg:px-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-black/45">Featured products</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
              Popular print products
            </h2>
          </div>
          <Link
            href="/order"
            className="hidden rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.03] md:inline-flex"
          >
            View Ordering
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lg font-semibold text-white">
                {product.name.charAt(0)}
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">{product.name}</h3>
              <p className="mt-3 text-sm leading-6 text-black/62">{product.desc}</p>
              <div className="mt-6 text-sm font-semibold text-black">
                Order now <span className="transition group-hover:translate-x-1 inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 md:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-black/10 bg-black p-7 text-white shadow-[0_18px_60px_rgba(0,0,0,0.14)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.26em] text-white/60">Built for confidence</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
              A print storefront that feels established from day one.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 md:text-base">
              Your site should do more than take orders. It should reassure customers that their
              files, timing, and final delivery are being handled professionally.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Ordering</p>
                <p className="mt-3 text-lg font-semibold">Simple and direct</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Tracking</p>
                <p className="mt-3 text-lg font-semibold">Clear post-purchase updates</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.05)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.26em] text-black/45">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
              Clear process. Professional finish.
            </h2>

            <div className="mt-8 space-y-4">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-4 rounded-3xl border border-black/8 bg-[#fafaf8] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-black/62">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/order"
                className="inline-flex h-13 items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Place an Order
              </Link>
              <Link
                href="/track"
                className="inline-flex h-13 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
              >
                Check Order Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-6 md:px-10 lg:px-12">
        <div className="rounded-[32px] border border-black/10 bg-white px-7 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.05)] md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-black/45">Ready to order?</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                Start your next print job with a cleaner, more premium experience.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-black/65 md:text-base">
                From business cards to banners, EnVision Direct gives customers a simple way to
                order, upload artwork, and stay informed through fulfillment.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/order"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-black px-7 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Start Your Order
              </Link>
              <Link
                href="/track"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-black/10 bg-[#fafaf8] px-7 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
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