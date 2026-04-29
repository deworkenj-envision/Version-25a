import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Postcard Printing Online | EnVision Direct",
  description:
    "Order high-quality postcards online from EnVision Direct. Great for direct mail, promotions, announcements, and marketing campaigns with easy upload and secure checkout.",
};

export default function PostcardPrintingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-100">
              Postcard Printing
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              High-Quality Postcards Printed Fast
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Promote your business, announce events, or reach customers with
              professional postcard printing. Upload your artwork and order
              securely online.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/order?product=Postcards"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-9 py-5 text-lg font-extrabold text-blue-700 shadow-xl transition hover:scale-[1.02] hover:bg-slate-100"
              >
                Order Postcards
              </Link>

              <Link
                href="/track"
                className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-white/10 px-8 py-5 text-lg font-bold text-white transition hover:bg-white/20"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] bg-white/95 p-5 shadow-2xl">
            <Image
              src="/products/postcards.jpg"
              alt="Postcard printing"
              width={800}
              height={600}
              className="h-auto w-full rounded-[22px] object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Great for Marketing</h2>
              <p className="mt-3 text-slate-600">
                Postcards are perfect for promotions, direct mail, coupons,
                events, announcements, and local campaigns.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Live Pricing</h2>
              <p className="mt-3 text-slate-600">
                Select your size, paper, finish, sides, and quantity with
                pricing that updates as you build your order.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Simple Upload</h2>
              <p className="mt-3 text-slate-600">
                Upload your print-ready postcard artwork and complete checkout
                online in minutes.
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-[30px] bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Postcard Printing Made Simple
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
              EnVision Direct makes it easy to order postcards online for direct
              mail, handouts, retail promotions, event announcements, and
              business marketing. Choose your print options, upload your
              artwork, and check out securely.
            </p>

            <div className="mt-8">
              <Link
                href="/order?product=Postcards"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-9 py-5 text-lg font-extrabold text-white shadow-xl transition hover:bg-blue-800"
              >
                Start Your Postcard Order →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

<div className="mt-12 border-t pt-8">
  <h3 className="mb-4 text-lg font-semibold">
    Explore Other Printing Products
  </h3>

  <div className="flex flex-wrap gap-4">
    <a href="/business-cards" className="text-blue-600 hover:underline">
      Business Cards
    </a>
    <a href="/flyers" className="text-blue-600 hover:underline">
      Flyers
    </a>
    <a href="/banners" className="text-blue-600 hover:underline">
      Banners
    </a>
  </div>
</div>