"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const quickLinks = [
  { name: "Business Cards", href: "/order?product=Business%20Cards" },
  { name: "Flyers", href: "/order?product=Flyers" },
  { name: "Postcards", href: "/order?product=Postcards" },
  { name: "Brochures", href: "/order?product=Brochures" },
  { name: "Banners", href: "/order?product=Banners" },
  { name: "Yard Signs", href: "/order?product=Yard%20Signs" },
];

const menuGroups = [
  {
    key: "cards",
    title: "Business Cards",
    blurb: "Popular everyday card options for networking, handouts, and leave-behinds.",
    orderHref: "/order?product=Business%20Cards",
    items: [
      { name: "Standard Business Cards", href: "/order?product=Business%20Cards" },
      { name: "Premium Business Cards", href: "/order?product=Premium%20Business%20Cards" },
      { name: "Folded Business Cards", href: "/order?product=Folded%20Business%20Cards" },
      { name: "Rounded Corner Cards", href: "/order?product=Rounded%20Corner%20Business%20Cards" },
    ],
  },
  {
    key: "marketing",
    title: "Flyers & Brochures",
    blurb: "Great for promotions, sales sheets, menus, takeaways, and event marketing.",
    orderHref: "/order?product=Flyers",
    items: [
      { name: "Flyers", href: "/order?product=Flyers" },
      { name: "Brochures", href: "/order?product=Brochures" },
      { name: "Postcards", href: "/order?product=Postcards" },
      { name: "Rack Cards", href: "/order?product=Rack%20Cards" },
    ],
  },
  {
    key: "signage",
    title: "Signs & Banners",
    blurb: "Large-format products for storefronts, real estate, trade shows, and events.",
    orderHref: "/order?product=Banners",
    items: [
      { name: "Vinyl Banners", href: "/order?product=Banners" },
      { name: "Yard Signs", href: "/order?product=Yard%20Signs" },
      { name: "Posters", href: "/order?product=Posters" },
      { name: "A-Frame Signs", href: "/order?product=A-Frame%20Signs" },
    ],
  },
  {
    key: "office",
    title: "Office & Stationery",
    blurb: "Printed pieces for day-to-day business use and customer-facing materials.",
    orderHref: "/order?product=Letterhead",
    items: [
      { name: "Letterhead", href: "/order?product=Letterhead" },
      { name: "Envelopes", href: "/order?product=Envelopes" },
      { name: "Presentation Folders", href: "/order?product=Presentation%20Folders" },
      { name: "Notepads", href: "/order?product=Notepads" },
    ],
  },
];

const highlights = [
  "Upload print-ready artwork",
  "Order online",
  "Track order status",
  "Simple product selection",
];

function MenuButton({ active, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border-2 border-black px-4 py-4 text-left transition ${
        active ? "bg-[#0f62fe] text-white" : "bg-white text-slate-900 hover:bg-[#eef4ff]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-bold">{title}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black text-sm font-bold ${
            active ? "bg-white text-slate-900" : "bg-[#ffd54a] text-slate-900"
          }`}
        >
          +
        </span>
      </div>
    </button>
  );
}

export default function HomePage() {
  const [activeKey, setActiveKey] = useState(menuGroups[0].key);

  const activeGroup = useMemo(
    () => menuGroups.find((group) => group.key === activeKey) || menuGroups[0],
    [activeKey]
  );

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10 lg:px-12">
          <div>
            <div className="text-2xl font-extrabold tracking-[-0.03em]">EnVision Direct</div>
            <div className="text-sm text-slate-600">Online print ordering</div>
          </div>

          <div className="hidden flex-wrap gap-2 md:flex">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-[#eef4ff]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-[#eaf2ff]">
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_430px]">
            <div className="rounded-[30px] border-2 border-black bg-white p-8 md:p-10">
              <div className="inline-flex rounded-full border-2 border-black bg-[#ffd54a] px-4 py-2 text-xs font-extrabold uppercase tracking-wide">
                Print products made easy
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-6xl">
                Shop print products, upload your file, and place the order online.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
                Built for customers who already know what they need and want a cleaner path to order.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/order"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-[#0f62fe] px-7 text-sm font-bold text-white hover:opacity-90"
                >
                  Start Order
                </Link>
                <Link
                  href="/track"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-black bg-white px-7 text-sm font-bold text-slate-900 hover:bg-slate-50"
                >
                  Track Order
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border-2 border-black bg-[#f8fbff] px-4 py-4 text-sm font-bold"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 overflow-hidden rounded-[24px] border-2 border-black bg-white">
                <img
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80"
                  alt="Printed marketing materials on a worktable"
                  className="h-[260px] w-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-[30px] border-2 border-black bg-white p-5">
              <div className="rounded-[22px] border-2 border-black bg-[#0f62fe] p-5 text-white">
                <div className="text-xs font-extrabold uppercase tracking-wide text-blue-100">
                  Product Menu
                </div>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">
                  Find the product you want to order
                </h2>
                <p className="mt-2 text-sm leading-6 text-blue-50">
                  Open a category, choose a product, and jump straight into ordering.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {menuGroups.map((group) => (
                  <div key={group.key}>
                    <MenuButton
                      active={activeKey === group.key}
                      onClick={() => setActiveKey(group.key)}
                      title={group.title}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[24px] border-2 border-black bg-[#f8fbff] p-5">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  {activeGroup.title}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {activeGroup.blurb}
                </p>

                <div className="mt-4 grid gap-3">
                  {activeGroup.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-bold hover:bg-[#eef4ff]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={activeGroup.orderHref}
                    className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-black bg-[#ffd54a] px-5 text-sm font-extrabold text-slate-900 hover:brightness-95"
                  >
                    Order {activeGroup.title}
                  </Link>
                  <Link
                    href="/order"
                    className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-black bg-white px-5 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
                  >
                    View All Products
                  </Link>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border-2 border-black bg-white p-5">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Need something already designed?
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Upload your print-ready artwork and move directly into the order flow.
                </p>
                <Link
                  href="/order"
                  className="mt-4 inline-flex h-12 items-center justify-center rounded-xl border-2 border-black bg-[#0f62fe] px-5 text-sm font-extrabold text-white hover:opacity-90"
                >
                  Upload & Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                Popular products
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
                Quick starting points
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Business Cards",
                href: "/order?product=Business%20Cards",
                image:
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Flyers",
                href: "/order?product=Flyers",
                image:
                  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Postcards",
                href: "/order?product=Postcards",
                image:
                  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Banners",
                href: "/order?product=Banners",
                image:
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group overflow-hidden rounded-[26px] border-2 border-black bg-white transition hover:-translate-y-1 hover:bg-[#eef4ff]"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <div className="border-t-2 border-black p-5">
                  <div className="text-xl font-extrabold">{card.title}</div>
                  <div className="mt-3 text-sm font-bold text-[#0f62fe]">Shop now →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}