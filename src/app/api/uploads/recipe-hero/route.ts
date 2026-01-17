/**
 * @file Upload API route for recipe hero images.
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  errEmptyFile,
  errExpectedMultipartFormData,
  errInvalidPath,
  errInvalidSlug,
  errMaxFileSize,
  errMissingFile,
  errUnsupportedImageType,
} from "@/lib/server/api-errors";
import { jsonData, jsonError } from "@/lib/server/api-response";
import { isValidSlug } from "@/lib/server/slug";
import { imageExtFromFile } from "@/lib/images";

/**
 * Maximum upload size for the hero image.
 */
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Uploads a recipe hero image to local `/public/cdn` storage.
 *
 * @param {Request} req Request.
 * @returns {Promise<import('next/server').NextResponse|Response>} JSON response.
 */
export const POST = async (req: Request) => {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError(errExpectedMultipartFormData());
  }

  const slugRaw = form.get("slug");
  const fileRaw = form.get("file");

  const slug = typeof slugRaw === "string" ? slugRaw.trim() : "";
  if (!slug || !isValidSlug(slug)) {
    return jsonError(errInvalidSlug());
  }

  if (!(fileRaw instanceof File)) {
    return jsonError(errMissingFile());
  }

  if (fileRaw.size <= 0) {
    return jsonError(errEmptyFile());
  }

  if (fileRaw.size > MAX_BYTES) {
    return jsonError(errMaxFileSize(MAX_BYTES));
  }

  const ext = imageExtFromFile(fileRaw);
  if (!ext) {
    return jsonError(errUnsupportedImageType());
  }

  const bytes = new Uint8Array(await fileRaw.arrayBuffer());
  const hash = crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 12);

  const relDir = path.join("recipes", slug);
  const relFile = path.join(relDir, `hero.${hash}${ext}`);

  const root = path.resolve(process.cwd(), "public", "cdn");
  const absFile = path.resolve(root, relFile);

  // Safety: prevent path traversal.
  if (!absFile.startsWith(root)) {
    return jsonError(errInvalidPath());
  }

  await fs.mkdir(path.dirname(absFile), { recursive: true });

  await fs.writeFile(absFile, bytes);

  const cdnPath = `/${relFile.replace(/\\/g, "/")}`;
  return jsonData({ cdnPath }, { status: 201 });
};
