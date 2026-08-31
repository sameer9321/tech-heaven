import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const b = await req.json();
    const slide = await prisma.slide.update({
      where: { id: Number(id) },
      data: {
        heading: b.heading,
        description: b.description || "",
        image: b.image,
        btn1Label: b.btn1Label || null,
        btn1Link: b.btn1Link || null,
        btn2Label: b.btn2Label || null,
        btn2Link: b.btn2Link || null,
        sortOrder: Number(b.sortOrder ?? 0),
        active: Boolean(b.active),
      },
    });
    return NextResponse.json(slide);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unable to update slide" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const slide = await prisma.slide.findUnique({ where: { id: Number(id) } });
  await prisma.slide.delete({ where: { id: Number(id) } });
  // Remove the stored image file if it lives under /uploads.
  if (slide?.image?.startsWith("/uploads/")) {
    try { await unlink(path.join(process.cwd(), "public", "uploads", path.basename(slide.image))); } catch {}
  }
  return NextResponse.json({ ok: true });
}
