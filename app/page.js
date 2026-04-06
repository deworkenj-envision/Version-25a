import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Top Quality Printing at the Best Prices
            </h1>

            <p className="mt-6 text-lg text-blue-100 max-w-xl">
              Premium business cards, flyers, and marketing materials — fast,
              affordable, and professionally printed.
            </p>

            {/* ✅ BUTTONS (THIS IS WHERE TRACK LINK LIVES) */}
            <div className="mt-8 flex flex-wrap gap-4">
              
              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100"
              >
                Start Order
              </Link>

              <Link
                href="/track"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20"
              >
                Track Order
              </Link>

            </div>

            {/* PROCESS */}
            <div className="mt-10 bg-white/10 rounded-2xl p-6 backdrop-blur">
              <h3 className="text-lg font-semibold mb-3">
                We make it easy:
              </h3>

              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Pick the product you want</li>
                <li>• Choose paper, quantity, and finishes</li>
                <li>• Upload your print-ready artwork</li>
                <li>• Place your order</li>
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0"
                alt="Printing"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          Popular Products
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* PRODUCT CARD */}
          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition">
            <h3 className="font-semibold text-lg">Business Cards</h3>
            <p className="text-sm text-slate-500 mt-2">
              Premium cards with multiple finishes and paper types.
            </p>

            <Link
              href="/order"
              className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
            >
              Order Now →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition">
            <h3 className="font-semibold text-lg">Flyers</h3>
            <p className="text-sm text-slate-500 mt-2">
              High-quality flyer printing for promotions and events.
            </p>

            <Link
              href="/order"
              className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
            >
              Order Now →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition">
            <h3 className="font-semibold text-lg">Postcards</h3>
            <p className="text-sm text-slate-500 mt-2">
              Durable postcards perfect for marketing campaigns.
            </p>

            <Link
              href="/order"
              className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
            >
              Order Now →
            </Link>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">
            Ready to Print?
          </h2>

          <p className="mt-4 text-slate-300">
            Get started with your order in minutes.
          </p>

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100"
            >
              Start Order
            </Link>

            <Link
              href="/track"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20"
            >
              Track Order
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}