export const categories = [
  { name: "Kurtis", href: "/shop/kurtis", image: "/images/Kurtis Category Card.png" },
  { name: "Co-ord Sets", href: "/shop/co-ord-sets", image: "/images/Co-ord Sets Category Card.png" },
  { name: "Dresses", href: "/shop/dresses", image: "/images/Elegant Dresses Category Card.png" },
  { name: "Ethnic Wear", href: "/shop/ethnic-wear", image: "/images/Ethnic Wear Saree Icon.png" },
  { name: "Western Wear", href: "/shop/western-wear", image: "/images/Elegant Western Wear Jacket Icon.png" },
] as const;

export type Category = (typeof categories)[number];
