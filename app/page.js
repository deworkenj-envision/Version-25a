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
    name: "Flyers",
    description: "Bold, vibrant flyers for events, menus, and advertising.",
    image: "/products/flyers.jpg",
    href: "/order?product=Flyers",
  },
  {
    name: "Postcards",
    description: "High-quality postcards for promotions and direct mail.",
    image: "/products/postcards.jpg",
    href: "/order?product=Postcards",
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
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[620px_1fr]">
            {/* LEFT: COLLAGE WITH LOGO ON TOP */}
            <div className="mx-auto w-full max-w-[620px]">
              <div className="overflow-hidden bg-[#2347d8]/40 shadow-2xl">
                {/* TOP LOGO PANEL */}
                <div className="bg-gradient-to-r from-[#2347d8] via-[#2957eb] to-[#2f67f2] px-8 py-14">
                  <div className="flex justify-center">
                    <Image
                      src="/logo.png"
                      alt="EnVision Direct"
                      width={430}
                      height={140}
                      className="h-auto w-auto max-w-full"
                      priority
                    />
                  </div>
                </div>

                {/* 4 IMAGE COLLAGE */}
                <div className="grid grid-cols-2 gap-[4px] bg-white/20 p-[4px]">
                  <div className="relative overflow-hidden bg-white">
                    <Image
                      src="/products/postcards.jpg"
                      alt="Postcards"
                      width={700}
                      height={520}
                      className="h-[265px] w-full object-cover"
                      priority
                    />
                    <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-sm font-bold text-slate-800 shadow">
                      Postcards
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-white">
                    <Image
                      src="/products/business-cards.jpg"
                      alt="Business Cards"
                      width={700}
                      height={520}
                      className="h-[265px] w-full object-cover"
                      priority
                    />
                    <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-sm font-bold text-slate-800 shadow">
                      Business Cards
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-white">
                    <Image
                      src="/products/flyers.jpg"
                      alt="Flyers"
                      width={700}
                      height={520}
                      className="h-[265px] w-full object-cover"
                      priority
                    />
                    <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-sm font-bold text-slate-800 shadow">
                      Flyers
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-white">
                    <Image
                      src="/products/banners.jpg"
                      alt="Banners"
                      width={700}
                      height={520}
                      className="h-[265px] w-full object-cover"
                      priority
                    />
                    <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-sm font-bold text-slate-800 shadow">
                      Banners
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: HERO TEXT */}
            <div className="max-w-2xl">
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl xl:text-[4.4rem]">
                <span className="block">Top Quality Printing.</span>
                <span className="mt-2 block">Fast Turnaround.</span>
                <span className="mt-2 block">The Best Prices.</span>
              </h1>

              <p className="mt-10 max-w-xl text-lg leading-8 text-blue-100 md:text-[1.35rem] md:leading-10">
                Professional online printing with live pricing, easy artwork
                upload, secure checkout, and order tracking built in.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-lg transition hover:scale-[1.02] hover:bg-slate-100"
                >
                  Start Your Order
                </Link>

                <Link
                  href="/track"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-white/5 px-8 py-4 text-lg font-bold text-white transition hover:bg-white/10"
                >
                  Track Your Order
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/order?product=Business%20Cards"
                  className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
                >
                  Business Cards
                </Link>
                <Link
                  href="/order?product=Flyers"
                  className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
                >
                  Flyers
                </Link>
                <Link
                  href="/order?product=Postcards"
                  className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
                >
                  Postcards
                </Link>
                <Link
                  href="/order?product=Banners"
                  className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
                >
                  Banners
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Choose Your Product
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
            Select a product below to begin your order and upload your
            print-ready artwork.
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