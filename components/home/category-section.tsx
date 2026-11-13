import Image from "next/image";
import Link from "next/link";
import { categories, type Category } from "@/lib/categories";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={category.href} className="category-card flex min-w-0 items-center bg-peach hover:bg-peach-dark lg:flex-col lg:justify-center">
      <span className="category-artwork relative block shrink-0 overflow-hidden" aria-hidden="true">
        {/* The supplied cards include text; show only their illustration area. */}
        <Image
          src={category.image}
          alt=""
          width={1536}
          height={1024}
          sizes="(min-width: 1024px) 310px, (min-width: 640px) 250px, 30vw"
          className="category-source absolute"
        />
      </span>
      <span className="category-label">{category.name}</span>
    </Link>
  );
}

export function CategorySection() {
  return (
    <section className="category-section mx-auto" aria-labelledby="category-heading">
      <div className="category-heading flex items-center justify-center"><span aria-hidden="true" /><h2 id="category-heading" className="shrink-0 font-bold">Shop by Category</h2><span aria-hidden="true" /></div>
      <div className="category-grid grid grid-cols-2 lg:grid-cols-5">{categories.map((category) => <CategoryCard key={category.href} category={category} />)}</div>
    </section>
  );
}
