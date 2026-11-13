import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

const priceFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="min-w-0">
      <Link href={`/products/${product.slug}`} className="group block rounded-xl">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-peach">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, 46vw" className="object-cover motion-safe:transition-transform motion-safe:group-hover:scale-105" />
        </div>
        <h2 className="mt-4 break-words text-lg group-hover:text-olive group-hover:underline sm:text-xl">{product.name}</h2>
        <p className="mt-1 text-lg text-olive">{priceFormatter.format(product.price)}</p>
      </Link>
    </article>
  );
}
