"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, ChevronDown } from "lucide-react";
import { loadOrders, OrderRecord } from "@/lib/checkout";
import { money } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => setOrders(loadOrders()), []);

  if (orders.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Package size={40} className="mx-auto text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold">No orders yet</h2>
        <p className="mt-1 text-muted text-sm">When you place an order it will appear here.</p>
        <Link href="/products" className="btn btn-primary btn-sm mt-5 inline-flex">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="card overflow-hidden">
          <button onClick={() => setOpen(open === o.id ? null : o.id)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-bg transition">
            <div className="flex items-center gap-4">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-secondary-50 text-secondary"><Package size={20} /></span>
              <div>
                <b className="text-sm">Order #{o.id}</b>
                <span className="block text-xs text-muted">{new Date(o.date).toLocaleString()} · {o.items.length} item(s)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline badge-pill badge-new">Confirmed</span>
              <b className="text-primary">{money(o.total)}</b>
              <ChevronDown size={18} className={`text-muted transition-transform ${open === o.id ? "rotate-180" : ""}`} />
            </div>
          </button>
          {open === o.id && (
            <div className="border-t border-line p-5 bg-bg/50">
              <div className="space-y-2 mb-4">
                {o.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{it.qty} × {it.name}</span>
                    <span className="font-medium">{money(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <dl className="space-y-1.5 text-sm border-t border-line pt-3">
                <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(o.subtotal)}</dd></div>
                {o.discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{money(o.discount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{o.shipping === 0 ? "Free" : money(o.shipping)}</dd></div>
                <div className="flex justify-between font-semibold pt-1"><dt>Total</dt><dd className="text-primary">{money(o.total)}</dd></div>
                <div className="flex justify-between pt-1"><dt className="text-muted">Payment</dt><dd>{o.payment}</dd></div>
              </dl>
              <div className="mt-3 text-xs text-muted">Deliver to: {o.customer.name} · {o.customer.address}, {o.customer.city}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
