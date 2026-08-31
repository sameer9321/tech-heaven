import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductListItem from "@/components/ProductListItem";
import Filters from "@/components/shop/Filters";
import Toolbar from "@/components/shop/Toolbar";
import Pagination from "@/components/shop/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { SearchX } from "lucide-react";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 12;

type SP = { q?: string; category?: string; brand?: string; avail?: string; max?: string; sort?: string; view?: string; page?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const s = await searchParams;
  const title = s.category ? `${s.category}` : s.q ? `Search: ${s.q}` : "All Products";
  return { title, description: `Browse ${title.toLowerCase()} at TurboTech — genuine products with nationwide delivery.` };
}

export default async function Products({ searchParams }: { searchParams: Promise<SP> }) {
  const s = await searchParams;
  const page = Math.max(1, Number(s.page) || 1);
  const view = s.view === "list" ? "list" : "grid";

  // Build filter
  const where: Prisma.ProductWhereInput = {};
  const and: Prisma.ProductWhereInput[] = [];
  if (s.q) and.push({ OR: [{ name: { contains: s.q } }, { brand: { contains: s.q } }, { category: { contains: s.q } }] });
  if (s.category) and.push({ category: s.category });
  if (s.brand) and.push({ brand: { in: s.brand.split(",").filter(Boolean) } });
  if (s.avail === "in") and.push({ stock: { gt: 0 } });
  if (s.max) and.push({ price: { lte: Number(s.max) } });
  if (and.length) where.AND = and;

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    s.sort === "price-asc" ? { price: "asc" } :
    s.sort === "price-desc" ? { price: "desc" } :
    s.sort === "name" ? { name: "asc" } : { createdAt: "desc" };

  const [products, total, catRows, brandRows, priceAgg] = await Promise.all([
    prisma.product.findMany({ where, orderBy, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    prisma.product.count({ where }),
    prisma.product.findMany({ select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
    prisma.product.findMany({ select: { brand: true }, distinct: ["brand"], orderBy: { brand: "asc" } }),
    prisma.product.aggregate({ _max: { price: true } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const priceMax = Math.ceil((priceAgg._max.price || 500000) / 5000) * 5000;
  const categories = catRows.map((c) => c.category);
  const brands = brandRows.map((b) => b.brand);

  const makeHref = (p: number) => {
    const q = new URLSearchParams();
    Object.entries(s).forEach(([k, v]) => { if (v && k !== "page") q.set(k, String(v)); });
    q.set("page", String(p));
    return `/products?${q.toString()}`;
  };

  const heading = s.category || (s.q ? `Results for “${s.q}”` : "All Products");

  return (
    <>
      <Header />
      <main>
        {/* page head */}
        <div className="bg-white border-b border-line">
          <div className="container-tt py-6">
            <Breadcrumb items={[{ label: "Shop", href: "/products" }, ...(s.category ? [{ label: s.category }] : s.q ? [{ label: "Search" }] : [])]} />
            <h1 className="section-title text-primary mt-3">{heading}</h1>
          </div>
        </div>

        <div className="container-tt py-8 grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="card p-5 sticky top-28">
              <Filters categories={categories} brands={brands} priceMax={priceMax} />
            </div>
          </aside>

          {/* Results */}
          <div>
            <Toolbar count={total} categories={categories} brands={brands} priceMax={priceMax} />

            <div className="mt-6">
              {products.length === 0 ? (
                <div className="card p-16 text-center">
                  <SearchX size={44} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 text-lg font-semibold">No products found</h3>
                  <p className="mt-1 text-muted text-sm">Try adjusting your filters or search terms.</p>
                  <a href="/products" className="btn btn-primary btn-sm mt-5 inline-flex">Reset filters</a>
                </div>
              ) : view === "list" ? (
                <div className="space-y-4">
                  {products.map((p) => <ProductListItem key={p.id} p={p} />)}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                  {products.map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
              )}

              <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
