"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Save, PackageSearch, AlertTriangle, Search } from "lucide-react";
import Modal from "./Modal";
import ImageUpload from "./ImageUpload";
import { adminFetch, LOW_STOCK_THRESHOLD } from "@/lib/adminClient";
import { CATEGORIES } from "@/lib/catalog";
import { money } from "@/lib/utils";

type Product = { id: number; name: string; slug: string; category: string; brand: string; price: number; oldPrice: number | null; stock: number; image: string; shortDesc: string; description: string; specs: string; featured: boolean };

const blank = { name: "", slug: "", category: CATEGORIES[0].label, brand: "", price: "", oldPrice: "", stock: "0", image: "", shortDesc: "", description: "", specs: "", featured: false } as any;

export default function ProductsView({ products, reload, notify }: { products: Product[]; reload: () => void; notify: (m: string, ok?: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<any>(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const filtered = products.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase()));

  function openAdd() { setEditing(null); setForm(blank); setErr(""); setOpen(true); }
  function openEdit(p: Product) { setEditing(p.id); setForm({ ...p, oldPrice: p.oldPrice ?? "" }); setErr(""); setOpen(true); }
  function change(e: any) { const { name, value, type, checked } = e.target; setForm({ ...form, [name]: type === "checkbox" ? checked : value }); }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setSaving(true);
    try {
      const r = await adminFetch(editing ? `/api/products/${editing}` : "/api/products", { method: editing ? "PUT" : "POST", body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "Something went wrong"); return; }
      setOpen(false); reload(); notify(editing ? "Product updated successfully." : "Product added successfully.");
    } finally { setSaving(false); }
  }

  async function del(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const r = await adminFetch(`/api/products/${p.id}`, { method: "DELETE" });
    if (r.ok) { reload(); notify("Product deleted.", true); } else notify("Incorrect admin password.", false);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition"><Plus size={17} /> Add Product</button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 bg-slate-50">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <b className="block text-slate-800 truncate max-w-[220px]">{p.name}</b>
                        <span className="text-xs text-slate-500">{p.brand}{p.featured ? " · ⭐ Featured" : ""}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{p.category}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">{money(p.price)}</td>
                  <td className="px-5 py-3">
                    {p.stock === 0 ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">Out</span>
                    : p.stock <= LOW_STOCK_THRESHOLD ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium"><AlertTriangle size={11} /> {p.stock}</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">{p.stock}</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEdit(p)} aria-label="Edit" className="grid place-items-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition"><Pencil size={15} /></button>
                      <button onClick={() => del(p)} aria-label="Delete" className="grid place-items-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 transition"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            <PackageSearch size={40} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm">{q ? "No products match your search." : "No products yet. Add your first product."}</p>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} wide title={editing ? "Edit Product" : "Add New Product"}
        footer={<>
          <button type="button" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
          <button form="product-form" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition">{editing ? <><Save size={16} /> Update</> : <><Plus size={16} /> Add Product</>}</button>
        </>}>
        <form id="product-form" onSubmit={submit} className="space-y-4">
          {err && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"><AlertTriangle size={15} /> {err}</div>}
          <Field label="Product name"><input name="name" value={form.name} onChange={change} required className={inp} placeholder="e.g. ASUS ROG Strix G16" /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Brand"><input name="brand" value={form.brand} onChange={change} required className={inp} placeholder="ASUS" /></Field>
            <Field label="Category"><select name="category" value={form.category} onChange={change} className={inp}>{CATEGORIES.map((c) => <option key={c.label}>{c.label}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price"><input name="price" type="number" value={form.price} onChange={change} required className={inp} placeholder="0" /></Field>
            <Field label="Old price"><input name="oldPrice" type="number" value={form.oldPrice} onChange={change} className={inp} placeholder="—" /></Field>
            <Field label="Stock"><input name="stock" type="number" value={form.stock} onChange={change} className={inp} placeholder="0" /></Field>
          </div>
          <ImageUpload label="Product image" value={form.image} onChange={(path) => setForm((f: any) => ({ ...f, image: path }))} />
          <Field label="Short description"><input name="shortDesc" value={form.shortDesc} onChange={change} required className={inp} placeholder="One-line card description" /></Field>
          <Field label="Full description"><textarea name="description" rows={3} value={form.description} onChange={change} required className={inp} placeholder="Full product description" /></Field>
          <Field label="Specifications (one per line)"><textarea name="specs" rows={4} value={form.specs} onChange={change} required className={inp} placeholder={"16GB RAM\n512GB SSD"} /></Field>
          <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700"><input name="featured" type="checkbox" checked={form.featured} onChange={change} className="w-4 h-4 accent-blue-600" /> Show on homepage (Featured)</label>
        </form>
      </Modal>
    </div>
  );
}

const inp = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>{children}</label>;
}
