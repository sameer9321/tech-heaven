"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Save, ArrowUp, ArrowDown, Eye, EyeOff, Images, AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import ImageUpload from "./ImageUpload";
import { adminFetch } from "@/lib/adminClient";

export type Slide = { id: number; heading: string; description: string; image: string; btn1Label: string | null; btn1Link: string | null; btn2Label: string | null; btn2Link: string | null; sortOrder: number; active: boolean };

const blank = { heading: "", description: "", image: "", btn1Label: "", btn1Link: "", btn2Label: "", btn2Link: "", sortOrder: 0, active: true } as any;

export default function SlidersView({ slides, reload, notify }: { slides: Slide[]; reload: () => void; notify: (m: string, ok?: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<any>(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function openAdd() { setEditing(null); setForm({ ...blank, sortOrder: slides.length + 1 }); setErr(""); setOpen(true); }
  function openEdit(s: Slide) { setEditing(s.id); setForm({ ...s, btn1Label: s.btn1Label ?? "", btn1Link: s.btn1Link ?? "", btn2Label: s.btn2Label ?? "", btn2Link: s.btn2Link ?? "" }); setErr(""); setOpen(true); }
  function change(e: any) { const { name, value, type, checked } = e.target; setForm({ ...form, [name]: type === "checkbox" ? checked : value }); }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (!form.image) { setErr("Please upload a slide image."); return; }
    setSaving(true);
    try {
      const r = await adminFetch(editing ? `/api/slides/${editing}` : "/api/slides", { method: editing ? "PUT" : "POST", body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "Something went wrong"); return; }
      setOpen(false); reload(); notify(editing ? "Slide updated." : "Slide added.");
    } finally { setSaving(false); }
  }

  async function del(s: Slide) {
    if (!confirm("Delete this slide?")) return;
    const r = await adminFetch(`/api/slides/${s.id}`, { method: "DELETE" });
    if (r.ok) { reload(); notify("Slide deleted.", true); } else notify("Delete failed.", false);
  }

  async function toggleActive(s: Slide) {
    const r = await adminFetch(`/api/slides/${s.id}`, { method: "PUT", body: JSON.stringify({ ...s, active: !s.active }) });
    if (r.ok) { reload(); notify(s.active ? "Slide disabled." : "Slide enabled."); }
  }

  // Reorder by swapping sortOrder with the adjacent slide.
  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const a = slides[i], b = slides[j];
    await Promise.all([
      adminFetch(`/api/slides/${a.id}`, { method: "PUT", body: JSON.stringify({ ...a, sortOrder: b.sortOrder }) }),
      adminFetch(`/api/slides/${b.id}`, { method: "PUT", body: JSON.stringify({ ...b, sortOrder: a.sortOrder }) }),
    ]);
    reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Homepage Slider</h2>
          <p className="text-sm text-slate-500">{slides.length} slides · active slides show on the homepage</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition"><Plus size={17} /> Add Slide</button>
      </div>

      {slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-500">
          <Images size={40} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm">No slides yet. Add your first slide to build the homepage carousel.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {slides.map((s, i) => (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="relative h-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.heading} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${s.active ? "bg-emerald-500 text-white" : "bg-slate-700/80 text-slate-200"}`}>{s.active ? "Active" : "Hidden"}</span>
                <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 text-xs font-semibold text-slate-700">#{s.sortOrder}</span>
                <h3 className="absolute bottom-3 left-3 right-3 text-white font-semibold truncate">{s.heading}</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">{s.description}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="grid place-items-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition"><ArrowUp size={15} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === slides.length - 1} aria-label="Move down" className="grid place-items-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition"><ArrowDown size={15} /></button>
                  <button onClick={() => toggleActive(s)} aria-label="Toggle" className="grid place-items-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 transition">{s.active ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  <div className="flex-1" />
                  <button onClick={() => openEdit(s)} aria-label="Edit" className="grid place-items-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition"><Pencil size={15} /></button>
                  <button onClick={() => del(s)} aria-label="Delete" className="grid place-items-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 transition"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} wide title={editing ? "Edit Slide" : "Add New Slide"}
        footer={<>
          <button type="button" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
          <button form="slide-form" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition">{editing ? <><Save size={16} /> Update</> : <><Plus size={16} /> Add Slide</>}</button>
        </>}>
        <form id="slide-form" onSubmit={submit} className="space-y-4">
          {err && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"><AlertTriangle size={15} /> {err}</div>}
          <ImageUpload label="Slide background image" value={form.image} onChange={(path) => setForm((f: any) => ({ ...f, image: path }))} />
          <Field label="Heading"><input name="heading" value={form.heading} onChange={change} required className={inp} placeholder="e.g. Next-Gen Gaming Laptops" /></Field>
          <Field label="Description"><textarea name="description" rows={2} value={form.description} onChange={change} className={inp} placeholder="Short supporting text" /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Button 1 label"><input name="btn1Label" value={form.btn1Label} onChange={change} className={inp} placeholder="Shop Now" /></Field>
            <Field label="Button 1 link"><input name="btn1Link" value={form.btn1Link} onChange={change} className={inp} placeholder="/products" /></Field>
            <Field label="Button 2 label"><input name="btn2Label" value={form.btn2Label} onChange={change} className={inp} placeholder="View All" /></Field>
            <Field label="Button 2 link"><input name="btn2Link" value={form.btn2Link} onChange={change} className={inp} placeholder="/products" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Sort order"><input name="sortOrder" type="number" value={form.sortOrder} onChange={change} className={inp} /></Field>
            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 pb-2.5"><input name="active" type="checkbox" checked={form.active} onChange={change} className="w-4 h-4 accent-blue-600" /> Active (visible on homepage)</label>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const inp = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>{children}</label>;
}
