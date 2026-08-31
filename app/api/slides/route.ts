import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

// List all slides (admin) ordered by sortOrder.
export async function GET() {
  return NextResponse.json(await prisma.slide.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }));
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.heading || !b.image) return NextResponse.json({ error: "Heading and image are required" }, { status: 400 });
    const max = await prisma.slide.aggregate({ _max: { sortOrder: true } });
    const slide = await prisma.slide.create({
      data: {
        heading: b.heading,
        description: b.description || "",
        image: b.image,
        btn1Label: b.btn1Label || null,
        btn1Link: b.btn1Link || null,
        btn2Label: b.btn2Label || null,
        btn2Link: b.btn2Link || null,
        sortOrder: b.sortOrder != null ? Number(b.sortOrder) : (max._max.sortOrder ?? 0) + 1,
        active: b.active != null ? Boolean(b.active) : true,
      },
    });
    return NextResponse.json(slide);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unable to create slide" }, { status: 400 });
  }
}
