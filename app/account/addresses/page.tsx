"use client";
import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Home } from "lucide-react";

type Address = { id: number; label: string; name: string; phone: string; city: string; line: string };

export default function AddressesPage() {
  const [list, setList] = useState<Address[]>([]);
  const [form, setForm] = useState<Omit<Address, "id">>({ label: "Home", name: "", phone: "", city: "", line: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { try { const a = localStorage.getItem("tt_addresses"); if (a) setList(JSON.parse(a)); } catch {} }, []);
  const persist = (next: Address[]) => { setList(next); try { localStorage.setItem("tt_addresses", JSON.stringify(next)); } catch {} };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    persist([...list, { ...form, id: Date.now() }]);
    setForm({ label: "Home", name: "", phone: "", city: "", line: "" });
    setShowForm(false);
  };
  const remove = (id: number) => persist(list.filter((a) => a.id !== id));
  const change = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between">
              <span className="chip"><Home size={13} /> {a.label}</span>
              <button onClick={() => remove(a.id)} aria-label="Delete" className="text-slate-400 hover:text-red-500"><Trash2 size={17} /></button>
            </div>
            <b className="block mt-3">{a.name}</b>
            <p className="text-sm text-muted mt-1">{a.line}, {a.city}</p>
            <p className="text-sm text-muted">{a.phone}</p>
          </div>
        ))}
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="card card-hover p-5 border-dashed grid place-items-center text-secondary min-h-[140px]">
            <span className="flex flex-col items-center gap-2"><Plus size={24} /> <b className="text-sm">Add new address</b></span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={add} className="card p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-secondary-50 text-secondary"><MapPin size={20} /></span>
            <h2 className="font-semibold text-lg">New Address</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="label" value={form.label} onChange={change} className="field" placeholder="Label (Home, Office)" />
            <input required name="name" value={form.name} onChange={change} className="field" placeholder="Full name" />
            <input required name="phone" value={form.phone} onChange={change} className="field" placeholder="Phone" />
            <input required name="city" value={form.city} onChange={change} className="field" placeholder="City" />
            <input required name="line" value={form.line} onChange={change} className="field sm:col-span-2" placeholder="Street address" />
          </div>
          <div className="flex gap-2 mt-5">
            <button className="btn btn-primary">Save Address</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn">Cancel</button>
          </div>
        </form>
      )}

      {list.length === 0 && !showForm && (
        <p className="text-sm text-muted">No saved addresses yet. Add one to check out faster.</p>
      )}
    </div>
  );
}
