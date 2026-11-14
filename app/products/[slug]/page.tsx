import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/home/header";
import { ProductImageGallery } from "@/components/shop/product-image-gallery";
import { ProductPurchase } from "@/components/shop/product-purchase";
import { products } from "@/lib/products";
import { categories } from "@/lib/categories";
import { ProductPrice } from "@/components/shop/product-price";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export default function ProductPage({ params }: Props) {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header currentPage="product" /><main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6"><Suspense fallback={<p role="status" className="py-8 text-muted">Loading product…</p>}><ProductDetails params={params} /></Suspense></main></>;
}

async function ProductDetails({ params }: Props) {
  const { slug } = await params;
  const product = products.find((product) => product.slug === slug);
  if (!product) notFound();
  const category = categories.find((category) => category.slug === product.categorySlug);
  const images = product.images?.length ? product.images : [{ id: "main", src: product.image, alt: product.name, label: "Product image" }];
  return <><nav aria-label="Breadcrumb" className="mb-4 text-base text-muted sm:mb-6"><ol className="flex flex-wrap items-center gap-3"><li><Link href="/" className="hover:underline">Home</Link></li>{category && <><li aria-hidden="true">&gt;</li><li><Link href={`/shop/${category.slug}`} className="hover:underline">{category.name}</Link></li></>}<li aria-hidden="true">&gt;</li><li aria-current="page">{product.name}</li></ol></nav><div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)]"><ProductImageGallery images={images} /><div className="min-w-0"><h1 className="text-3xl text-olive sm:text-4xl">{product.name}</h1><ProductPrice price={product.price} originalPrice={product.originalPrice} demoDiscount={product.demoDiscount} variant="details" /><ProductPurchase key={product.id} product={product} /></div></div></>;
}
