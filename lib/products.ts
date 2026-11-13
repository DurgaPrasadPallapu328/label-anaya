export type ProductSize = "S" | "M" | "L" | "XL";
export interface ProductImage { id: string; src: string; alt: string; label: string }
export interface ProductSizeOption { size: ProductSize; enabled: boolean; maxQuantity?: number }

export interface Product {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  image: string;
  images?: readonly ProductImage[];
  sizes?: readonly ProductSizeOption[];
}

// Temporary sample inventory. Prices are in INR. Replace getProducts with database
// queries when the backend is connected, preserving the Product contract.
export const products: readonly Product[] = [
  {
    "id": "LA001",
    "name": "Sage A-Line Kurti Set",
    "slug": "sage-a-line-kurti-set",
    "categorySlug": "kurtis",
    "price": 1699,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA002",
    "name": "Burgundy Straight Kurti Set",
    "slug": "burgundy-straight-kurti-set",
    "categorySlug": "kurtis",
    "price": 1599,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA003",
    "name": "Ivory Chikankari Kurti",
    "slug": "ivory-chikankari-kurti",
    "categorySlug": "kurtis",
    "price": 1899,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA004",
    "name": "Indigo Block Print Kurti",
    "slug": "indigo-block-print-kurti",
    "categorySlug": "kurtis",
    "price": 1499,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA005",
    "name": "Rose Cotton Angrakha Kurti",
    "slug": "rose-cotton-angrakha-kurti",
    "categorySlug": "kurtis",
    "price": 1799,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA006",
    "name": "Mustard Embroidered Kurti",
    "slug": "mustard-embroidered-kurti",
    "categorySlug": "kurtis",
    "price": 1999,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA007",
    "name": "Olive Linen Kurti",
    "slug": "olive-linen-kurti",
    "categorySlug": "kurtis",
    "price": 1599,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA008",
    "name": "Peach Floral Kurti Set",
    "slug": "peach-floral-kurti-set",
    "categorySlug": "kurtis",
    "price": 2199,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA009",
    "name": "Sage Linen Co-ord Set",
    "slug": "sage-linen-co-ord-set",
    "categorySlug": "co-ord-sets",
    "price": 2499,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA010",
    "name": "Mocha Relaxed Co-ord Set",
    "slug": "mocha-relaxed-co-ord-set",
    "categorySlug": "co-ord-sets",
    "price": 2299,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA011",
    "name": "Ivory Cotton Co-ord Set",
    "slug": "ivory-cotton-co-ord-set",
    "categorySlug": "co-ord-sets",
    "price": 2399,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA012",
    "name": "Indigo Printed Co-ord Set",
    "slug": "indigo-printed-co-ord-set",
    "categorySlug": "co-ord-sets",
    "price": 2699,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA013",
    "name": "Dusty Rose Lounge Co-ord Set",
    "slug": "dusty-rose-lounge-co-ord-set",
    "categorySlug": "co-ord-sets",
    "price": 2199,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA014",
    "name": "Olive Tailored Co-ord Set",
    "slug": "olive-tailored-co-ord-set",
    "categorySlug": "co-ord-sets",
    "price": 2899,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA015",
    "name": "Sand Striped Co-ord Set",
    "slug": "sand-striped-co-ord-set",
    "categorySlug": "co-ord-sets",
    "price": 2599,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA016",
    "name": "Terracotta Wrap Co-ord Set",
    "slug": "terracotta-wrap-co-ord-set",
    "categorySlug": "co-ord-sets",
    "price": 2799,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA017",
    "name": "Sage Tiered Midi Dress",
    "slug": "sage-tiered-midi-dress",
    "categorySlug": "dresses",
    "price": 2199,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA018",
    "name": "Burgundy Wrap Dress",
    "slug": "burgundy-wrap-dress",
    "categorySlug": "dresses",
    "price": 2499,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA019",
    "name": "Ivory Floral Maxi Dress",
    "slug": "ivory-floral-maxi-dress",
    "categorySlug": "dresses",
    "price": 2799,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA020",
    "name": "Indigo Cotton Shirt Dress",
    "slug": "indigo-cotton-shirt-dress",
    "categorySlug": "dresses",
    "price": 1999,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA021",
    "name": "Rose Pleated Midi Dress",
    "slug": "rose-pleated-midi-dress",
    "categorySlug": "dresses",
    "price": 2599,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA022",
    "name": "Mustard Smocked Dress",
    "slug": "mustard-smocked-dress",
    "categorySlug": "dresses",
    "price": 2299,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA023",
    "name": "Olive Belted Linen Dress",
    "slug": "olive-belted-linen-dress",
    "categorySlug": "dresses",
    "price": 2699,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA024",
    "name": "Peach Ruffle Maxi Dress",
    "slug": "peach-ruffle-maxi-dress",
    "categorySlug": "dresses",
    "price": 2899,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA025",
    "name": "Emerald Silk Blend Anarkali Set",
    "slug": "emerald-silk-blend-anarkali-set",
    "categorySlug": "ethnic-wear",
    "price": 4499,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA026",
    "name": "Burgundy Festive Sharara Set",
    "slug": "burgundy-festive-sharara-set",
    "categorySlug": "ethnic-wear",
    "price": 4999,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA027",
    "name": "Ivory Embroidered Palazzo Set",
    "slug": "ivory-embroidered-palazzo-set",
    "categorySlug": "ethnic-wear",
    "price": 3999,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA028",
    "name": "Navy Brocade Kurta Set",
    "slug": "navy-brocade-kurta-set",
    "categorySlug": "ethnic-wear",
    "price": 3799,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA029",
    "name": "Rose Organza Dupatta Set",
    "slug": "rose-organza-dupatta-set",
    "categorySlug": "ethnic-wear",
    "price": 4299,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA030",
    "name": "Mustard Bandhani Suit Set",
    "slug": "mustard-bandhani-suit-set",
    "categorySlug": "ethnic-wear",
    "price": 3499,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA031",
    "name": "Olive Chanderi Suit Set",
    "slug": "olive-chanderi-suit-set",
    "categorySlug": "ethnic-wear",
    "price": 4599,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA032",
    "name": "Peach Embellished Lehenga Set",
    "slug": "peach-embellished-lehenga-set",
    "categorySlug": "ethnic-wear",
    "price": 5999,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA033",
    "name": "Sage Tailored Blazer",
    "slug": "sage-tailored-blazer",
    "categorySlug": "western-wear",
    "price": 2999,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA034",
    "name": "Mocha Wide Leg Trousers",
    "slug": "mocha-wide-leg-trousers",
    "categorySlug": "western-wear",
    "price": 1899,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA035",
    "name": "Ivory Satin Blouse",
    "slug": "ivory-satin-blouse",
    "categorySlug": "western-wear",
    "price": 1699,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA036",
    "name": "Indigo Denim Overshirt",
    "slug": "indigo-denim-overshirt",
    "categorySlug": "western-wear",
    "price": 2199,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA037",
    "name": "Rose Ruched Top",
    "slug": "rose-ruched-top",
    "categorySlug": "western-wear",
    "price": 1499,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA038",
    "name": "Sand Linen Waistcoat",
    "slug": "sand-linen-waistcoat",
    "categorySlug": "western-wear",
    "price": 1999,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA039",
    "name": "Olive Cargo Trousers",
    "slug": "olive-cargo-trousers",
    "categorySlug": "western-wear",
    "price": 2099,
    "image": "/images/product-placeholder.svg"
  },
  {
    "id": "LA040",
    "name": "Black Pleated Midi Skirt",
    "slug": "black-pleated-midi-skirt",
    "categorySlug": "western-wear",
    "price": 2299,
    "image": "/images/product-placeholder.svg"
  }
].map((product, index) => ({
  ...product,
  // Demo options are not a real stock claim.
  sizes: (index % 2 === 0 ? ["S", "M", "L"] : ["M", "L", "XL"]).map((size) => ({ size: size as ProductSize, enabled: true })),
  images: [
  {
    "id": "front",
    "src": "/images/sample-front.svg",
    "alt": "Front View sample placeholder, not a garment photograph",
    "label": "Front View (Sample)"
  },
  {
    "id": "back",
    "src": "/images/sample-back.svg",
    "alt": "Back View sample placeholder, not a garment photograph",
    "label": "Back View (Sample)"
  },
  {
    "id": "side",
    "src": "/images/sample-side.svg",
    "alt": "Side View sample placeholder, not a garment photograph",
    "label": "Side View (Sample)"
  },
  {
    "id": "neckline",
    "src": "/images/sample-neckline.svg",
    "alt": "Neckline Detail sample placeholder, not a garment photograph",
    "label": "Neckline Detail (Sample)"
  },
  {
    "id": "embroidery",
    "src": "/images/sample-embroidery.svg",
    "alt": "Sleeve/Embroidery Detail sample placeholder, not a garment photograph",
    "label": "Sleeve/Embroidery Detail (Sample)"
  }
].map((image) => ({ ...image, alt: `${product.name}: ${image.alt}` })),
}));

export async function getProducts(categorySlug?: string): Promise<readonly Product[]> {
  return categorySlug ? products.filter((product) => product.categorySlug === categorySlug) : products;
}
