import Image from "next/image";
import Link from "next/link";

const featuredProducts = [
  {
    name: "Business Cards",
    description:
      "Premium stocks, sharp detail, and fast turnaround for a polished first impression.",
    href: "/order?product=Business%20Cards",
    meta: "Premium stocks • Matte / Gloss • Fast turnaround",
  },
  {
    name: "Flyers",
    description:
      "High-impact marketing pieces for promotions, events, menus, and handouts.",
    href: "/order?product=Flyers",
    meta: "Event promos • Menus • Handouts",
  },
  {
    name: "Postcards",
    description:
      "Perfect for direct mail, announcements, promotions, and premium marketing.",
    href: "/order?product=Postcards",
    meta: "Direct mail • Promotions • Announcements",
  },
  {
    name: "Banners",
    description: "Durable full-color banners for indoor and outdoor display.",
    href: "/order?product=Banners",
    meta: "Indoor / outdoor • Large format • Bold color",
  },
];

const benefits = [
  {
    title: "Top Quality Printing",
    text: "Clean color, sharp detail, and premium print presentation for every order.",
  },
  {
    title: "Fast Turnaround",
    text: "Simple ordering and artwork upload so your job moves quickly.",
  },
  {
    title: "Easy Online Ordering",
    text: "Choose your options, upload your file, and check out in minutes.",
  },
  {
    title: "Order Tracking",
    text: "Customers can track order progress and shipment updates online.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose Your Product",
    text: "Select from business cards, flyers, postcards, banners, and more.",
  },
  {
    number: "02",
    title: "Upload Artwork",
    text: "Send your print-ready design file directly with your order.",
  },
  {
    number: "03",
    title: "Checkout Securely",
    text: "Review your live pricing and complete payment with confidence.",
  },
  {
    number: "04",
    title: "Track Your Order",
    text: "Follow your order status from production through delivery.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="px-5 pt-5 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-[1660px]">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white shadow-2xl">
            <div className="mx-auto grid max-w-[1420px] items-center gap-12 px-8 py-10 lg:grid-cols-[1.22fr_0.78fr] lg:gap-14 lg:px-12 lg:py-14 xl:gap-16">
              <div className="flex items-center justify-center lg:justify-start">
                <div className="w-full max-w-[980px]">
                  <Image
                    src="/images/hero-collage-logo.png"
                    alt="EnVision Direct print products collage"
                    width={1024}
                    height={1536}
                    priority
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <h1 className="text-[3.5rem] font-extrabold leading-[0.95] tracking-tight xl:text-[3.95rem]">
                  <span className="block whitespace-nowrap">Top Quality Printing.</span>
                  <span className="mt-4 block whitespace-nowrap">Fast Turnaround.</span>
                  <span className="mt-4 block whitespace-nowrap">The Best Prices.</span>
                </h1>

                <p className="mt-10 max-w-xl text-lg leading-8 text-blue-50">
                  Professional online printing with live pricing, easy artwork
                  upload, secure checkout, and order tracking built in.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/order"
                    className="rounded-2xl bg-white px-6 py-4 text-base font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    Start Your Order
                  </Link>

                  <Link
                    href="/track"
                    className="rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Track Your Order
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap gap-3 text-sm font-medium">
                  <span className="rounded-full bg-white/15 px-4 py-2">
                    Business Cards
                  </span>
                  <span className="rounded-full bg-white/15 px-4 py-2">Flyers</span>
                  <span className="rounded-full bg-white/15 px-4 py-2">
                    Postcards
                  </span>
                  <span className="rounded-full bg-white/15 px-4 py-2">
                    Banners
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Featured Products
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Print products built for real business needs
            </h2>
          </div>

          <Link
            href="/order"
            className="hidden rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-800 md:inline-flex"
          >
            View Pricing
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
            >
              <div className="mb-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white">
                  <span className="text-center text-sm font-bold text-blue-700">
                    {product.name}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-blue-700">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm font-semibold text-blue-700">
                  {product.meta}
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {product.description}
                </p>

                <div className="mt-6">
                  <span className="inline-flex items-center rounded-2xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-blue-800">
                    Start Order
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A better online print ordering experience
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              EnVision Direct combines clean ordering, live pricing, artwork
              upload, and tracking into one simple customer experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-4 h-12 w-12 rounded-2xl bg-blue-100" />
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Simple Process
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Order in a few easy steps
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Built for customers who want a smooth online print experience
              without confusion.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/order"
                className="rounded-2xl bg-blue-700 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-blue-800"
              >
                Place an Order
              </Link>
              <Link
                href="/track"
                className="rounded-2xl border border-slate-300 px-6 py-4 text-base font-bold text-slate-900 transition hover:bg-slate-50"
              >
                Already Placed an Order?
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-lg font-extrabold text-white">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-8 py-12 text-white shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                Ready to Order?
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Start your print order today
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-50">
                Get live pricing, upload your artwork, and complete checkout in a
                clean, professional ordering flow.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/order"
                className="rounded-2xl bg-white px-6 py-4 text-base font-bold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                Start Your Order
              </Link>
              <Link
                href="/track"
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}