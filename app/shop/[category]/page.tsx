import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { ProductGrid } from "@/components/shop/product-grid";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
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
