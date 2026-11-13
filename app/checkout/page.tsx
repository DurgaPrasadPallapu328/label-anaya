import { Header } from "@/components/home/header";
import { AnnouncementBar } from "@/components/home/announcement-bar";
import { DemoCheckout } from "@/components/shop/demo-checkout";
export default function Page() { return <><a className="skip-link" href="#main-content">Skip to content</a><AnnouncementBar /><Header currentPage="product" /><main id="main-content" className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6"><DemoCheckout  /></main></>; }
