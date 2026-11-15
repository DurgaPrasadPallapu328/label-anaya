import { WishlistLink } from "@/components/shop/wishlist-link";
import { NavbarBrand } from "./navbar-brand";
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
        <NavbarBrand />
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
