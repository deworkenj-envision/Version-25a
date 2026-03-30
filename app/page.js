export default function HomePage() {
  const featuredProducts = [
    {
      name: "Business Cards",
      desc: "Premium finishes, fast turnaround, and clean professional presentation.",
      price: "From $29",
      image:
        "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Flyers",
      desc: "High-impact promotional prints for events, offers, and local marketing.",
      price: "From $49",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Banners",
      desc: "Large-format prints designed to stand out indoors and outdoors.",
      price: "From $79",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const categories = [
    "Business Cards",
    "Flyers",
    "Postcards",
    "Brochures",
    "Banners",
    "Signs",
  ];

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              Premium Print Shop
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
              Print products that look premium before they even leave the box.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">
              Business cards, flyers, banners, and branded materials with a polished
              storefront experience your customers can trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-lg transition hover:scale-[1.02]"
              >
                Shop Products
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="flex flex-wrap items-center gap-3">
            {categories.map((item) => (
              <span
                key={item}
                className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Featured Products
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Built for brands that want to look serious
            </h2>
          </div>
          <a
            href="#"
            className="hidden text-sm font-semibold text-neutral-700 md:inline-block"
          >
            View all products →
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1"
            >
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                    {product.price}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  {product.desc}
                </p>
                <button className="mt-6 inline-flex rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700">
                  Customize Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Premium Quality
              </p>
              <h3 className="mt-4 text-2xl font-semibold">Sharp color, better stock</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Present your brand with print materials that feel high-end and
                professional from the first touch.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Easy Ordering
              </p>
              <h3 className="mt-4 text-2xl font-semibold">A storefront that converts</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Cleaner product discovery, clearer pricing, and modern sections that
                feel like a real customer-facing site.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Fast Turnaround
              </p>
              <h3 className="mt-4 text-2xl font-semibold">From design to delivery</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Keep orders moving with a polished experience that makes your print
                business feel credible and established.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            A smoother print ordering experience
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Choose your product",
              text: "Select from premium print categories designed for businesses, events, and promotions.",
            },
            {
              step: "02",
              title: "Upload or customize",
              text: "Submit artwork, request edits, or begin with a simple guided design flow.",
            },
            {
              step: "03",
              title: "Approve and print",
              text: "Review your order details, confirm the job, and move into production with confidence.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8"
            >
              <span className="text-sm font-semibold text-neutral-400">{item.step}</span>
              <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-neutral-100 px-8 py-14 md:px-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Ready to start?
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
              Launch a print storefront that feels established from day one.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
              This version is designed to look polished immediately without needing
              extra component files or local image assets.
            </p>
            <div className="mt-8">
              <button className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700">
                Start Your Order
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}