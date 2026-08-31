import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lightweight AJAX search used by the header suggestion dropdown.
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 1) return NextResponse.json({ products: [], categories: [] });

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { brand: { contains: q } },
        { category: { contains: q } },
      ],
    },
    select: { id: true, name: true, slug: true, brand: true, category: true, price: true, image: true },
    take: 6,
    orderBy: { featured: "desc" },
  });

  // Distinct matching categories for quick jumps.
  const catRows = await prisma.product.findMany({
    where: { category: { contains: q } },
    select: { category: true },
    distinct: ["category"],
    take: 4,
  });

  return NextResponse.json({ products, categories: catRows.map((c) => c.category) });
}
