import { formatCartMoney } from "@/lib/cart/domain";

interface ProductPriceProps {
  price: number;
  originalPrice?: number;
  demoDiscount?: boolean;
  variant?: "card" | "details";
}

export function ProductPrice({ price, originalPrice, demoDiscount = false, variant = "card" }: ProductPriceProps) {
  const discounted = originalPrice !== undefined
    && Number.isFinite(originalPrice) && originalPrice > 0 && originalPrice > price;
  const discountPercentage = discounted
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <p className={`flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 ${variant === "card" ? "mt-auto justify-center pt-2" : "mt-5"}`}>
      <span className={`whitespace-nowrap font-bold text-olive ${variant === "card" ? "text-base sm:text-xl" : "text-2xl"}`}>
        <span className="sr-only">Selling price: </span>{formatCartMoney(price * 100)}
      </span>
      {discounted && (
        <>
          <span className={`whitespace-nowrap text-stone-500 ${variant === "card" ? "text-xs sm:text-sm" : "text-base"}`}>
            <span className="sr-only">Original price: </span><del>{formatCartMoney(originalPrice * 100)}</del>
          </span>
          <span className={`whitespace-nowrap font-medium text-[#6a2438] ${variant === "card" ? "text-xs sm:text-sm" : "text-sm"}`}>
            {discountPercentage}% OFF
          </span>
        </>
      )}
      {discounted && demoDiscount && <span className="basis-full text-xs font-normal text-muted">Demo pricing · preview only</span>}
    </p>
  );
}
