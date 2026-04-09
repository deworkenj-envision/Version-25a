"use client";

import Link from "next/link";

const categories = [
  { name: "Business Cards", href: "/order?product=Business%20Cards" },
  { name: "Flyers", href: "/order?product=Flyers" },
  { name: "Postcards", href: "/order?product=Postcards" },
  { name: "Brochures", href: "/order?product=Brochures" },
  { name: "Banners", href: "/order?product=Banners" },
  { name: "Yard Signs", href: "/order?product=Yard%20Signs" },
  { name: "Stickers", href: "/order?product=Stickers" },
  { name: "Menus", href: "/order?product=Menus" },
];

const featuredProducts = [
  {
    name: "Standard Business Cards",
    href: "/order?product=Business%20Cards",
    price: "Starting at $24.99",
    desc: "A clean, everyday option for handouts, networking, and customer contact.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Flyers",
    href: "/order?product=Flyers",
    price: "Starting at $39.99",
    desc: "Simple marketing prints for sales, events, announcements, and menus.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Postcards",
    href: "/order?product=Postcards",
    price: "Starting at $44.99",
    desc: "Great for direct mail, promotions, thank-you cards, and special offers.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Vinyl Banners",
    href: "/order?product=Banners",
    price: "Starting at $89.99",
    desc: "Large-format signage for storefronts, events, trade shows, and promotions.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Brochures",
    href: "/order?product=Brochures",
    price: "Starting at $59.99",
    desc: "Folded print pieces for services, products, takeaways, and presentations.",
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Yard Signs",
    href: "/order?product=Yard%20Signs",
    price: "Starting at $29.99",
    desc: "Useful for real estate, events, political campaigns, and local promotions.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  },
];

const benefits = [
  {
    title: "Upload print-ready artwork",
    text: "Already have a finished design? Send it with the order and keep things moving.",
  },
  {
    title: "Track orders online",
    text: "Customers can check production and shipping progress on the tracking page.",
  },
  {
    title: "Simple ordering flow",
    text: "A cleaner process makes it easier to submit jobs without confusion.",
  },
  {
    title: "Built for real print jobs",
    text: "Business cards, flyers, postcards, banners, signs, and more.",
  },
];

const processSteps = [
  {
    number: "1",
    title: "Choose a product",
    text: "Start with the print product you need.",
  },
  {
    number: "2",
    title: "Upload your artwork",
    text: "Send your file so the order is ready to process.",
  },
  {
    number: "3",
    title: "We move it through production",
    text: "Your order is updated through each stage.",
  },
  {
    number: "4",
    title: "Track it through delivery",
    text: "Customers can follow the order after it ships.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <section className="border-b-2 border-black bg-[#0f62fe] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 md:px-10 lg:px-12">
          <p className="text-sm font-semibold">
            Order print products online, upload artwork, and track your job in one place.
          </p>
          <div className="flex gap-2">
            <Link
              href="/order"
              className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
            >
              Start Order
            </Link>
            <Link
              href="/track"
              className="rounded-full border-2 border-black bg-[#ffd54a] px-4 py-2 text-sm font-bold text-slate-900 hover:brightness-95"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-10 lg:px-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-[#eef4ff]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
          <div className="rounded-[30px] border-2 border-black bg-[#0f62fe] p-8 text-white md:p-10">
            <div className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#0f62fe]">
              Online Print Shop
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-[-0.04em] md:text-6xl">
              Print products made easy to order online.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50 md:text-lg">
              Shop products, upload print-ready files, and keep up with the order from production to delivery.
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
              <div className="rounded-2xl border-2 border-black bg-white/15 p-4">
                <p className="text-sm font-bold">Upload Artwork</p>
                <p className="mt-1 text-sm text-blue-50">
                  Send your file with the order.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white/15 p-4">
                <p className="text-sm font-bold">Track Progress</p>
                <p className="mt-1 text-sm text-blue-50">
                  Follow the order after checkout.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white/15 p-4">
                <p className="text-sm font-bold">Popular Products</p>
                <p className="mt-1 text-sm text-blue-50">
                  Cards, flyers, postcards, banners, and more.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border-2 border-black bg-[#f8fbff] p-5 md:p-6">
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-[24px] border-2 border-black bg-white">
                <img
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                  alt="Printed marketing materials on a desk"
                  className="h-64 w-full object-cover"
                />
                <div className="border-t-2 border-black p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Featured
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">
                    Upload your design and place the order without the back-and-forth.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Built for customers who already have artwork ready and want a cleaner way to order print.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-[22px] border-2 border-black bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
                    alt="Business card stack"
                    className="h-36 w-full object-cover"
                  />
                  <div className="border-t-2 border-black p-4">
                    <p className="text-sm font-bold">Business Cards</p>
                    <p className="mt-1 text-xs text-slate-600">A strong everyday seller.</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[22px] border-2 border-black bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
                    alt="Printed flyers on table"
                    className="h-36 w-full object-cover"
                  />
                  <div className="border-t-2 border-black p-4">
                    <p className="text-sm font-bold">Flyers</p>
                    <p className="mt-1 text-xs text-slate-600">Good for events and promotions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Shop popular products
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-4xl">
                Start with a product and upload your file
              </h2>
            </div>
            <Link
              href="/order"
              className="hidden rounded-xl border-2 border-black bg-white px-5 py-3 text-sm font-bold hover:bg-slate-50 md:inline-flex"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group overflow-hidden rounded-[26px] border-2 border-black bg-white transition hover:-translate-y-1 hover:bg-[#eef4ff]"
              >
                <div className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="border-t-2 border-black p-6">
                  <p className="text-sm font-bold text-[#0f62fe]">{product.price}</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{product.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{product.desc}</p>
                  <div className="mt-5 text-sm font-bold text-slate-900">
                    Order now <span className="inline-block transition group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-[#f7f9fc]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Why customers use it
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-4xl">
              Built around the actual ordering process
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item) => (
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
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border-2 border-black bg-[#ffd54a] p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
                A simple path from product to delivery
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-800">
                The goal is to make ordering feel like shopping, not emailing back and forth.
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
                {processSteps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-[22px] border-2 border-black bg-[#f8fbff] p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-sm font-bold">
                      {step.number}
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