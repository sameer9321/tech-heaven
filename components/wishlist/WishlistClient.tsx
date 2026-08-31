"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import ProductCard from "@/components/ProductCard";

export default function WishlistClient() {
  const { wishlist, addToCart, toggleWishlist, ready } = useStore();

  if (!ready) return <div className="container-tt py-16"><div className="skeleton h-64 rounded-2xl" /></div>;

  if (wishlist.length === 0) {
    return (
      <div className="container-tt py-20">
        <div className="card max-w-lg mx-auto p-12 text-center">
          <span className="grid place-items-center w-16 h-16 rounded-2xl bg-red-50 text-red-500 mx-auto"><Heart size={30} /></span>
          <h1 className="mt-5 text-2xl font-bold">Your wishlist is empty</h1>
          <p className="mt-2 text-muted">Save products you love and find them here anytime.</p>
          <Link href="/products" className="btn btn-primary mt-6 inline-flex">Discover products <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-tt py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="section-title text-primary">My Wishlist <span className="text-muted text-lg font-normal">({wishlist.length})</span></h1>
        <button onClick={() => wishlist.forEach((p) => addToCart(p))} className="btn btn-primary btn-sm"><ShoppingCart size={16} /> Add all to cart</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {wishlist.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
