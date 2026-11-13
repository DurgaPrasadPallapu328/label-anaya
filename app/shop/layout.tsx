import { AnnouncementBar } from "@/components/home/announcement-bar";
import { Header } from "@/components/home/header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </>
  );
}
