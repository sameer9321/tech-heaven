"use client";
import { Package, AlertTriangle, Star, Images, ShoppingBag, Users, TrendingUp, ArrowRight } from "lucide-react";
import { money } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "@/lib/adminClient";
import type { Slide } from "./SlidersView";

type Product = { id: number; name: string; brand: string; category: string; price: number; stock: number; image: string; featured: boolean };

export default function DashboardView({ products, slides, go }: { products: Product[]; slides: Slide[]; go: (v: "products" | "sliders") => void }) {
  const lowStock = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).sort((a, b) => a.stock - b.stock);
  const featured = products.filter((p) => p.featured).length;
  const activeSlides = slides.filter((s) => s.active).length;
  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: <Package size={22} />, tone: "blue", onClick: () => go("products") },
    { label: "Low Stock", value: lowStock.length, icon: <AlertTriangle size={22} />, tone: "amber", onClick: () => go("products") },
    { label: "Featured", value: featured, icon: <Star size={22} />, tone: "violet", onClick: () => go("products") },
    { label: "Active Slides", value: `${activeSlides}/${slides.length}`, icon: <Images size={22} />, tone: "emerald", onClick: () => go("sliders") },
  ];

  const toneMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600", amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600", emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button key={s.label} onClick={s.onClick} className="text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between">
              <span className={`grid place-items-center w-11 h-11 rounded-xl ${toneMap[s.tone]}`}>{s.icon}</span>
              <TrendingUp size={16} className="text-slate-300" />
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-900 leading-none">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-slate-400 text-sm">Estimated inventory value</p>
          <p className="text-2xl font-bold mt-1">{money(inventoryValue)}</p>
        </div>
        <p className="text-slate-400 text-sm max-w-xs">Total retail value of all products currently in stock.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Low stock — real data */}
        <Widget title="Low Stock Alerts" icon={<AlertTriangle size={18} className="text-amber-500" />} action={{ label: "Manage", onClick: () => go("products") }}>
          {lowStock.length === 0 ? (
            <Empty text="All products are well stocked. 🎉" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                  <span className="flex-1 min-w-0"><b className="block text-sm text-slate-800 truncate">{p.name}</b><span className="text-xs text-slate-500">{p.brand}</span></span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.stock === 0 ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-700"}`}>{p.stock === 0 ? "Out" : `${p.stock} left`}</span>
                </li>
              ))}
            </ul>
          )}
        </Widget>

        {/* Recent Orders — no server-side orders (WhatsApp checkout) */}
        <Widget title="Recent Orders" icon={<ShoppingBag size={18} className="text-blue-500" />}>
          <Empty icon={<ShoppingBag size={26} />} text="No orders recorded here yet." sub="This store checks out via WhatsApp. Connect an orders backend to list orders here." />
        </Widget>

        {/* Recent Customers — no accounts backend */}
        <Widget title="Recent Customers" icon={<Users size={18} className="text-violet-500" />}>
          <Empty icon={<Users size={26} />} text="No customer accounts yet." sub="Customer accounts are stored on-device. Add an auth backend to see them here." />
        </Widget>
      </div>
    </div>
  );
}

function Widget({ title, icon, action, children }: { title: string; icon: React.ReactNode; action?: { label: string; onClick: () => void }; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">{icon} {title}</h3>
        {action && <button onClick={action.onClick} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:gap-2 transition-all">{action.label} <ArrowRight size={13} /></button>}
      </div>
      {children}
    </div>
  );
}

function Empty({ icon, text, sub }: { icon?: React.ReactNode; text: string; sub?: string }) {
  return (
    <div className="py-8 text-center text-slate-500">
      {icon && <div className="grid place-items-center w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto mb-3">{icon}</div>}
      <p className="text-sm font-medium text-slate-600">{text}</p>
      {sub && <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">{sub}</p>}
    </div>
  );
}
