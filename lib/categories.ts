export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const categories: readonly Category[] = [
  {
    "id": "kurtis",
    "name": "Kurtis",
    "slug": "kurtis",
    "image": "/images/Kurtis Category Card.png"
  },
  {
    "id": "co-ord-sets",
    "name": "Co-ord Sets",
    "slug": "co-ord-sets",
    "image": "/images/Co-ord Sets Category Card.png"
  },
  {
    "id": "dresses",
    "name": "Dresses",
    "slug": "dresses",
    "image": "/images/Elegant Dresses Category Card.png"
  },
  {
    "id": "ethnic-wear",
    "name": "Ethnic Wear",
    "slug": "ethnic-wear",
    "image": "/images/Ethnic Wear Saree Icon.png"
  },
  {
    "id": "western-wear",
    "name": "Western Wear",
    "slug": "western-wear",
    "image": "/images/Elegant Western Wear Jacket Icon.png"
  }
];
