import Link from "next/link";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";
import { CATEGORIES, catHref } from "@/lib/catalog";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="mt-auto bg-primary text-slate-300">
      {/* trust strip */}
      <div className="border-b border-white/10">
        <div className="container-tt grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
          {[
            { i: <Truck size={22} />, t: "Fast Delivery", s: "Nationwide, 2–4 days" },
            { i: <ShieldCheck size={22} />, t: "Genuine Warranty", s: "100% authentic stock" },
            { i: <RotateCcw size={22} />, t: "Easy Returns", s: "7-day return policy" },
            { i: <CreditCard size={22} />, t: "Secure Checkout", s: "COD & bank transfer" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-secondary/15 text-secondary shrink-0">{f.i}</span>
              <span><b className="block text-white text-sm">{f.t}</b><span className="text-xs text-slate-400">{f.s}</span></span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-tt py-14 grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
            TurboTech is Pakistan's premium destination for gaming laptops, MacBooks, desktops and accessories — genuine products, transparent specs and expert support.
          </p>
          <div className="flex gap-2 mt-5">
            {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="social" className="grid place-items-center w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary transition text-white"><I size={17} /></a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/products" className="link-muted text-slate-400">All Products</Link></li>
            <li><Link href="/cart" className="link-muted text-slate-400">Cart</Link></li>
            <li><Link href="/wishlist" className="link-muted text-slate-400">Wishlist</Link></li>
            <li><Link href="/compare" className="link-muted text-slate-400">Compare</Link></li>
            <li><Link href="/account" className="link-muted text-slate-400">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Categories</h4>
          <ul className="space-y-2.5 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.label}><Link href={catHref(c.label)} className="link-muted text-slate-400">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Stay in the loop</h4>
          <p className="text-sm text-slate-400 mb-3">Deals, new arrivals & buying guides — no spam.</p>
          <NewsletterForm />
          <div className="mt-5 space-y-2 text-sm text-slate-400">
            <a href="tel:+923001234567" className="flex items-center gap-2 hover:text-white transition"><Phone size={15} /> +92 300 1234567</a>
            <a href="mailto:sales@turbotech.pk" className="flex items-center gap-2 hover:text-white transition"><Mail size={15} /> sales@turbotech.pk</a>
            <span className="flex items-center gap-2"><MapPin size={15} /> Karachi, Pakistan</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-tt py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {year} TurboTech. All rights reserved.</span>
          <div className="flex items-center gap-2">
            {["VISA", "Mastercard", "Easypaisa", "JazzCash", "COD"].map((p) => (
              <span key={p} className="px-2.5 py-1 rounded-md bg-white/10 text-[11px] font-medium text-slate-200">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
