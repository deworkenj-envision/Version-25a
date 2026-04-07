export default function HomePage() {
  return (
    <main>

      {/* HERO */}
      <section className="bg-[#1e3a8a] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Top Quality Printing at the Best Prices
            </h1>

            <p className="text-lg text-blue-100 mb-8">
              Premium business cards, flyers, and marketing materials —
              fast, affordable, and professionally printed.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-4 mb-10">
              <a
                href="/order"
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Start Order
              </a>

              <a
                href="/order"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
              >
                Track Order
              </a>
            </div>

            {/* PROCESS BOX */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">
                We make it easy:
              </h3>

              <ul className="space-y-2 text-blue-100">
                <li>• Pick the product you want</li>
                <li>• Choose paper, quantity, and finishes</li>
                <li>• Upload your print-ready artwork</li>
                <li>• Place your order</li>
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1581090700227-1e8c6b6f1c3d"
              alt="Printing process"
              className="rounded-2xl shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold mb-10">
            Popular Products
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* CARD */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">
                Business Cards
              </h3>
              <p className="text-gray-600 mb-4">
                Premium cards with multiple finishes and paper types.
              </p>
              <a href="/order" className="text-blue-600 font-semibold">
                Order Now →
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">
                Flyers
              </h3>
              <p className="text-gray-600 mb-4">
                High-quality flyer printing for promotions and events.
              </p>
              <a href="/order" className="text-blue-600 font-semibold">
                Order Now →
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">
                Postcards
              </h3>
              <p className="text-gray-600 mb-4">
                Durable postcards perfect for marketing campaigns.
              </p>
              <a href="/order" className="text-blue-600 font-semibold">
                Order Now →
              </a>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}