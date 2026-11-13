import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProducts } from "@/lib/products";

export default async function ShopPage() {
  return (
    <>
      <Breadcrumbs current="Shop All" />
      <h1 className="mb-10 text-center text-4xl text-olive sm:text-5xl">Shop All</h1>
      <ProductGrid products={await getProducts()} />
    </>
  );
}
