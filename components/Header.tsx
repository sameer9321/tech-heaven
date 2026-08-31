"use client";
import Link from "next/link";
import { useState } from "react";
import { Phone, Mail, MapPin, Heart, GitCompareArrows, ShoppingCart, User, Menu, X, ChevronDown, Headphones, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useStore } from "./store/StoreProvider";
import { MEGA_MENU, CATEGORIES, catHref } from "@/lib/catalog";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Gaming", href: catHref("Gaming Laptops") },
  { label: "MacBooks", href: catHref("MacBooks") },
  { label: "Accessories", href: catHref("Accessories") },
];

export default function Header() {
  const { cartCount, wishCount, compareCount, ready } = useStore();
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);

  const Badge = ({ n }: { n: number }) => (ready && n > 0 ? <span className="count-badge">{n}</span> : null);

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-slate-300 text-[13px]">
        <div className="container-tt flex items-center justify-between py-2">
          <div className="flex items-center gap-5">
            <a href="tel:+923001234567" className="flex items-center gap-1.5 hover:text-white transition"><Phone size={13} /> +92 300 1234567</a>
            <a href="mailto:sales@turbotech.pk" className="flex items-center gap-1.5 hover:text-white transition"><Mail size={13} /> sales@turbotech.pk</a>
            <span className="flex items-center gap-1.5"><MapPin size={13} /> Karachi, Pakistan</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-medium"><Headphones size={13} /> Genuine products · Nationwide delivery</div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
        <div className="container-tt flex items-center gap-4 md:gap-6 h-[68px]">
          <button className="lg:hidden icon-btn !w-10 !h-10" onClick={() => setMobile(true)} aria-label="Open menu"><Menu size={20} /></button>
          <Logo />

          {/* Categories mega-menu trigger (desktop) */}
          <div className="relative hidden lg:block" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button className="btn btn-dark btn-sm !py-2.5 gap-1.5" aria-haspopup="true" aria-expanded={mega}>
              <Menu size={16} /> Categories <ChevronDown size={15} className={`transition-transform ${mega ? "rotate-180" : ""}`} />
            </button>
            {mega && (
              <div className="absolute left-0 top-full pt-3 w-[720px] animate-[slideDown_.18s_ease]">
                <div className="rounded-2xl border border-line bg-white shadow-[0_24px_60px_rgba(15,23,42,.18)] p-5 grid grid-cols-3 gap-5">
                  {MEGA_MENU.map((col) => (
                    <div key={col.title}>
                      <p className="text-xs font-bold uppercase tracking-wide text-secondary mb-3">{col.title}</p>
                      <ul className="space-y-1">
                        {col.items.map((c) => (
                          <li key={c.label}>
                            <Link href={catHref(c.label)} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-bg group">
                              <span className="text-lg">{c.icon}</span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium group-hover:text-secondary transition">{c.label}</span>
                                <span className="block text-[11px] text-muted truncate">{c.blurb}</span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link href="/products" className="col-span-3 mt-1 flex items-center justify-center gap-2 text-sm font-semibold text-secondary hover:gap-3 transition-all">
                    View all products <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:block flex-1"><SearchBar /></div>

          {/* Action icons */}
          <nav className="flex items-center gap-1.5 md:gap-2 ml-auto sm:ml-0">
            <Link href="/wishlist" className="icon-btn !w-10 !h-10" aria-label="Wishlist"><Heart size={19} /><Badge n={wishCount} /></Link>
            <Link href="/compare" className="hidden sm:grid icon-btn !w-10 !h-10" aria-label="Compare"><GitCompareArrows size={19} /><Badge n={compareCount} /></Link>
            <Link href="/cart" className="icon-btn !w-10 !h-10" aria-label="Cart"><ShoppingCart size={19} /><Badge n={cartCount} /></Link>
            <Link href="/account" className="hidden md:grid icon-btn !w-10 !h-10" aria-label="Account"><User size={19} /></Link>
          </nav>
        </div>

        {/* Secondary nav (desktop) */}
        <div className="hidden lg:block border-t border-line/70">
          <div className="container-tt flex items-center gap-6 h-11 text-sm font-medium">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="text-slate-600 hover:text-secondary transition">{n.label}</Link>
            ))}
            <span className="ml-auto text-xs text-muted flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Fast same-day dispatch on select items</span>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="sm:hidden container-tt pb-3"><SearchBar /></div>
      </header>

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_.2s_ease]" onClick={() => setMobile(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-[slideInLeft_.25s_ease] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-line">
              <Logo />
              <button className="icon-btn !w-10 !h-10" onClick={() => setMobile(false)} aria-label="Close menu"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-1">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} onClick={() => setMobile(false)} className="block px-3 py-3 rounded-lg font-medium hover:bg-bg">{n.label}</Link>
              ))}
            </div>
            <div className="px-4 pb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-secondary mb-2 px-3">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <Link key={c.label} href={catHref(c.label)} onClick={() => setMobile(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-line hover:border-secondary text-sm">
                    <span>{c.icon}</span> <span className="truncate">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-auto p-4 border-t border-line flex items-center gap-2">
              <Link href="/account" onClick={() => setMobile(false)} className="btn btn-sm flex-1"><User size={16} /> Account</Link>
              <Link href="/compare" onClick={() => setMobile(false)} className="btn btn-sm flex-1"><GitCompareArrows size={16} /> Compare</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
