"use client";
import ProductCard from "@/components/ProductCard";
import SectionHead from "@/components/SectionHead";
import { useStore } from "@/components/store/StoreProvider";

export default function RecentlyViewed({ currentId }: { currentId: number }) {
  const { recent } = useStore();
  const items = recent.filter((p) => p.id !== currentId).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <SectionHead title="Recently viewed" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
