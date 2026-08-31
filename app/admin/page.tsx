"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, Images, Store, LogOut, Menu, X, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";
import DashboardView from "@/components/admin/DashboardView";
import ProductsView from "@/components/admin/ProductsView";
import SlidersView, { Slide } from "@/components/admin/SlidersView";

type View = "dashboard" | "products" | "sliders";
type Toast = { id: number; msg: string; ok: boolean };

export default function Admin() {
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nav, setNav] = useState(false);

  const notify = useCallback((msg: string, ok = true) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, ok }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const load = useCallback(async () => {
    const [pr, sr] = await Promise.all([fetch("/api/products"), fetch("/api/slides")]);
    setProducts(await pr.json());
    setSlides(await sr.json());
  }, []);

  useEffect(() => {
    // Restore session if already authenticated this tab.
    try { if (sessionStorage.getItem("adminPassword")) setLogged(true); } catch {}
  }, []);
  useEffect(() => { if (logged) load(); }, [logged, load]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    try { sessionStorage.setItem("adminPassword", password); } catch {}
    setLogged(true);
  }
  function logout() {
    try { sessionStorage.removeItem("adminPassword"); } catch {}
    setLogged(false); setPassword(""); setView("dashboard");
  }

  if (!logged) {
    return (
      <main className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <Logo />
          <div className="flex items-center gap-2 mt-6 text-slate-900"><span className="grid place-items-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600"><Lock size={20} /></span><div><h1 className="text-lg font-bold leading-tight">Admin Login</h1><p className="text-sm text-slate-500">Sign in to manage your store</p></div></div>
          <form onSubmit={login} className="mt-6 space-y-3">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" required autoFocus
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition"><ShieldCheck size={18} /> Open Dashboard</button>
            <Link href="/" className="block text-center text-sm text-slate-500 hover:text-blue-600 transition py-1">← Back to store</Link>
          </form>
          <p className="mt-5 text-xs text-slate-400 text-center">Password is set via <code className="px-1 py-0.5 bg-slate-100 rounded">ADMIN_PASSWORD</code> in your .env file.</p>
        </div>
      </main>
    );
  }

  const NAV: { key: View; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={19} /> },
    { key: "products", label: "Products", icon: <Package size={19} /> },
    { key: "sliders", label: "Homepage Slider", icon: <Images size={19} /> },
  ];

  const SidebarInner = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-800"><Logo light /></div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((n) => (
          <button key={n.key} onClick={() => { setView(n.key); setNav(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${view === n.key ? "bg-blue-600 text-white shadow" : "text-slate-300 hover:bg-slate-800"}`}>
            {n.icon} {n.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link href="/" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition"><Store size={19} /> View Store</Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition"><LogOut size={19} /> Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-slate-900">{SidebarInner}</aside>

      {/* Mobile sidebar */}
      {nav && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setNav(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-slate-900 animate-[slideInLeft_.25s_ease]">{SidebarInner}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
            <button onClick={() => setNav(true)} className="lg:hidden grid place-items-center w-10 h-10 rounded-lg border border-slate-200 text-slate-600"><Menu size={20} /></button>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight capitalize">{view === "sliders" ? "Homepage Slider" : view}</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Manage your TurboTech store</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Online</span>
              <span className="grid place-items-center w-9 h-9 rounded-full bg-slate-900 text-white text-sm font-semibold">A</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {view === "dashboard" && <DashboardView products={products} slides={slides} go={setView} />}
          {view === "products" && <ProductsView products={products} reload={load} notify={notify} />}
          {view === "sliders" && <SlidersView slides={slides} reload={load} notify={notify} />}
        </main>
      </div>

      {/* Toasts */}
      <div className="fixed z-[90] bottom-5 right-5 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border animate-[slideDown_.25s_ease] ${t.ok ? "bg-white text-slate-800 border-slate-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {t.ok ? <CheckCircle2 size={17} className="text-emerald-500" /> : <AlertCircle size={17} className="text-red-500" />} {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
