import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { ShopDropdown } from "./shop-dropdown";

export function Header() {
  return (
    <header className="site-header relative bg-cream">
      <div className="header-inner relative mx-auto flex h-full items-center justify-between">
        <MobileMenu />
        <Link href="/" className="brand flex items-center" aria-label="Label Anaya home">
          <Image
            src="/images/Anaya-logo.jpg"
            alt=""
            width={1254}
            height={1254}
            sizes="(min-width: 1024px) 84px, (min-width: 640px) 64px, 38px"
            className="brand-image rounded-sm object-contain"
          />
          <span className="brand-wordmark text-center" aria-hidden="true"><span className="block">LABEL</span><span className="block">ANAYA</span></span>
        </Link>
        <nav className="desktop-navigation hidden items-center lg:flex" aria-label="Main navigation">
          <Link href="/" aria-current="page" className="home-link">Home</Link>
          <ShopDropdown />
        </nav>
        <div className="header-actions ml-auto flex items-center">
          <SearchDialog />
          <Link href="/cart" className="icon-button relative" aria-label="Shopping bag, 0 items">
            <Icon name="bag" />
            <span className="cart-count absolute flex items-center justify-center bg-olive text-white" aria-hidden="true">0</span>
          </Link>
          <Link href="/login" className="icon-button" aria-label="Your account"><Icon name="account" /></Link>
        </div>
      </div>
    </header>
  );
}
