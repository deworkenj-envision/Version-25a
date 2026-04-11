<section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-6 py-10 md:px-10 md:py-14 text-white shadow-xl">
  <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
    {/* Left Side */}
    <div className="max-w-2xl">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
        Top Quality Printing
        <span className="block">Best Prices. Fast Turnaround.</span>
      </h1>

      <p className="mt-4 text-base md:text-lg text-white/90 max-w-xl">
        Easy online ordering for your most popular print products.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/track"
          className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-neutral-900"
        >
          Track Your Order
        </a>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {[
          "Business Cards",
          "Postcards",
          "Flyers",
          "Brochures",
          "Banners",
          "Yard Signs",
          "Menus",
          "Rack Cards",
        ].map((item) => (
          <a
            key={item}
            href="/order"
            className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            {item}
          </a>
        ))}
      </div>
    </div>

    {/* Right Side */}
    <div className="flex justify-center lg:justify-end">
      <div className="overflow-hidden rounded-[24px] bg-white/10 p-2 shadow-2xl backdrop-blur-md">
        <img
          src="/hero-collage.webp"
          alt="Printed products collage"
          className="h-auto w-full max-w-[520px] rounded-[18px] object-cover"
        />
      </div>
    </div>
  </div>
</section>