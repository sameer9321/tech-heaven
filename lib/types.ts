// Shared product shape used across the storefront.
export type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  image: string;
  shortDesc: string;
  description?: string;
  specs?: string;
  featured?: boolean;
};

// Lightweight product reference stored in localStorage (cart / wishlist / compare).
export type ProductRef = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  image: string;
  stock: number;
};

export type CartItem = ProductRef & { qty: number };

export function toRef(p: Product | ProductRef): ProductRef {
  return {
    id: p.id, name: p.name, slug: p.slug, brand: p.brand, category: p.category,
    price: p.price, oldPrice: p.oldPrice ?? null, image: p.image, stock: p.stock,
  };
}
