import Link from "next/link";

const products = [
  {
    name: "Business Cards",
    description: "Professional cards with sharp print quality and premium finishes.",
    image: "/products/business-cards.jpg",
    href: "/order?product=Business%20Cards",
  },
  {
    name: "Postcards",
    description: "Great for promotions, mailers, announcements, and handouts.",
    image: "/products/postcards.jpg",
    href: "/order?product=Postcards",
  },
  {
    name: "Flyers",
    description: "Bold marketing pieces for events, menus, sales, and promotions.",
    image: "/products/flyers.jpg",
    href: "/order?product=Flyers",
  },
  {
    name: "Banners",
    description: "Large-format prints for storefronts, events, trade shows, and displays.",
    image: "/products/banners.jpg",
    href: "/order?product=Banners",
  },
];

const highlights = [
  "Top Quality Printing",
  "Fast Turnaround",
  "Competitive Pricing",
  "Easy Artwork Upload",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/logo-hero.png"
                alt="EnVision Direct"
                className="h-14 w-auto object-contain sm:h-16"
              />
              <span className="text-xl font-bold tracking-tight sm:text-2xl">
                EnVision Direct
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/track"
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Track Order
              </Link>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-blue-100">
                Premium Online Print Ordering
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Top Quality Printing.
                <br />
                Fast Turnaround.
                <br />
                The Best Prices.
              </h1>

              <p className="mt-5 max-w-2xl text-base text-blue-100 sm:text-lg">
                Order business cards, postcards, flyers, and banners online with a clean,
                easy process for selecting options, uploading artwork, and checking out securely.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  Start Your Order
                </Link>

                <Link
                  href="/track"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-base font-bold text-white transition hover:bg-white/20"
                >
                  Track Your Order
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Business Cards", "Postcards", "Flyers", "Banners"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-blue-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] bg-white/95 p-4 shadow-2xl backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                <ProductCollageItem
                  title="Postcards"
                  image="/products/postcards.jpg"
                />
                <ProductCollageItem
                  title="Business Cards"
                  image="/products/business-cards.jpg"
                />
                <ProductCollageItem
                  title="Flyers"
                  image="/products/flyers.jpg"
                />
                <ProductCollageItem
                  title="Banners"
                  image="/products/banners.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm font-semibold text-slate-800 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Popular Products
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Order your most-used print products online
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Choose your product, select your print options, upload artwork, and
              place your order in a few simple steps.
            </p>
          </div>

          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View All Ordering Options
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-52 overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {product.description}
                </p>

                <div className="mt-5 inline-flex items-center text-sm font-semibold text-blue-700">
                  Start Order →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Why Customers Use EnVision Direct
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              A simple, professional print ordering experience
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <BenefitCard
                title="Easy Artwork Upload"
                text="Upload print-ready files directly with your order."
              />
              <BenefitCard
                title="Live Product Selection"
                text="Choose size, paper, finish, sides, and quantity easily."
              />
              <BenefitCard
                title="Secure Checkout"
                text="Review your order clearly and pay securely online."
              />
              <BenefitCard
                title="Order Tracking"
                text="Check your order status and shipment progress anytime."
              />
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-8 text-slate-900 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Ready to Order?
            </p>
            <h3 className="mt-3 text-3xl font-extrabold leading-tight">
              Start your next print order today
            </h3>
            <p className="mt-4 text-slate-600">
              Build your order, upload your artwork, and check out in minutes.
            </p>

            <div className="mt-8 space-y-4">
              <Link
                href="/order"
                className="block rounded-2xl bg-blue-600 px-6 py-4 text-center text-base font-bold text-white transition hover:bg-blue-700"
              >
                Start Your Order
              </Link>

              <Link
                href="/track"
                className="block rounded-2xl border border-slate-300 px-6 py-4 text-center text-base font-bold text-slate-800 transition hover:bg-slate-50"
              >
                Already Placed an Order? Track It Here
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductCollageItem({ title, image }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
      <div className="h-40 bg-slate-100">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="px-4 py-3 text-center text-sm font-bold text-slate-900">
        {title}
      </div>
    </div>
  );
}

function BenefitCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}