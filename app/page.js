import Link from "next/link";

const products = [
  {
    name: "Business Cards",
    description: "Premium business cards with multiple paper stocks and finishes.",
    href: "/order?product=Business%20Cards",
  },
  {
    name: "Flyers",
    description: "Fast-turn promotional flyers for events, menus, and handouts.",
    href: "/order?product=Flyers",
  },
  {
    name: "Postcards",
    description: "High-impact postcards for direct mail and marketing campaigns.",
    href: "/order?product=Postcards",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold tracking-tight">PrintLuxe</div>

          <nav className="hidden gap-6 md:flex">
            <a href="#products" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Products
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Ordering
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Pricing
            </a>
            <a href="#checkout" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Checkout
            </a>
            <Link href="/admin/orders" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/order"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Start Order
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-slate-900 to-blue-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Top Quality Printing at the Best Prices
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Premium print products with a simple ordering experience
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-blue-100">
              Order business cards, flyers, and postcards with premium paper,
              finishes, shipping options, and a clean customer-friendly process.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/order"
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Start Your Order
              </Link>

              <a
                href="#products"
                className="rounded-2xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                View Products
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold">We make it easy</h2>

            <div className="mt-6 space-y-4 text-blue-50">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                1. Pick the product you want
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                2. Choose the paper type, quantity, and finishes
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                3. Upload your print-ready artwork
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                4. Review pricing, shipping, and checkout
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Popular Products</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Choose a product below to start your order with live pricing and shipping.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {product.description}
              </p>

              <div className="mt-6">
                <Link
                  href={product.href}
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Order {product.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold">Ordering Process</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              A simple customer-facing flow built for quick ordering.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              "Choose product",
              "Customize paper and finishes",
              "Review pricing and shipping",
              "Continue to checkout",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Dynamic Pricing</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Pricing updates live based on product, paper type, quantity, and finishes.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Shipping Options</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Ground, Express, and Overnight options are included in the order flow.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Admin Orders</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Orders submitted through the storefront can be reviewed in the admin dashboard.
            </p>
          </div>
        </div>
      </section>

      <section id="checkout" className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">Checkout and Stripe Flow</h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                The order page is ready for the next step: saving the order and then wiring
                the Continue to Checkout button into a real Stripe checkout session.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/order"
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Go to Ordering
              </Link>

              <Link
                href="/admin/orders"
                className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                View Admin Orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}