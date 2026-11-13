import { Icon } from "@/components/ui/icon";

export function AnnouncementBar() {
  return (
    <div className="announcement-bar flex items-center justify-center bg-olive text-white">
      <p className="flex items-center gap-3 lg:gap-4"><Icon name="truck" /><span>Made to Order</span></p>
      <span className="announcement-separator hidden lg:block" aria-hidden="true" />
      <p className="hidden items-center gap-4 lg:flex"><Icon name="leaf" /><span>Elegant Ethnic &amp; Western Wear</span></p>
      <span className="announcement-separator hidden lg:block" aria-hidden="true" />
      <p className="hidden items-center gap-4 lg:flex"><Icon name="shield" /><span>Quality Assured</span></p>
    </div>
  );
}
