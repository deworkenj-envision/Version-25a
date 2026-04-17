import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Business Cards",
    description: "Premium cards for a polished first impression.",
    image: "/products/business-cards.jpg",
    href: "/order?product=Business%20Cards",
  },
  {
    name: "Postcards",
    description: "High-quality postcards for promotions and direct mail.",
    image: "/products/postcards.jpg",
    href: "/order?product=Postcards",
  },
  {
    name: "Flyers",
    description: "Bold, vibrant flyers for events, menus, and advertising.",
    image: "/products/flyers.jpg",
    href: "/order?product=Flyers",
  },
  {
    name: "Banners",
    description: "Large-format banners for indoor and outdoor visibility.",
    image: "/products/banners.jpg",
    href: "/order?product=Banners",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-14 md:px-10 lg:flex-row lg:justify-between lg:py-20">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:justify-start">
              <Image
                src="/logo.png"
                alt="EnVision Direct"
                width={260}
                height={90}
                className="h-auto w-auto max-w-[260px]"
                priority
              />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              <span className="block">Top Quality Printing.</span>
              <span className="block">Fast Turnaround.</span>
              <span className="block">The Best Prices.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg text-blue-50 lg:mx-0">
              Postcards, flyers, business cards and banners — professionally
              printed and delivered with speed and care.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/order"
                className="rounded-full bg-white px-7 py-3 text-base font-semibold text-blue-700 shadow-md transition hover:scale-[1.02] hover:bg-slate-100"
              >
                Start Your Order
              </Link>

              <Link
                href="/track"
                className="rounded-full border border-white/70 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="overflow-hidden rounded-3xl bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-2xl bg-white">
                  <Image
                    src="/products/postcards.jpg"
                    alt="Postcards"
                    width={600}
                    height={450}
                    className="h-44 w-full object-cover md:h-52"
                    priority
                  />
                </div>
                <div className="overflow-hidden rounded-2xl bg-white">
                  <Image
                    src="/products/business-cards.jpg"
                    alt="Business Cards"
                    width={600}
                    height={450}
                    className="h-44 w-full object-cover md:h-52"
                    priority
                  />
                </div>
                <div className="overflow-hidden rounded-2xl bg-white">
                  <Image
                    src="/products/flyers.jpg"
                    alt="Flyers"
                    width={600}
                    height={450}
                    className="h-44 w-full object-cover md:h-52"
                    priority
                  />
                </div>
                <div className="overflow-hidden rounded-2xl bg-white">
                  <Image
                    src="/products/banners.jpg"
                    alt="Banners"
                    width={600}
                    height={450}
                    className="h-44 w-full object-cover md:h-52"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Choose Your Product
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
            Select a product below to begin your order and upload your print-ready artwork.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={800}
                  height={600}
                  className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.description}
                </p>

                <div className="mt-5 inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                  Order {product.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}