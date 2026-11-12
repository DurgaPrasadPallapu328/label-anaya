
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#302d24]">
      {/* Announcement bar */}
      <div className="bg-[#3e4b2c] px-4 py-2 text-center text-xs tracking-widest text-white">
        MADE TO ORDER &nbsp; | &nbsp; CUSTOM TAILORING AVAILABLE
      </div>

      {/* Navigation */}
      <header className="border-b border-[#e9e2d8] bg-[#fffaf5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">
          <Link href="/" className="font-serif text-3xl tracking-[0.15em]">
            ANAYA
            <span className="block text-center text-[10px] tracking-[0.4em]">
              LABEL
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-6 text-sm">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop All</Link>
            <Link href="/originals">Anaya Originals</Link>
            <Link href="/trending">Trending Styles</Link>
          </nav>

          <div className="flex items-center gap-5 text-sm">
            <Link href="/favorites" aria-label="Favorites">♡</Link>
            <Link href="/cart" aria-label="Shopping bag">Bag</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main>
        <section className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-8 py-16 md:grid-cols-2 md:px-16">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#77745f]">
              The Anaya Edit
            </p>

            <h1 className="font-serif text-6xl leading-tight md:text-7xl">
              Collection
              <br />
              <span className="italic">01</span>
            </h1>

            <p className="mt-7 max-w-md text-lg leading-relaxed text-[#777064]">
              Original designs and trend-inspired outfits,
              thoughtfully crafted for you.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded bg-[#3e4b2c] px-7 py-4 text-sm text-white hover:bg-[#303b22]"
              >
                Shop the Collection →
              </Link>

              <Link
                href="/login"
                className="rounded border border-[#3e4b2c] px-7 py-4 text-sm"
              >
                Login / Sign Up
              </Link>
            </div>
          </div>

          <div className="flex min-h-[420px] items-center justify-center rounded-lg bg-[#e8d8c7] p-8 text-center">
            <div>
              <p className="font-serif text-3xl text-[#665749]">
                Label Anaya
              </p>
              <p className="mt-3 text-sm text-[#766c60]">
                Anaya&apos;s collection photograph
                <br />
                will appear here.
              </p>
            </div>
          </div>
        </section>

        {/* Service banners */}
        <section className="mx-auto grid max-w-7xl gap-6 px-8 pb-20 md:grid-cols-2 md:px-16">
          <div className="rounded-lg bg-[#f0e5db] p-9">
            <p className="mb-3 text-3xl">✂</p>
            <h2 className="font-serif text-3xl">
              Custom Tailoring
            </h2>
            <p className="mt-3 text-sm text-[#746c62]">
              Get outfits stitched to your requirements.
              Share your design and receive a quotation.
            </p>
            <Link
              href="/custom-tailoring"
              className="mt-6 inline-block rounded bg-[#3e4b2c] px-6 py-3 text-sm text-white"
            >
              Know More →
            </Link>
          </div>

          <div className="rounded-lg bg-[#e9e5dc] p-9">
            <p className="mb-3 text-3xl">♧</p>
            <h2 className="font-serif text-3xl">
              Book a Video Measurement Call
            </h2>
            <p className="mt-3 text-sm text-[#746c62]">
              Get guidance for your measurements and
              find the perfect fit.
            </p>
            <Link
              href="/consultation"
              className="mt-6 inline-block rounded bg-[#3e4b2c] px-6 py-3 text-sm text-white"
            >
              Book Now →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e9e2d8] px-6 py-8 text-center text-sm text-[#777064]">
        © {new Date().getFullYear()} Label Anaya. All rights reserved.
      </footer>
    </div>
  );
}
