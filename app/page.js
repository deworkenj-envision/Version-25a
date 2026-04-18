import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Business Cards",
    description: "Premium cards for a polished first impression.",
    image: "/products/business-cards.jpg",
    href: "/order?product=Business%20Cards",
    button: "Order Business Cards",
  },
  {
    name: "Flyers",
    description: "Bold, vibrant flyers for events, menus, and advertising.",
    image: "/products/flyers.jpg",
    href: "/order?product=Flyers",
    button: "Order Flyers",
  },
  {
    name: "Postcards",
    description: "High-quality postcards for promotions and direct mail.",
    image: "/products/postcards.jpg",
    href: "/order?product=Postcards",
    button: "Order Postcards",
  },
  {
    name: "Banners",
    description: "Large-format banners for indoor and outdoor visibility.",
    image: "/products/banners.jpg",
    href: "/order?product=Banners",
    button: "Order Banners",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[520px_1fr]">
            
            {/* ✅ SINGLE COLLAGE IMAGE ONLY */}
            <div className="mx-auto w-full max-w-[520px]">
              <div className="rounded-[28px] bg-[#2347d8]/40 p-4 shadow-2xl md:p-6">
                <div className="overflow-hidden rounded-[22px]">
                  <Image
                    src="/images/hero-collage-logo.png"
                    alt="EnVision Direct Products"
                    width={600}
                    height={700}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl xl:text-[4rem]">
                <span className="block">Top Quality Printing.</span>
                <span className="mt-2 block">Fast Turnaround.</span>
                <span className="mt-2 block">The Best Prices.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-blue-100 md:text-lg">
                Professional online printing with easy artwork upload, secure
                checkout, and order tracking built in.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-lg hover:bg-slate-100"
                >
                  Start Your Order
                </Link>

                <Link
                  href="/track"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-white/5 px-8 py-4 text-lg font-bold text-white hover:bg-white/10"
                >
                  Track Your Order
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {products.map((product) => (
                  <Link
                    key={product.name}
                    href={product.href}
                    className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white hover:bg-white/18"
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCT SECTION (WITH THUMBNAILS) */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Choose Your Product
            </h2>
            <p className="mt-3 text-slate-600">
              Select a product below to begin your order and upload your artwork.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group overflow-hidden rounded-3xl border bg-white shadow hover:shadow-xl transition"
              >
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={600}
                    className="h-64 w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {product.description}
                  </p>

                  <div className="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-2 text-white text-sm font-semibold">
                    {product.button}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/order"
              className="inline-flex rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-700"
            >
              Start Your Order
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}