import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[520px_1fr]">
            
            {/* LEFT COLLAGE */}
            <div className="mx-auto w-full max-w-[520px]">
              <div className="overflow-hidden bg-[#2347d8]/40 p-6 shadow-2xl">
                <div className="overflow-hidden bg-gradient-to-r from-[#2848db] via-[#2d57eb] to-[#3567f3]">
                  
                  {/* LOGO */}
                  <div className="flex min-h-[180px] items-center justify-center px-8 py-10">
                    <Image
                      src="/logo.png"
                      alt="EnVision Direct"
                      width={380}
                      height={120}
                      className="h-auto w-auto max-w-full object-contain"
                      priority
                    />
                  </div>

                  {/* COLLAGE GRID */}
                  <div className="grid grid-cols-2 gap-[4px] bg-white/20 p-[4px]">
                    
                    <div className="relative overflow-hidden bg-white">
                      <Image
                        src="/products/postcards.jpg"
                        alt="Postcards"
                        width={700}
                        height={520}
                        className="h-[235px] w-full object-cover"
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
                        className="h-[235px] w-full object-cover"
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
                        className="h-[235px] w-full object-cover"
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
                        className="h-[235px] w-full object-cover"
                        priority
                      />
                      <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-sm font-bold text-slate-800 shadow">
                        Banners
                      </div>
                    </div>

                  </div>
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
                Professional online printing with live pricing, easy artwork
                upload, secure checkout, and order tracking built in.
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

              {/* PRODUCT QUICK LINKS */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/order?product=Business%20Cards" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/18">
                  Business Cards
                </Link>
                <Link href="/order?product=Flyers" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/18">
                  Flyers
                </Link>
                <Link href="/order?product=Postcards" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/18">
                  Postcards
                </Link>
                <Link href="/order?product=Banners" className="rounded-full bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/18">
                  Banners
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}