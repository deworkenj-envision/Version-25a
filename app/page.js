export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">

      {/* HERO SECTION (FIXED HEADER ONLY) */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 px-6 text-center">
        
        {/* HEADLINE */}
        <h1 className="text-5xl font-bold mb-6">
          Top Quality Printing with the Best Prices
        </h1>

        {/* SUBHEAD */}
        <p className="text-2xl font-medium mb-8">
          Fast Turnaround
        </p>

        {/* PRODUCT LIST (PROMINENT + ORDERED) */}
        <div className="flex flex-wrap justify-center gap-6 text-lg font-semibold mb-10">
          <span className="border-b border-white pb-1">Postcards</span>
          <span className="border-b border-white pb-1">Flyers</span>
          <span className="border-b border-white pb-1">Business Cards</span>
          <span className="border-b border-white pb-1">Banners</span>
        </div>

        {/* CTA */}
        <button className="bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition">
          Start Order
        </button>

      </section>


      {/* SHOP PRODUCTS SECTION (UNCHANGED STRUCTURE) */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold mb-10 text-center">
          Shop Products
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {/* POSTCARDS */}
          <div className="border rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Postcards</h3>
            <p className="text-sm text-gray-600 mb-4">
              High-quality postcard printing
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Start Order
            </button>
          </div>

          {/* FLYERS */}
          <div className="border rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Flyers</h3>
            <p className="text-sm text-gray-600 mb-4">
              Perfect for promotions & events
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Start Order
            </button>
          </div>

          {/* BUSINESS CARDS */}
          <div className="border rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Business Cards</h3>
            <p className="text-sm text-gray-600 mb-4">
              Premium finishes available
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Start Order
            </button>
          </div>

          {/* BANNERS */}
          <div className="border rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Banners</h3>
            <p className="text-sm text-gray-600 mb-4">
              Durable indoor & outdoor banners
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Start Order
            </button>
          </div>

        </div>

      </section>

    </main>
  );
}