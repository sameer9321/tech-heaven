"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap, Heart, GitCompareArrows, MessageCircle } from "lucide-react";
import { money } from "@/lib/utils";
import { Product } from "@/lib/types";
import { useStore } from "@/components/store/StoreProvider";

export default function BuyBox({ p, wa }: { p: Product; wa: string }) {
  const { addToCart, toggleWishlist, inWishlist, toggleCompare, inCompare, pushRecent } = useStore();
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const inStock = p.stock > 0;

  // Track recently viewed once on mount.
  useEffect(() => { pushRecent(p); }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const buyNow = () => { addToCart(p, qty); router.push("/checkout"); };
  const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(`Hi TurboTech, I want to order ${qty} × ${p.name} (${money(p.price)})`)}`;

  return (
    <div className="space-y-5">
      <div className="flex items-end gap-3 flex-wrap">
        <strong className="text-3xl text-primary">{money(p.price)}</strong>
        {p.oldPrice ? <span className="text-lg text-slate-400 line-through mb-1">{money(p.oldPrice)}</span> : null}
        {p.oldPrice && p.oldPrice > p.price ? (
          <span className="badge-pill badge-sale mb-1.5">Save {money(p.oldPrice - p.price)}</span>
        ) : null}
      </div>

      <p className={`inline-flex items-center gap-2 text-sm font-medium ${inStock ? "text-emerald-600" : "text-slate-500"}`}>
        <span className={`w-2 h-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-slate-400"}`} />
        {inStock ? `In stock — ${p.stock} unit${p.stock > 1 ? "s" : ""} available` : "Currently out of stock"}
      </p>

      {/* Quantity + actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center rounded-xl border border-line overflow-hidden">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid place-items-center w-11 h-11 hover:bg-bg" aria-label="Decrease"><Minus size={16} /></button>
          <span className="w-12 text-center font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(p.stock || 99, q + 1))} className="grid place-items-center w-11 h-11 hover:bg-bg" aria-label="Increase"><Plus size={16} /></button>
        </div>
        <button onClick={() => addToCart(p, qty)} disabled={!inStock} className="btn btn-primary flex-1 min-w-[160px]"><ShoppingCart size={18} /> Add to Cart</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={buyNow} disabled={!inStock} className="btn btn-accent"><Zap size={18} /> Buy Now</button>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-dark"><MessageCircle size={18} /> Order on WhatsApp</a>
      </div>

      <div className="flex items-center gap-4 pt-1">
        <button onClick={() => toggleWishlist(p)} className={`inline-flex items-center gap-2 text-sm font-medium transition ${inWishlist(p.id) ? "text-red-500" : "text-slate-600 hover:text-red-500"}`}>
          <Heart size={17} className={inWishlist(p.id) ? "fill-current" : ""} /> {inWishlist(p.id) ? "In Wishlist" : "Add to Wishlist"}
        </button>
        <span className="w-px h-4 bg-line" />
        <button onClick={() => toggleCompare(p)} className={`inline-flex items-center gap-2 text-sm font-medium transition ${inCompare(p.id) ? "text-secondary" : "text-slate-600 hover:text-secondary"}`}>
          <GitCompareArrows size={17} /> {inCompare(p.id) ? "In Compare" : "Add to Compare"}
        </button>
      </div>
    </div>
  );
}
