"use client";
import Link from "next/link";
import { Heart, GitCompareArrows, ShoppingCart, Eye, Star } from "lucide-react";
import { money } from "@/lib/utils";
import { Product, ProductRef } from "@/lib/types";
import { useStore } from "./store/StoreProvider";

export default function ProductCard({ p }: { p: Product | ProductRef }) {
  const { addToCart, toggleWishlist, inWishlist, toggleCompare, inCompare } = useStore();
  const inStock = p.stock > 0;
  const off = p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  const wished = inWishlist(p.id);
  const compared = inCompare(p.id);

  return (
    <article className="card card-hover group flex flex-col animate-fade-in">
      <div className="relative">
        <Link href={`/products/${p.slug}`} className="block aspect-[4/3] overflow-hidden bg-bg">
          <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>

        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {off > 0 && <span className="badge-pill badge-sale">-{off}%</span>}
          {inStock ? <span className="badge-pill badge-stock">In Stock</span> : <span className="badge-pill badge-out">Out of Stock</span>}
        </div>

        {/* hover quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          <button onClick={() => toggleWishlist(p)} aria-label="Add to wishlist"
            className={`grid place-items-center w-9 h-9 rounded-lg border shadow-sm transition ${wished ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-line text-slate-600 hover:text-red-500"}`}>
            <Heart size={16} className={wished ? "fill-current" : ""} />
          </button>
          <button onClick={() => toggleCompare(p)} aria-label="Add to compare"
            className={`grid place-items-center w-9 h-9 rounded-lg border shadow-sm transition ${compared ? "bg-secondary-50 border-blue-200 text-secondary" : "bg-white border-line text-slate-600 hover:text-secondary"}`}>
            <GitCompareArrows size={16} />
          </button>
          <Link href={`/products/${p.slug}`} aria-label="Quick view"
            className="grid place-items-center w-9 h-9 rounded-lg border border-line bg-white text-slate-600 hover:text-secondary shadow-sm transition"><Eye size={16} /></Link>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-secondary">
          <span className="truncate">{p.brand} · {p.category}</span>
          <span className="flex items-center gap-0.5 text-amber-500"><Star size={12} className="fill-current" /> 4.8</span>
        </div>
        <h3 className="mt-2 text-[15px] font-semibold leading-snug line-clamp-2 min-h-[42px]">
          <Link href={`/products/${p.slug}`} className="hover:text-secondary transition">{p.name}</Link>
        </h3>

        <div className="mt-3 flex items-end gap-2">
          <strong className="text-lg text-primary">{money(p.price)}</strong>
          {p.oldPrice ? <span className="text-sm text-slate-400 line-through mb-0.5">{money(p.oldPrice)}</span> : null}
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button onClick={() => addToCart(p)} disabled={!inStock} className="btn btn-primary btn-sm">
            <ShoppingCart size={16} /> Add to Cart
          </button>
          <button onClick={() => toggleWishlist(p)} aria-label="Wishlist"
            className={`btn btn-sm !px-3 ${wished ? "!text-red-500 !border-red-200" : ""}`}>
            <Heart size={16} className={wished ? "fill-current" : ""} />
          </button>
        </div>
      </div>
    </article>
  );
}
