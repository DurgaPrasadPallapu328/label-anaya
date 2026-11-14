import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProducts } from "@/lib/products";

export default async function ShopPage() {
  return (
    <>
      <h1 className="shop-all-heading sr-only">Shop All</h1>
      <Breadcrumbs current="Shop All" className="mb-5 sm:mb-7" />
      <ProductGrid products={await getProducts()} />
    </>
  );
}
