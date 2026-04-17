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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-16 md:px-10">
          
          {/* LEFT SIDE */}
          <div className="max-w-xl">
            {/* LOGO */}
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="EnVision Direct"
                width={240}
                height={80}
                className="h-auto w-auto"
                priority
              />
            </div>

            {/* HEADLINE */}
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              <span className="block">Top Quality Printing.</span>
              <span className="block">Fast Turnaround.</span>
              <span className="block">The Best Prices.</span>
            </h1>

            {/* SUBTEXT */}
            <p className="mt-5 text-lg text-blue-100">
              Postcards, flyers, business cards and banners — professionally
              printed and delivered with speed and care.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex gap-4">
              <Link
                href="/order"
                className="rounded-full bg-white px-7 py-3 font-semibold text-blue-700 shadow hover:bg-gray-100"
              >
                Start Your Order
              </Link>

              <Link
                href="/track"
                className="rounded-full border border-white px-7 py-3 font-semibold text-white hover:bg-white/10"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE COLLAGE */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <Image
              src="/products/postcards.jpg"
              alt="Postcards"
              width={300}
              height={220}
              className="rounded-xl object-cover"
            />
            <Image
              src="/products/business-cards.jpg"
              alt="Business Cards"
              width={300}
              height={220}
              className="rounded-xl object-cover"
            />
            <Image
              src="/products/flyers.jpg"
              alt="Flyers"
              width={300}
              height={220}
              className="rounded-xl object-cover"
            />
            <Image
              src="/products/banners.jpg"
              alt="Banners"
              width={300}
              height={220}
              className="rounded-xl object-cover"
            />
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
            Select a product to begin your order.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group rounded-2xl border bg-white shadow hover:shadow-lg transition"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={600}
                className="h-60 w-full object-cover rounded-t-2xl"
              />

              <div className="p-5">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {product.description}
                </p>

                <div className="mt-4 text-blue-600 font-semibold">
                  Order Now →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}