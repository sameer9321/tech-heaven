"use client";
import { useState } from "react";
import { KeyRound, Check, Info } from "lucide-react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const change = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.next.length < 6) return setMsg({ ok: false, text: "New password must be at least 6 characters." });
    if (form.next !== form.confirm) return setMsg({ ok: false, text: "New passwords do not match." });
    try { localStorage.setItem("tt_pw_updated", new Date().toISOString()); } catch {}
    setForm({ current: "", next: "", confirm: "" });
    setMsg({ ok: true, text: "Password updated successfully." });
  };

  return (
    <div className="card p-6 md:p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-12 h-12 rounded-xl bg-secondary-50 text-secondary"><KeyRound size={22} /></span>
        <div><h2 className="font-semibold text-lg">Change Password</h2><p className="text-sm text-muted">Keep your account secure.</p></div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs px-3.5 py-2.5 mb-5">
        <Info size={15} className="shrink-0 mt-0.5" /> This storefront uses a lightweight local account. Connect a real auth backend to enable server-side password management.
      </div>

      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm"><span className="block mb-1.5 font-medium">Current password</span><input type="password" name="current" value={form.current} onChange={change} className="field" /></label>
        <label className="block text-sm"><span className="block mb-1.5 font-medium">New password</span><input type="password" name="next" value={form.next} onChange={change} className="field" /></label>
        <label className="block text-sm"><span className="block mb-1.5 font-medium">Confirm new password</span><input type="password" name="confirm" value={form.confirm} onChange={change} className="field" /></label>
        {msg && <p className={`flex items-center gap-1.5 text-sm ${msg.ok ? "text-emerald-600" : "text-red-500"}`}>{msg.ok && <Check size={15} />}{msg.text}</p>}
        <button className="btn btn-primary">Update Password</button>
      </form>
    </div>
  );
}
