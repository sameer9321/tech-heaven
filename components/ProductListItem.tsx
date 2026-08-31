"use client";
import Link from "next/link";
import { Heart, GitCompareArrows, ShoppingCart, Star } from "lucide-react";
import { money } from "@/lib/utils";
import { Product } from "@/lib/types";
import { useStore } from "./store/StoreProvider";

export default function ProductListItem({ p }: { p: Product }) {
  const { addToCart, toggleWishlist, inWishlist, toggleCompare, inCompare } = useStore();
  const inStock = p.stock > 0;
  const off = p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  return (
    <article className="card card-hover flex flex-col sm:flex-row overflow-hidden">
      <Link href={`/products/${p.slug}`} className="relative sm:w-56 shrink-0 aspect-[4/3] sm:aspect-auto bg-bg overflow-hidden">
        <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
        {off > 0 && <span className="absolute top-3 left-3 badge-pill badge-sale">-{off}%</span>}
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-secondary">
          <span>{p.brand} · {p.category}</span>
          <span className="flex items-center gap-0.5 text-amber-500"><Star size={12} className="fill-current" /> 4.8</span>
        </div>
        <h3 className="mt-1.5 text-lg font-semibold"><Link href={`/products/${p.slug}`} className="hover:text-secondary transition">{p.name}</Link></h3>
        <p className="mt-1.5 text-sm text-muted line-clamp-2 max-w-2xl">{p.shortDesc}</p>
        <div className="mt-auto pt-4 flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-end gap-2">
            <strong className="text-xl text-primary">{money(p.price)}</strong>
            {p.oldPrice ? <span className="text-sm text-slate-400 line-through mb-0.5">{money(p.oldPrice)}</span> : null}
            <span className={`ml-2 mb-0.5 badge-pill ${inStock ? "badge-stock" : "badge-out"}`}>{inStock ? "In Stock" : "Out of Stock"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleWishlist(p)} aria-label="Wishlist" className={`btn btn-sm !px-3 ${inWishlist(p.id) ? "!text-red-500 !border-red-200" : ""}`}><Heart size={16} className={inWishlist(p.id) ? "fill-current" : ""} /></button>
            <button onClick={() => toggleCompare(p)} aria-label="Compare" className={`btn btn-sm !px-3 ${inCompare(p.id) ? "!text-secondary !border-blue-200" : ""}`}><GitCompareArrows size={16} /></button>
            <button onClick={() => addToCart(p)} disabled={!inStock} className="btn btn-primary btn-sm"><ShoppingCart size={16} /> Add to Cart</button>
          </div>
        </div>
      </div>
    </article>
  );
}
