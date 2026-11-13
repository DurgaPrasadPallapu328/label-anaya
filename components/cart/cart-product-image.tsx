"use client";

import Image from "next/image";
import { useState } from "react";
import { getProductImageUrl } from "@/lib/cart/domain";
import { Icon } from "@/components/ui/icon";

function ImageContent({ source, name }: { source: string | null; name: string }) {
  const [failed, setFailed] = useState(false);

  if (source && !failed) {
    return (
      <Image
        src={source}
        alt={name}
        fill
        unoptimized
        sizes="(min-width: 1024px) 18vw, 34vw"
        className="object-contain"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="cart-image-placeholder" role="img" aria-label="Product Image Coming Soon">
      <Icon name="bag" />
      <span>Product Image Coming Soon</span>
    </div>
  );
}

export function CartProductImage({ imageUrl, name }: { imageUrl?: string | null; name: string }) {
  const source = getProductImageUrl(imageUrl);
  return (
    <div className="cart-product-image">
      <ImageContent key={source ?? "missing-image"} source={source} name={name} />
    </div>
  );
}
