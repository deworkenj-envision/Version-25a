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
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[620px_1fr]">

            {/* LEFT COLLAGE (ONLY ONE) */}
            <div className="mx-auto w-full max-w-[620px]">
              <div className="overflow-hidden bg-[#2347d8]/40 shadow-2xl">

                {/* LOGO PANEL */}
                <div className="flex min-h-[170px] items-center justify-center bg-gradient-to-r from-[#2848db] via-[#2d57eb] to-[#3567f3] px-8 py-10">
                  <Image
                    src="/logo.png"
                    alt="EnVision Direct"
                    width={430}
                    height={140}
                    className="h-auto w-auto max-w-full object-contain"
                    priority
                  />
                </div>

                {/* 4 IMAGE GRID */}
                <div className="grid grid-cols-2 gap-[4px] bg-white/20 p-[4px]">
                  <div className="relative overflow-hidden bg-white">
                    <Image src="/products/postcards.jpg" alt="Postcards" width={700} height={520} className="h-[265px] w-full object-cover" />
                    <div className="absolute left-3 top-3 bg-white px-3 py-1 text-sm font-bold text-slate-800 rounded-md shadow">
                      Postcards
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-white">
                    <Image src="/products/business-cards.jpg" alt="Business Cards" width={700} height={520} className="h-[265px] w-full object-cover" />
                    <div className="absolute left-3 top-3 bg-white px-3 py-1 text-sm font-bold text-slate-800 rounded-md shadow">
                      Business Cards
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-white">
                    <Image src="/products/flyers.jpg" alt="Flyers" width={700} height={520} className="h-[265px] w-full object-cover" />
                    <div className="absolute left-3 top-3 bg-white px-3 py-1 text-sm font-bold text-slate-800 rounded-md shadow">
                      Flyers
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-white">
                    <Image src="/products/banners.jpg" alt="Banners" width={700} height={520} className="h-[265px] w-full object-cover" />
                    <div className="absolute left-3 top-3 bg-white px-3 py-1 text-sm font-bold text-slate-800 rounded-md shadow">
                      Banners
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT TEXT */}
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl xl:text-[4.1rem]">
                <span className="block">Top Quality Printing.</span>
                <span className="block mt-2">Fast Turnaround.</span>
                <span className="block mt-2">The Best Prices.</span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-blue-100">
                Professional online printing with live pricing, easy artwork upload,
                secure checkout, and order tracking built in.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/order" className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-lg hover:bg-slate-100">
                  Start Your Order
                </Link>

                <Link href="/track" className="rounded-2xl border border-white/40 px-8 py-4 text-lg font-bold text-white hover:bg-white/10">
                  Track Your Order
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/order?product=Business%20Cards" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white">
                  Business Cards
                </Link>
                <Link href="/order?product=Flyers" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white">
                  Flyers
                </Link>
                <Link href="/order?product=Postcards" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white">
                  Postcards
                </Link>
                <Link href="/order?product=Banners" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white">
                  Banners
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ORDER SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Choose Your Product
          </h2>
          <p className="mt-3 text-slate-600">
            Select a product below to begin your order.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product.name} href={product.href} className="group rounded-2xl border bg-white shadow hover:shadow-lg transition">
              <Image src={product.image} alt={product.name} width={800} height={600} className="h-60 w-full object-cover rounded-t-2xl" />
              <div className="p-5">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                <div className="mt-4 text-blue-600 font-semibold">Order Now →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}