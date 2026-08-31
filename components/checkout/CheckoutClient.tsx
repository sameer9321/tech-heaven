"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { money } from "@/lib/utils";
import { COUPONS, shippingFor, saveOrder, OrderRecord } from "@/lib/checkout";
import { ShieldCheck, Truck, Banknote, Wallet, Landmark, CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";

const PAYMENTS = [
  { id: "COD", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: <Banknote size={18} /> },
  { id: "Bank Transfer", label: "Bank Transfer", desc: "Direct bank deposit", icon: <Landmark size={18} /> },
  { id: "Easypaisa / JazzCash", label: "Easypaisa / JazzCash", desc: "Mobile wallet payment", icon: <Wallet size={18} /> },
];

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923080123766";

export default function CheckoutClient() {
  const { cart, cartTotal, clearCart, ready } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", address: "", notes: "" });
  const [payment, setPayment] = useState(PAYMENTS[0].id);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ id: string; wa: string } | null>(null);

  // Prefill from saved profile if present.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tt_profile");
      if (raw) { const p = JSON.parse(raw); setForm((f) => ({ ...f, ...p })); }
    } catch {}
  }, []);

  const discount = coupon ? Math.round((cartTotal * COUPONS[coupon].pct) / 100) : 0;
  const shipping = shippingFor(cartTotal);
  const total = cartTotal - discount + shipping;

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = "TT-" + String(Math.abs(hash(form.phone + total + cart.length))).slice(0, 6);
    const order: OrderRecord = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart.map((c) => ({ name: c.name, qty: c.qty, price: c.price })),
      subtotal: cartTotal, discount, shipping, total, payment,
      customer: { name: form.name, phone: form.phone, email: form.email, city: form.city, address: form.address },
    };
    saveOrder(order);

    const lines = [
      `*New TurboTech Order* — ${orderId}`,
      "",
      ...cart.map((c) => `• ${c.qty} × ${c.name} — ${money(c.price * c.qty)}`),
      "",
      `Subtotal: ${money(cartTotal)}`,
      discount ? `Discount: -${money(discount)}` : "",
      `Shipping: ${shipping === 0 ? "Free" : money(shipping)}`,
      `*Total: ${money(total)}*`,
      `Payment: ${payment}`,
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : "",
      `Address: ${form.address}, ${form.city}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");

    const waUrl = `https://wa.me/${WA}?text=${encodeURIComponent(lines)}`;
    clearCart();
    setPlaced({ id: orderId, wa: waUrl });
    window.open(waUrl, "_blank");
  };

  if (!ready) return <div className="container-tt py-16"><div className="skeleton h-64 rounded-2xl" /></div>;

  if (placed) {
    return (
      <div className="container-tt py-16">
        <div className="card max-w-lg mx-auto p-10 text-center">
          <span className="grid place-items-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mx-auto"><CheckCircle2 size={36} /></span>
          <h1 className="mt-5 text-2xl font-bold">Order placed!</h1>
          <p className="mt-2 text-muted">Your order <b className="text-primary">#{placed.id}</b> has been created. Confirm it on WhatsApp to complete your purchase.</p>
          <a href={placed.wa} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-6 inline-flex"><MessageCircle size={18} /> Confirm on WhatsApp</a>
          <div className="mt-3 flex gap-2 justify-center">
            <Link href="/account/orders" className="btn btn-sm">View my orders</Link>
            <Link href="/products" className="btn btn-sm">Continue shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-tt py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add some products before checking out.</p>
        <Link href="/products" className="btn btn-primary mt-6 inline-flex">Browse products <ArrowRight size={18} /></Link>
      </div>
    );
  }

  return (
    <div className="container-tt py-8">
      <h1 className="section-title text-primary mb-6">Checkout</h1>
      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-5">
          {/* Billing / shipping */}
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-4">Billing & Shipping</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input required name="name" value={form.name} onChange={change} placeholder="Full name" className="field" />
              <input required name="phone" value={form.phone} onChange={change} placeholder="Phone number" className="field" />
              <input type="email" name="email" value={form.email} onChange={change} placeholder="Email (optional)" className="field sm:col-span-2" />
              <input required name="city" value={form.city} onChange={change} placeholder="City" className="field" />
              <input required name="address" value={form.address} onChange={change} placeholder="Street address" className="field" />
              <textarea name="notes" value={form.notes} onChange={change} placeholder="Order notes (optional)" rows={3} className="field sm:col-span-2" />
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="space-y-2.5">
              {PAYMENTS.map((pm) => (
                <label key={pm.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${payment === pm.id ? "border-secondary bg-secondary-50" : "border-line hover:border-slate-300"}`}>
                  <input type="radio" name="payment" checked={payment === pm.id} onChange={() => setPayment(pm.id)} className="accent-secondary w-4 h-4" />
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-white border border-line text-secondary">{pm.icon}</span>
                  <span><b className="block text-sm">{pm.label}</b><span className="text-xs text-muted">{pm.desc}</span></span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="card p-5">
            <h2 className="font-semibold text-lg mb-4">Your Order</h2>
            <div className="space-y-3 max-h-64 overflow-auto mb-4">
              {cart.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg shrink-0">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 count-badge !bg-primary !text-white">{c.qty}</span>
                  </span>
                  <span className="text-sm flex-1 line-clamp-2">{c.name}</span>
                  <b className="text-sm">{money(c.price * c.qty)}</b>
                </div>
              ))}
            </div>
            <dl className="space-y-2 text-sm border-t border-line pt-4">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(cartTotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{money(discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
              <div className="flex justify-between text-base pt-2 border-t border-line"><dt className="font-semibold">Total</dt><dd className="font-bold text-primary">{money(total)}</dd></div>
            </dl>
            <button type="submit" className="btn btn-primary btn-block mt-5">Place Order</button>
            <div className="mt-4 space-y-1.5 text-xs text-muted">
              <p className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> Secure & encrypted checkout</p>
              <p className="flex items-center gap-1.5"><Truck size={13} className="text-emerald-500" /> Nationwide delivery in 2–4 days</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }
