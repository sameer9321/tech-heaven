import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Upload an image → saved to /public/uploads, returns its public path.
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Invalid file type. Use JPG, JPEG, PNG or WEBP." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image too large. Maximum size is 4 MB." }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), bytes);

  return NextResponse.json({ path: `/uploads/${name}` });
}

// Delete a previously uploaded image (only files under /uploads).
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const target = req.nextUrl.searchParams.get("path") || "";
  if (!target.startsWith("/uploads/")) return NextResponse.json({ error: "Invalid path" }, { status: 400 });

  const filename = path.basename(target); // guard against traversal
  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    /* already gone — treat as success */
  }
  return NextResponse.json({ ok: true });
}
