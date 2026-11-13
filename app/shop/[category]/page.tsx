import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { ProductGrid } from "@/components/shop/product-grid";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

type CategoryPageProps = { params: Promise<{ category: string }> };

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<p role="status" className="py-8 text-lg text-muted">Loading collection…</p>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = categories.find((category) => category.slug === slug);
  if (!category) notFound();
  const categoryProducts = await getProducts(category.slug);
  return (
    <>
      <Breadcrumbs current={category.name} />
      <ProductGrid products={categoryProducts} />
    </>
  );
}
