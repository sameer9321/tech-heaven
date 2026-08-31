import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Gallery from "@/components/product/Gallery";
import BuyBox from "@/components/product/BuyBox";
import ProductTabs from "@/components/product/ProductTabs";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import ProductCard from "@/components/ProductCard";
import SectionHead from "@/components/SectionHead";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/utils";
import { catHref } from "@/lib/catalog";
import { Star, Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { slug: id } });
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.shortDesc,
    openGraph: { title: p.name, description: p.shortDesc, images: [p.image], type: "website" },
    twitter: { card: "summary_large_image", title: p.name, description: p.shortDesc, images: [p.image] },
  };
}

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { slug: id } });
  if (!p) notFound();

  const related = await prisma.product.findMany({
    where: { category: p.category, NOT: { id: p.id } },
    take: 4, orderBy: { featured: "desc" },
  });

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923080123766";
  const off = p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: [p.image],
    description: p.shortDesc,
    brand: { "@type": "Brand", name: p.brand },
    category: p.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: p.price,
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://turbotech.pk/products/${p.slug}`,
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "3" },
  };

  const delivery = [
    { i: <Truck size={18} />, t: "Fast Delivery", s: "Nationwide in 2–4 days" },
    { i: <ShieldCheck size={18} />, t: "Genuine Warranty", s: "Official brand warranty" },
    { i: <RotateCcw size={18} />, t: "7-Day Returns", s: "Easy return & replacement" },
    { i: <CreditCard size={18} />, t: "Secure Payment", s: "COD, transfer & wallets" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <div className="bg-white border-b border-line">
          <div className="container-tt py-5">
            <Breadcrumb items={[{ label: "Shop", href: "/products" }, { label: p.category, href: catHref(p.category) }, { label: p.name }]} />
          </div>
        </div>

        <div className="container-tt py-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <Gallery image={p.image} name={p.name} badge={off > 0 ? `-${off}%` : undefined} />

            <div>
              <div className="flex items-center gap-3">
                <span className="chip">{p.brand}</span>
                <span className="flex items-center gap-1 text-sm text-amber-500 font-medium"><Star size={15} className="fill-current" /> 4.8 <span className="text-muted">(3 reviews)</span></span>
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-bold text-primary leading-tight">{p.name}</h1>
              <p className="mt-3 text-slate-600 leading-relaxed">{p.shortDesc}</p>

              <div className="my-6 h-px bg-line" />
              <BuyBox p={p} wa={wa} />

              {/* Delivery info */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                {delivery.map((d) => (
                  <div key={d.t} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                    <span className="grid place-items-center w-9 h-9 rounded-lg bg-secondary-50 text-secondary shrink-0">{d.i}</span>
                    <span><b className="block text-xs">{d.t}</b><span className="text-[11px] text-muted">{d.s}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <ProductTabs description={p.description} specs={p.specs} />
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-16">
              <SectionHead title="Related products" href={catHref(p.category)} linkLabel="View more" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {related.map((r) => <ProductCard key={r.id} p={r} />)}
              </div>
            </section>
          )}

          <RecentlyViewed currentId={p.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
