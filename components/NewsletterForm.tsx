"use client";
import { useState } from "react";
import { Send, Check } from "lucide-react";

export default function NewsletterForm({ dark = true }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // No backend: store locally so the user isn't prompted again.
    try { localStorage.setItem("tt_newsletter", email); } catch {}
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3500);
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className={`flex-1 min-w-0 rounded-lg px-3.5 py-2.5 text-sm outline-none ${dark ? "bg-white/10 text-white placeholder:text-slate-400 border border-white/15 focus:border-secondary" : "field"}`}
      />
      <button className="btn btn-primary btn-sm shrink-0" aria-label="Subscribe">
        {done ? <Check size={16} /> : <Send size={16} />}
        <span className="hidden xs:inline">{done ? "Done" : "Join"}</span>
      </button>
    </form>
  );
}
