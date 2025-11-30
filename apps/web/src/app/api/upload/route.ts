// app/api/upload/route.ts

import { auth } from "@desa/auth";
import { db } from "@desa/db";
import { file } from "@desa/db/schema/file";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const uploadFile = form.get("file") as File;

  if (!uploadFile) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Upload ke Vercel Blob
  const blob = await put(uploadFile.name, uploadFile, {
    access: "public",
    addRandomSuffix: true,
  });

  // Masukkan ke DB
  const [saved] = await db
    .insert(file)
    .values({
      name: uploadFile.name,
      path: blob.url, // sesuai schema: file_path
      uploadedBy: session.user.id,
    })
    .returning();

  if (!saved) {
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }

  return NextResponse.json({
    id: saved.id,
    url: saved.path,
  });
}
