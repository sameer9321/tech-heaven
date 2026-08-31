"use client";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, Check } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import { money } from "@/lib/utils";
import { COUPONS, shippingFor, FREE_SHIPPING_THRESHOLD } from "@/lib/checkout";

export default function CartClient() {
  const { cart, cartTotal, setQty, removeFromCart, ready } = useStore();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const discount = applied ? Math.round((cartTotal * COUPONS[applied].pct) / 100) : 0;
  const shipping = shippingFor(cartTotal);
  const total = cartTotal - discount + shipping;

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    const key = code.trim().toUpperCase();
    if (COUPONS[key]) { setApplied(key); setErr(""); }
    else { setErr("Invalid coupon code"); setApplied(null); }
  };

  if (!ready) return <div className="container-tt py-16"><div className="skeleton h-64 rounded-2xl" /></div>;

  if (cart.length === 0) {
    return (
      <div className="container-tt py-20">
        <div className="card max-w-lg mx-auto p-12 text-center">
          <span className="grid place-items-center w-16 h-16 rounded-2xl bg-secondary-50 text-secondary mx-auto"><ShoppingBag size={30} /></span>
          <h1 className="mt-5 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted">Looks like you haven't added anything yet. Let's fix that.</p>
          <Link href="/products" className="btn btn-primary mt-6 inline-flex">Start shopping <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

  return (
    <div className="container-tt py-8">
      <h1 className="section-title text-primary mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Items */}
        <div className="space-y-4">
          {remaining > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
              Add <b>{money(remaining)}</b> more to unlock <b>free shipping</b>.
            </div>
          )}
          {cart.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link href={`/products/${item.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-bg shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">{item.brand}</p>
                    <h3 className="font-semibold leading-snug line-clamp-2"><Link href={`/products/${item.slug}`} className="hover:text-secondary">{item.name}</Link></h3>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} aria-label="Remove" className="text-slate-400 hover:text-red-500 transition shrink-0 h-fit"><Trash2 size={18} /></button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="inline-flex items-center rounded-lg border border-line overflow-hidden">
                    <button onClick={() => setQty(item.id, item.qty - 1)} className="grid place-items-center w-9 h-9 hover:bg-bg" aria-label="Decrease"><Minus size={14} /></button>
                    <span className="w-10 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => setQty(item.id, item.qty + 1)} className="grid place-items-center w-9 h-9 hover:bg-bg" aria-label="Increase"><Plus size={14} /></button>
                  </div>
                  <b className="text-primary">{money(item.price * item.qty)}</b>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 h-fit space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <form onSubmit={apply} className="flex gap-2 mb-4">
              <div className="flex items-center gap-2 flex-1 rounded-lg border border-line px-3">
                <Tag size={15} className="text-muted" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="w-full py-2.5 bg-transparent outline-none text-sm" />
              </div>
              <button className="btn btn-sm">Apply</button>
            </form>
            {err && <p className="text-xs text-red-500 -mt-2 mb-3">{err}</p>}
            {applied && <p className="flex items-center gap-1.5 text-xs text-emerald-600 -mt-2 mb-3"><Check size={13} /> {applied} applied — {COUPONS[applied].label}</p>}

            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-medium">{money(cartTotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{money(discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="font-medium">{shipping === 0 ? "Free" : money(shipping)}</dd></div>
              <div className="h-px bg-line my-1" />
              <div className="flex justify-between text-base"><dt className="font-semibold">Total</dt><dd className="font-bold text-primary">{money(total)}</dd></div>
            </dl>

            <Link href="/checkout" className="btn btn-primary btn-block mt-5">Proceed to Checkout <ArrowRight size={18} /></Link>
            <Link href="/products" className="btn btn-block mt-2">Continue Shopping</Link>
          </div>
          <p className="text-center text-xs text-muted">🔒 Secure checkout · COD & bank transfer available</p>
        </aside>
      </div>
    </div>
  );
}
