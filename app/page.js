import Image from "next/image";
import Link from "next/link";

const featuredProducts = [
  {
    name: "Business Cards",
    description:
      "Professional cards with premium stocks, sharp detail, and fast turnaround.",
    href: "/order",
  },
  {
    name: "Flyers",
    description:
      "High-impact marketing pieces for promotions, events, menus, and handouts.",
    href: "/order",
  },
  {
    name: "Postcards",
    description:
      "Perfect for direct mail, announcements, promotions, and premium marketing.",
    href: "/order",
  },
  {
    name: "Banners",
    description:
      "Durable full-color banners for indoor and outdoor display.",
    href: "/order",
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
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_24%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <Image
                src="/images/logo-hero.png"
                alt="EnVision Direct"
                width={320}
                height={110}
                className="h-auto w-auto max-w-[260px] sm:max-w-[320px]"
                priority
              />
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Top Quality Printing.
              <br />
              Fast Turnaround.
              <br />
              The Best Prices.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50">
              Professional online printing with live pricing, easy artwork upload,
              secure checkout, and order tracking built in.
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
              <span className="rounded-full bg-white/15 px-4 py-2">Business Cards</span>
              <span className="rounded-full bg-white/15 px-4 py-2">Flyers</span>
              <span className="rounded-full bg-white/15 px-4 py-2">Postcards</span>
              <span className="rounded-full bg-white/15 px-4 py-2">Banners</span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-[2rem] bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
              <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-2xl">
                <Image
                  src="/images/logo-hero.png"
                  alt="Featured print products"
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                />
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
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white">
                  <span className="text-center text-sm font-bold text-blue-700">
                    {product.name}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {product.description}
              </p>
              <div className="mt-5 text-sm font-bold text-blue-700">
                Start order →
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