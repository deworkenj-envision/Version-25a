import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="w-full bg-blue-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-20">
          
          {/* LEFT SIDE TEXT */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="block">Top Quality Printing.</span>
              <span className="block">Fast Turnaround.</span>
              <span className="block">The Best Prices.</span>
            </h1>

            {/* ORDER TRACK */}
            <div className="pt-10 text-center md:text-left">
              <p className="text-xl font-semibold mb-4">
                Already placed an order?
              </p>

              <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl shadow hover:bg-gray-100 transition text-lg">
                Track Your Order
              </button>
            </div>
          </div>

          {/* RIGHT SIDE COLLAGE */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-xl">
              <Image
                src="/images/collage.webp"
                alt="Print Products"
                width={700}
                height={700}
                className="rounded-2xl shadow-2xl object-cover w-full h-auto"
                priority
              />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}