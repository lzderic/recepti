/**
 * @file Helpers for managing local CDN files.
 */

import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { isValidSlug } from "@/lib/server/slug";

/**
 * Best-effort cleanup for a recipe's local CDN folder (dev/local storage).
 *
 * Uses slug validation and path traversal guards.
 */
export const deleteRecipeCdnFolder = async (slug: string): Promise<void> => {
  if (!isValidSlug(slug)) return;

  const root = path.resolve(process.cwd(), "public", "cdn", "recipes");
  const absDir = path.resolve(root, slug);
  if (!absDir.startsWith(root)) return;

  try {
    await fs.rm(absDir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup only.
  }
};
