/**
 * @file Local CDN file serving route.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { lookup as lookupMime } from "mime-types";
import { NextRequest } from "next/server";

/**
 * Safely joins URL path segments under a root directory.
 *
 * Returns `null` when the resolved path escapes the root (path traversal guard).
 *
 * @param {string} root Root directory.
 * @param {string[]} parts Path segments.
 * @returns {string|null} Resolved absolute path or `null`.
 */
const safeJoin = (root: string, parts: string[]) => {
  const joined = path.join(root, ...parts);
  const resolvedRoot = path.resolve(root);
  const resolvedFile = path.resolve(joined);
  if (!resolvedFile.startsWith(resolvedRoot)) return null;
  return resolvedFile;
};

/**
 * Heuristic for immutable (fingerprinted) asset names.
 *
 * @param {string} fileName Filename.
 * @returns {boolean} Whether the name looks fingerprinted.
 */
const isFingerprintFileName = (fileName: string): boolean => {
  // Heuristic: treat files with a hash segment as immutable (safe for long-term caching).
  // Examples:
  // - hero.2b1c4d7a.webp
  // - hero-2b1c4d7a.webp
  // - hero.2b1c4d7a9e10.webp
  return /(?:\.|-)[a-f0-9]{8,}\./i.test(fileName);
};

/**
 * Generates a weak ETag from file size + modified time.
 *
 * @param {number} size File size.
 * @param {number} mtimeMs Modified time (ms).
 * @returns {string} Weak ETag.
 */
const makeWeakEtag = (size: number, mtimeMs: number): string =>
  `W/"${size}-${Math.floor(mtimeMs)}"`;

/**
 * Serves files from `/public/cdn` with cache headers and conditional requests.
 *
 * @param {import('next/server').NextRequest} req Request.
 * @param {{ params: Promise<{ path: string[] }> }} ctx Route context.
 * @returns {Promise<Response>} File response.
 */
export const GET = async (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) => {
  const { path: parts } = await ctx.params;

  const root = path.resolve(process.cwd(), "public", "cdn");
  const filePath = safeJoin(root, parts);
  if (!filePath) return new Response("Not found", { status: 404 });

  let stat: { size: number; mtimeMs: number };
  try {
    const s = await fs.stat(filePath);
    stat = { size: s.size, mtimeMs: s.mtimeMs };
  } catch {
    return new Response("Not found", { status: 404 });
  }

  let data: Buffer;
  try {
    data = await fs.readFile(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const bytes = new Uint8Array(data);

  const contentType = lookupMime(filePath) || "application/octet-stream";

  const fileName = parts.at(-1) ?? "";
  const cacheControl = isFingerprintFileName(fileName)
    ? "public, max-age=31536000, immutable"
    : "public, max-age=86400";

  const etag = makeWeakEtag(stat.size, stat.mtimeMs);
  const lastModified = new Date(stat.mtimeMs).toUTCString();

  const ifNoneMatch = req.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Last-Modified": lastModified,
        "Cache-Control": cacheControl,
      },
    });
  }

  const ifModifiedSince = req.headers.get("if-modified-since");
  if (ifModifiedSince) {
    const sinceMs = Date.parse(ifModifiedSince);
    if (!Number.isNaN(sinceMs) && stat.mtimeMs <= sinceMs) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Last-Modified": lastModified,
          "Cache-Control": cacheControl,
        },
      });
    }
  }

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType.toString(),
      "Content-Length": stat.size.toString(),
      ETag: etag,
      "Last-Modified": lastModified,
      "Cache-Control": cacheControl,
    },
  });
};
