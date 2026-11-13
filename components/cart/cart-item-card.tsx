import { Icon } from "@/components/ui/icon";
import { formatCartMoney, getCartQuantityLimit, type CartLine } from "@/lib/cart/domain";
import { CartProductImage } from "./cart-product-image";
import { CartRemoveControl } from "./cart-remove-control";

interface CartItemCardProps {
  item: CartLine;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string, trigger?: HTMLButtonElement) => void;
}

export function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  const { product, quantity } = item;
  const limit = getCartQuantityLimit(product);
  const unavailable = limit === 0;
  const overLimit = quantity > limit && !unavailable;

  return (
    <li className="cart-item-card">
      <CartProductImage imageUrl={product.imageUrl} name={product.name} />
      <div className="cart-item-details">
        <h2>{product.name}</h2>
        <p className="cart-item-price">{formatCartMoney(product.unitPriceMinor)}</p>
        {product.size && <p className="cart-item-size">Size: <span>{product.size}</span></p>}
        {unavailable && <p className="cart-availability" role="status">Currently unavailable</p>}
        {overLimit && <p className="cart-availability" role="status">Only {limit} available. Please reduce the quantity.</p>}
        <div className="cart-item-actions">
          <div>
            <p className="cart-quantity-label">Quantity:</p>
            <div className="cart-quantity-control" role="group" aria-label={`Quantity for ${product.name}`}>
              <button type="button" aria-label={`Decrease quantity for ${product.name}`} disabled={quantity <= 1 || unavailable} onClick={() => onQuantityChange(item.id, quantity - 1)}>
                <Icon name="minus" />
              </button>
              <output aria-label={`Current quantity for ${product.name}`}>{quantity}</output>
              <button type="button" aria-label={`Increase quantity for ${product.name}`} disabled={quantity >= limit} onClick={() => onQuantityChange(item.id, quantity + 1)}>
                <Icon name="plus" />
              </button>
            </div>
          </div>
          <CartRemoveControl productName={product.name} onRequestRemoval={(trigger) => onRemove(item.id, trigger)} />
        </div>
      </div>
    </li>
  );
}
