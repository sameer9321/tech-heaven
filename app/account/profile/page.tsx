"use client";
import { useEffect, useState } from "react";
import { Check, User } from "lucide-react";

type Profile = { name: string; phone: string; email: string; city: string; address: string };
const EMPTY: Profile = { name: "", phone: "", email: "", city: "", address: "" };

export default function ProfilePage() {
  const [form, setForm] = useState<Profile>(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { const p = localStorage.getItem("tt_profile"); if (p) setForm({ ...EMPTY, ...JSON.parse(p) }); } catch {}
  }, []);

  const change = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    try { localStorage.setItem("tt_profile", JSON.stringify(form)); } catch {}
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="card p-6 md:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid place-items-center w-12 h-12 rounded-xl bg-secondary-50 text-secondary"><User size={22} /></span>
        <div><h2 className="font-semibold text-lg">Profile Details</h2><p className="text-sm text-muted">Saved on this device to speed up checkout.</p></div>
      </div>
      <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm"><span className="block mb-1.5 font-medium">Full name</span><input name="name" value={form.name} onChange={change} className="field" placeholder="e.g. Ali Khan" /></label>
        <label className="text-sm"><span className="block mb-1.5 font-medium">Phone</span><input name="phone" value={form.phone} onChange={change} className="field" placeholder="+92 3xx xxxxxxx" /></label>
        <label className="text-sm sm:col-span-2"><span className="block mb-1.5 font-medium">Email</span><input type="email" name="email" value={form.email} onChange={change} className="field" placeholder="you@example.com" /></label>
        <label className="text-sm"><span className="block mb-1.5 font-medium">City</span><input name="city" value={form.city} onChange={change} className="field" placeholder="Karachi" /></label>
        <label className="text-sm"><span className="block mb-1.5 font-medium">Address</span><input name="address" value={form.address} onChange={change} className="field" placeholder="Street address" /></label>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button className="btn btn-primary">Save Changes</button>
          {saved && <span className="flex items-center gap-1.5 text-sm text-emerald-600"><Check size={16} /> Saved</span>}
        </div>
      </form>
    </div>
  );
}
