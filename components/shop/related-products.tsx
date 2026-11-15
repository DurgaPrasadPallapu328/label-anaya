import type { Product } from "@/lib/products";
import { ProductCard } from "./product-card";

export function RelatedProducts({ product, catalog }: { product: Product; catalog: readonly Product[] }) {
  const seen = new Set([product.id]);
  const related = [...catalog.filter(item => item.categorySlug === product.categorySlug), ...catalog.filter(item => item.categorySlug !== product.categorySlug)]
    .filter(item => { if (seen.has(item.id)) return false; seen.add(item.id); return true; }).slice(0, 4);
  if (!related.length) return null;
  return <section className="product-related" aria-labelledby="related-products-heading">
    <h2 id="related-products-heading" className="product-section-heading">You May Also Like</h2>
    <p className="product-related-subtitle">Discover more styles from Label Anaya</p>
    <ul className="product-related-grid" aria-label="Related products">{related.map(item => <li key={item.id} className="min-w-0"><ProductCard product={item} /></li>)}</ul>
  </section>;
}
