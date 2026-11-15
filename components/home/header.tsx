import { WishlistLink } from "@/components/shop/wishlist-link";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { ShopDropdown } from "./shop-dropdown";
import { CartBagLink } from "@/components/cart/cart-bag-link";

export function Header({ currentPage = "home" }: { currentPage?: "home" | "cart" | "product" | "wishlist" }) {
  return (
    <header className="site-header">
      <div className="header-inner relative mx-auto flex h-full items-center justify-between">
        <MobileMenu currentPage={currentPage} />
        <Link href="/" className="brand flex items-center" aria-label="Label Anaya home">
          <Image
            src="/images/anaya-golden-monogram.png"
            alt=""
            width={1221}
            height={1288}
            sizes="(min-width: 1024px) 52px, (min-width: 640px) 42px, 36px"
            className="brand-image object-contain"
          />
          <span className="brand-wordmark" aria-hidden="true"><span className="brand-label">LABEL</span><span className="brand-name">ANAYA</span></span>
        </Link>
        <nav className="desktop-navigation hidden items-center lg:flex" aria-label="Main navigation">
          <Link href="/" aria-current={currentPage === "home" ? "page" : undefined} className={currentPage === "home" ? "home-link" : "nav-link"}>Home</Link>
          <ShopDropdown />
        </nav>
        <div className="header-actions ml-auto flex items-center">
          <SearchDialog />
          <WishlistLink />
          <CartBagLink />
          <Link href="/login" className="icon-button" aria-label="Your account"><Icon name="account" /></Link>
        </div>
      </div>
    </header>
  );
}
