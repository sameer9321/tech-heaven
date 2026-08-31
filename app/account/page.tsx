"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, Heart, ShoppingCart, MapPin, ArrowRight } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import { loadOrders, OrderRecord } from "@/lib/checkout";
import { money } from "@/lib/utils";

export default function AccountDashboard() {
  const { wishCount, cartCount } = useStore();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
    try { const p = localStorage.getItem("tt_profile"); if (p) setName(JSON.parse(p).name || ""); } catch {}
  }, []);

  const stats = [
    { label: "Orders", value: orders.length, icon: <Package size={20} />, href: "/account/orders" },
    { label: "Wishlist", value: wishCount, icon: <Heart size={20} />, href: "/wishlist" },
    { label: "In Cart", value: cartCount, icon: <ShoppingCart size={20} />, href: "/cart" },
  ];

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-primary to-primary-600 text-white">
        <p className="text-slate-300 text-sm">Welcome back{name ? "," : ""}</p>
        <h2 className="text-2xl font-bold">{name || "TurboTech Customer"} 👋</h2>
        <p className="mt-2 text-slate-300 text-sm max-w-lg">Manage your orders, saved products, addresses and profile — all in one place.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover p-5 flex items-center gap-4">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-secondary-50 text-secondary">{s.icon}</span>
            <span><b className="block text-2xl text-primary leading-none">{s.value}</b><span className="text-sm text-muted">{s.label}</span></span>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm font-medium text-secondary flex items-center gap-1">View all <ArrowRight size={15} /></Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-10 text-muted">
            <Package size={36} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm">You haven't placed any orders yet.</p>
            <Link href="/products" className="btn btn-primary btn-sm mt-4 inline-flex">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-xl border border-line">
                <div>
                  <b className="text-sm">#{o.id}</b>
                  <span className="block text-xs text-muted">{new Date(o.date).toLocaleDateString()} · {o.items.length} item(s)</span>
                </div>
                <div className="text-right">
                  <b className="text-sm text-primary">{money(o.total)}</b>
                  <span className="block text-xs text-muted">{o.payment}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/account/addresses" className="card card-hover p-5 flex items-center gap-4">
        <span className="grid place-items-center w-12 h-12 rounded-xl bg-amber-50 text-amber-500"><MapPin size={20} /></span>
        <span className="flex-1"><b className="block">Delivery Addresses</b><span className="text-sm text-muted">Add or edit where we ship your orders</span></span>
        <ArrowRight size={18} className="text-muted" />
      </Link>
    </div>
  );
}
