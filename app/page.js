import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "../lib/supabaseAdmin";

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

function money(value) {
  const number = Number(value);
  return `$${(Number.isFinite(number) ? number : 0).toFixed(2)}`;
}

async function getStartingPrices() {
  try {
    const { data, error } = await supabaseAdmin
      .from("pricing")
      .select("product_name, price")
      .eq("active", true)
      .order("price", { ascending: true });

    if (error || !Array.isArray(data)) {
      console.error("Failed to load homepage starting prices:", error);
      return {};
    }

    const startingPrices = {};

    for (const row of data) {
      const productName = row.product_name;
      const price = Number(row.price);

      if (!productName || !Number.isFinite(price)) continue;

      if (
        startingPrices[productName] === undefined ||
        price < startingPrices[productName]
      ) {
        startingPrices[productName] = price;
      }
    }

    return startingPrices;
  } catch (error) {
    console.error("Homepage starting price error:", error);
    return {};
  }
}

export default async function HomePage() {
  const startingPrices = await getStartingPrices();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[520px_1fr]">
            {/* SINGLE HERO COLLAGE */}
            <div className="mx-auto w-full max-w-[520px]">
              <div className="rounded-[28px] bg-[#2347d8]/40 p-4 shadow-2xl md:p-6">
                <div className="overflow-hidden rounded-[22px]">
                  <Image
                    src="/images/hero-collage-logo.png"
                    alt="EnVision Direct Products"
                    width={600}
                    height={700}
                    className="h-auto w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* HERO CONTENT */}
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
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-lg transition hover:bg-slate-100"
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

              <div className="mt-8 flex flex-wrap gap-4">
                {products.map((product) => (
                  <Link
                    key={product.name}
                    href={product.href}
                    className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
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
            {products.map((product) => {
              const startingPrice = startingPrices[product.name];

              return (
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

                    {startingPrice !== undefined ? (
                      <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow">
                        Starting at {money(startingPrice)}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>

                    {startingPrice !== undefined ? (
                      <div className="mt-4 text-sm font-semibold text-blue-700">
                        Starting at {money(startingPrice)}
                      </div>
                    ) : (
                      <div className="mt-4 text-sm font-semibold text-slate-500">
                        Live pricing available in estimator
                      </div>
                    )}

                    <div className="mt-5 inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                      {product.button}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}