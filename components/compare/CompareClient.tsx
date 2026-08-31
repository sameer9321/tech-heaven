"use client";
import Link from "next/link";
import { GitCompareArrows, ShoppingCart, X, ArrowRight, Check, Minus } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import { money } from "@/lib/utils";

export default function CompareClient() {
  const { compare, toggleCompare, addToCart, clearCompare, ready } = useStore();

  if (!ready) return <div className="container-tt py-16"><div className="skeleton h-64 rounded-2xl" /></div>;

  if (compare.length === 0) {
    return (
      <div className="container-tt py-20">
        <div className="card max-w-lg mx-auto p-12 text-center">
          <span className="grid place-items-center w-16 h-16 rounded-2xl bg-secondary-50 text-secondary mx-auto"><GitCompareArrows size={30} /></span>
          <h1 className="mt-5 text-2xl font-bold">Nothing to compare yet</h1>
          <p className="mt-2 text-muted">Add up to 4 products to compare their prices and details side by side.</p>
          <Link href="/products" className="btn btn-primary mt-6 inline-flex">Browse products <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  const rows: { label: string; render: (p: typeof compare[number]) => React.ReactNode }[] = [
    { label: "Price", render: (p) => <b className="text-primary">{money(p.price)}</b> },
    { label: "Was", render: (p) => (p.oldPrice ? <span className="line-through text-muted">{money(p.oldPrice)}</span> : <Minus size={14} className="text-slate-300" />) },
    { label: "Discount", render: (p) => (p.oldPrice && p.oldPrice > p.price ? <span className="badge-pill badge-sale">-{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%</span> : <Minus size={14} className="text-slate-300" />) },
    { label: "Brand", render: (p) => p.brand },
    { label: "Category", render: (p) => p.category },
    { label: "Availability", render: (p) => (p.stock > 0 ? <span className="inline-flex items-center gap-1 text-emerald-600"><Check size={14} /> In stock</span> : <span className="text-slate-400">Out of stock</span>) },
  ];

  return (
    <div className="container-tt py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="section-title text-primary">Compare Products <span className="text-muted text-lg font-normal">({compare.length})</span></h1>
        <button onClick={clearCompare} className="btn btn-sm"><X size={15} /> Clear all</button>
      </div>

      <div className="overflow-x-auto card">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="w-32 p-4 text-left align-bottom text-sm text-muted font-medium">Product</th>
              {compare.map((p) => (
                <th key={p.id} className="p-4 align-top border-l border-line min-w-[180px]">
                  <div className="relative">
                    <button onClick={() => toggleCompare(p)} aria-label="Remove" className="absolute -top-1 -right-1 grid place-items-center w-7 h-7 rounded-full bg-white border border-line text-slate-500 hover:text-red-500"><X size={14} /></button>
                    <Link href={`/products/${p.slug}`} className="block">
                      <span className="block aspect-square rounded-xl overflow-hidden bg-bg mb-3"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></span>
                      <span className="block text-sm font-semibold leading-snug line-clamp-2 hover:text-secondary">{p.name}</span>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <td className="p-4 text-sm font-medium text-muted">{r.label}</td>
                {compare.map((p) => <td key={p.id} className="p-4 text-sm border-l border-line">{r.render(p)}</td>)}
              </tr>
            ))}
            <tr className="border-t border-line">
              <td className="p-4" />
              {compare.map((p) => (
                <td key={p.id} className="p-4 border-l border-line">
                  <button onClick={() => addToCart(p)} disabled={p.stock === 0} className="btn btn-primary btn-sm btn-block"><ShoppingCart size={15} /> Add</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
