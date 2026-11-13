import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

function BotanicalDivider() {
  return (
    <div className="botanical-divider flex items-center justify-center" aria-hidden="true">
      <span />
      <svg viewBox="0 0 64 40" fill="none" className="botanical-sprig" focusable="false">
        <path d="M5 35C19 21 32 16 58 6M20 23l4-16M32 17 42 4M35 17l17 9M21 23l12 9" stroke="currentColor" strokeWidth="1.3" />
        <g fill="currentColor" fillOpacity=".55" stroke="currentColor" strokeWidth=".7"><path d="M23 18C18 12 20 6 25 2c1 7 0 12-2 16ZM33 14c-1-7 3-11 9-13-1 6-4 11-9 13ZM44 10c1-5 6-8 13-8-3 5-7 8-13 8ZM39 18c7-1 13 2 17 8-7-1-13-3-17-8ZM25 25c7 0 12 3 15 9-7-1-12-4-15-9ZM15 27c-4-5-3-9 0-14 2 5 2 10 0 14Z" /></g>
      </svg>
      <span />
    </div>
  );
}

export function HeroSection() {
  const { props: desktopImage } = getImageProps({
    src: "/images/Anaya desktop-hero.png",
    alt: "Anaya wearing a floral outfit from Collection 01",
    width: 1672,
    height: 941,
    sizes: "88vw",
  });

  return (
    <section className="hero relative isolate overflow-hidden" aria-labelledby="collection-title">
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktopImage.srcSet} sizes={desktopImage.sizes} width={1672} height={941} />
        <Image src="/images/Anaya mobile-hero.png" alt="Anaya wearing a floral outfit from Collection 01" width={1199} height={1312} sizes="55vw" loading="eager" fetchPriority="high" className="hero-image absolute" />
      </picture>
      <div className="hero-content relative z-10">
        <p className="hero-eyebrow uppercase">THE ANAYA EDIT</p>
        <h1 id="collection-title" className="hero-title whitespace-nowrap italic">Collection 01</h1>
        <p className="hero-description">
          Original designs &amp;{" "}
          <span className="hero-description-middle">trend-inspired outfits</span>{" "}
          <span className="hero-description-ending">crafted for you.</span>
        </p>
        <Link href="/shop" className="collection-button inline-flex min-h-11 items-center justify-center bg-olive text-white hover:bg-olive-dark"><span>Shop the Collection</span><Icon name="arrow" /></Link>
        <BotanicalDivider />
      </div>
    </section>
  );
}
