"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CartItem, Product, ProductRef, toRef } from "@/lib/types";

/* ------------------------------------------------------------------
   TurboTech client store — cart, wishlist, compare & recently viewed.
   Everything is persisted to localStorage (no backend / DB changes).
------------------------------------------------------------------- */

const COMPARE_LIMIT = 4;

type Toast = { id: number; message: string; tone: "success" | "info" | "error" };

type StoreCtx = {
  ready: boolean;
  // cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (p: Product | ProductRef, qty?: number) => void;
  removeFromCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  // wishlist
  wishlist: ProductRef[];
  wishCount: number;
  toggleWishlist: (p: Product | ProductRef) => void;
  inWishlist: (id: number) => boolean;
  // compare
  compare: ProductRef[];
  compareCount: number;
  toggleCompare: (p: Product | ProductRef) => void;
  inCompare: (id: number) => boolean;
  clearCompare: () => void;
  // recently viewed
  recent: ProductRef[];
  pushRecent: (p: Product | ProductRef) => void;
  // toasts
  toasts: Toast[];
  notify: (message: string, tone?: Toast["tone"]) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

function useLocalState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value, ready]);
  return [value, setValue, ready];
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart, r1] = useLocalState<CartItem[]>("tt_cart", []);
  const [wishlist, setWishlist, r2] = useLocalState<ProductRef[]>("tt_wishlist", []);
  const [compare, setCompare, r3] = useLocalState<ProductRef[]>("tt_compare", []);
  const [recent, setRecent, r4] = useLocalState<ProductRef[]>("tt_recent", []);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);

  const ready = r1 && r2 && r3 && r4;

  const notify = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = toastId.current++;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // cart -------------------------------------------------------------
  const addToCart = useCallback((p: Product | ProductRef, qty = 1) => {
    const ref = toRef(p as Product);
    setCart((items) => {
      const found = items.find((i) => i.id === ref.id);
      if (found) return items.map((i) => (i.id === ref.id ? { ...i, qty: i.qty + qty } : i));
      return [...items, { ...ref, qty }];
    });
    notify(`${p.name} added to cart`);
  }, [setCart, notify]);

  const removeFromCart = useCallback((id: number) => setCart((i) => i.filter((x) => x.id !== id)), [setCart]);
  const setQty = useCallback((id: number, qty: number) =>
    setCart((i) => i.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))), [setCart]);
  const clearCart = useCallback(() => setCart([]), [setCart]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  // wishlist ---------------------------------------------------------
  const inWishlist = useCallback((id: number) => wishlist.some((x) => x.id === id), [wishlist]);
  const toggleWishlist = useCallback((p: Product | ProductRef) => {
    const ref = toRef(p as Product);
    setWishlist((items) => {
      if (items.some((x) => x.id === ref.id)) { notify(`${p.name} removed from wishlist`, "info"); return items.filter((x) => x.id !== ref.id); }
      notify(`${p.name} added to wishlist`); return [...items, ref];
    });
  }, [setWishlist, notify]);

  // compare ----------------------------------------------------------
  const inCompare = useCallback((id: number) => compare.some((x) => x.id === id), [compare]);
  const toggleCompare = useCallback((p: Product | ProductRef) => {
    const ref = toRef(p as Product);
    setCompare((items) => {
      if (items.some((x) => x.id === ref.id)) return items.filter((x) => x.id !== ref.id);
      if (items.length >= COMPARE_LIMIT) { notify(`You can compare up to ${COMPARE_LIMIT} products`, "error"); return items; }
      notify(`${p.name} added to compare`); return [...items, ref];
    });
  }, [setCompare, notify]);
  const clearCompare = useCallback(() => setCompare([]), [setCompare]);

  // recently viewed --------------------------------------------------
  const pushRecent = useCallback((p: Product | ProductRef) => {
    const ref = toRef(p as Product);
    setRecent((items) => [ref, ...items.filter((x) => x.id !== ref.id)].slice(0, 8));
  }, [setRecent]);

  const value: StoreCtx = {
    ready,
    cart, cartCount, cartTotal, addToCart, removeFromCart, setQty, clearCart,
    wishlist, wishCount: wishlist.length, toggleWishlist, inWishlist,
    compare, compareCount: compare.length, toggleCompare, inCompare, clearCompare,
    recent, pushRecent,
    toasts, notify,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} />
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

function ToastHost({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed z-[100] bottom-5 right-5 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto rounded-xl px-4 py-3 text-sm font-medium shadow-lg animate-[slideDown_.25s_ease] border"
          style={{
            background: t.tone === "error" ? "#fef2f2" : t.tone === "info" ? "#f1f5f9" : "#ecfdf5",
            color: t.tone === "error" ? "#b91c1c" : t.tone === "info" ? "#334155" : "#166534",
            borderColor: t.tone === "error" ? "#fecaca" : t.tone === "info" ? "#e2e8f0" : "#bbf7d0",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
