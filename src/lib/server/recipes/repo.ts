/**
 * @file Server-side recipes repository.
 */

import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import type { Prisma, Recipe } from "@prisma/client";
import { prisma } from "@/lib/server/db";
import { makeSlug } from "@/lib/server/slug";
import type {
  Ingredient,
  Recipe as RecipeDto,
  RecipeImages,
  RecipeListItem as RecipeListItemDto,
  Step,
} from "@/types/recipes";

/**
 * DB recipe list item projection used by `findMany`.
 */
export type RecipeListItem = Pick<
  Recipe,
  | "id"
  | "slug"
  | "title"
  | "lead"
  | "prepTimeMinutes"
  | "difficulty"
  | "dishGroup"
  | "cookingMethod"
  | "imageCdnPath"
  | "images"
>;

const cdnPathCache = new Map<string, string>();

const existsInsidePublicCdn = async (relativePath: string): Promise<boolean> => {
  const root = path.resolve(process.cwd(), "public", "cdn");
  const resolved = path.resolve(root, relativePath);
  if (!resolved.startsWith(root)) return false;

  try {
    await fs.access(resolved);
    return true;
  } catch {
    return false;
  }
};

const normalizeImageCdnPath = async (cdnPath: string): Promise<string> => {
  const cached = cdnPathCache.get(cdnPath);
  if (cached) return cached;

  const hasLeadingSlash = cdnPath.startsWith("/");
  const rel = hasLeadingSlash ? cdnPath.slice(1) : cdnPath;

  if (await existsInsidePublicCdn(rel)) {
    cdnPathCache.set(cdnPath, cdnPath);
    return cdnPath;
  }

  const parsed = path.parse(rel);
  const candidates = [".webp", ".jpg", ".jpeg", ".png", ".svg"];
  for (const ext of candidates) {
    if (ext.toLowerCase() === parsed.ext.toLowerCase()) continue;
    const candidateRel = path.join(parsed.dir, `${parsed.name}${ext}`);
    if (await existsInsidePublicCdn(candidateRel)) {
      const normalized = (hasLeadingSlash ? "/" : "") + candidateRel.replace(/\\/g, "/");
      cdnPathCache.set(cdnPath, normalized);
      return normalized;
    }
  }

  cdnPathCache.set(cdnPath, cdnPath);
  return cdnPath;
};

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
};

const normalizeRecipeImages = async (
  images: unknown,
  fallbackHeroCdnPath: string,
): Promise<RecipeImages> => {
  const base = asObject(images) ?? {};
  const hero = asObject(base.hero) ?? {};

  const rawHeroCdnPath = typeof hero.cdnPath === "string" ? hero.cdnPath : fallbackHeroCdnPath;
  const heroCdnPath = await normalizeImageCdnPath(rawHeroCdnPath);

  return {
    ...base,
    hero: {
      ...hero,
      cdnPath: heroCdnPath,
    },
  } as RecipeImages;
};

const toRecipeListItemDto = (r: RecipeListItem): RecipeListItemDto => {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    lead: r.lead,
    prepTimeMinutes: r.prepTimeMinutes,
    difficulty: r.difficulty,
    dishGroup: r.dishGroup,
    cookingMethod: r.cookingMethod,
    imageCdnPath: r.imageCdnPath,
    images: r.images ? (r.images as unknown as RecipeImages) : undefined,
  };
};

const toRecipeDto = (r: Recipe): RecipeDto => {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    lead: r.lead,
    prepTimeMinutes: r.prepTimeMinutes,
    servings: r.servings,
    difficulty: r.difficulty,
    dishGroup: r.dishGroup,
    cookingMethod: r.cookingMethod,
    tags: r.tags,
    ingredients: (r.ingredients as unknown as Ingredient[]) ?? [],
    steps: (r.steps as unknown as Step[]) ?? [],
    imageCdnPath: r.imageCdnPath,
    images: r.images ? (r.images as unknown as RecipeImages) : undefined,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
};

export const listRecipes = async (): Promise<RecipeListItemDto[]> => {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      lead: true,
      prepTimeMinutes: true,
      difficulty: true,
      dishGroup: true,
      cookingMethod: true,
      imageCdnPath: true,
      images: true,
    },
  });

  const normalized = await Promise.all(
    recipes.map(async (r) => {
      const images = await normalizeRecipeImages(r.images, r.imageCdnPath);
      return {
        ...r,
        imageCdnPath: images.hero?.cdnPath ?? (await normalizeImageCdnPath(r.imageCdnPath)),
        images,
      };
    }),
  );

  return normalized.map(toRecipeListItemDto);
};

/**
 * Loads a recipe by slug.
 *
 * @param {string} slug Recipe slug.
 * @returns {Promise<import('@/types/recipes').Recipe|null>} Recipe or `null`.
 * Returns `null` when not found.
 */
export const getRecipeBySlug = async (slug: string): Promise<RecipeDto | null> => {
  const recipe = await prisma.recipe.findUnique({ where: { slug } });
  if (!recipe) return null;
  const images = await normalizeRecipeImages(recipe.images, recipe.imageCdnPath);
  const normalized = {
    ...recipe,
    imageCdnPath: images.hero?.cdnPath ?? (await normalizeImageCdnPath(recipe.imageCdnPath)),
    images,
  };
  return toRecipeDto(normalized as Recipe);
};

const ensureUniqueSlug = async (base: string): Promise<string> => {
  for (let suffix = 1; ; suffix += 1) {
    const candidate = suffix === 1 ? base : `${base}-${suffix}`;
    const existing = await prisma.recipe.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
  }
};

export type CreateRecipeInput = Omit<Prisma.RecipeCreateInput, "slug"> & { slug?: string };

/**
 * Creates a recipe.
 *
 * - Generates/normalizes a slug and ensures uniqueness.
 * - Ensures `images.hero.cdnPath` stays aligned with `imageCdnPath`.
 *
 * @param {CreateRecipeInput} input Create input.
 * @returns {Promise<import('@/types/recipes').Recipe>} Created recipe.
 * @throws {Error} When slug generation fails.
 */
export const createRecipe = async (input: CreateRecipeInput) => {
  const requestedSlug = input.slug ? makeSlug(input.slug) : makeSlug(input.title);
  if (!requestedSlug) throw new Error("SLUG_GENERATION_FAILED");

  const slug = await ensureUniqueSlug(requestedSlug);

  const { slug: _unusedSlug, ...dataWithoutSlug } = input;
  void _unusedSlug;

  const imagesToStore =
    "images" in dataWithoutSlug && dataWithoutSlug.images
      ? dataWithoutSlug.images
      : ({ hero: { cdnPath: dataWithoutSlug.imageCdnPath } } satisfies Prisma.InputJsonValue);

  const created = await prisma.recipe.create({
    data: {
      ...dataWithoutSlug,
      slug,
      images: imagesToStore,
    },
  });

  const images = await normalizeRecipeImages(created.images, created.imageCdnPath);
  const normalized = {
    ...created,
    imageCdnPath: images.hero?.cdnPath ?? (await normalizeImageCdnPath(created.imageCdnPath)),
    images,
  };

  return toRecipeDto(normalized as Recipe);
};

/**
 * Updates a recipe.
 *
 * If `imageCdnPath` changes without an `images` update, this keeps
 * `images.hero.cdnPath` in sync (best-effort).
 *
 * @param {string} slug Recipe slug.
 * @param {import('@prisma/client').Prisma.RecipeUpdateInput} data Update input.
 * @returns {Promise<import('@/types/recipes').Recipe>} Updated recipe.
 */
export const updateRecipe = async (slug: string, data: Prisma.RecipeUpdateInput) => {
  const hasImagesUpdate = typeof (data as { images?: unknown }).images !== "undefined";
  let imagesToStore: Prisma.InputJsonValue | undefined;

  const imageCdnPathUpdate = (() => {
    const raw = (data as { imageCdnPath?: unknown }).imageCdnPath;
    if (typeof raw === "string") return raw;
    if (raw && typeof raw === "object") {
      const set = (raw as { set?: unknown }).set;
      if (typeof set === "string") return set;
    }
    return null;
  })();

  if (!hasImagesUpdate && imageCdnPathUpdate) {
    const existing = await prisma.recipe.findUnique({
      where: { slug },
      select: { images: true, imageCdnPath: true },
    });
    const existingImages = asObject(existing?.images) ?? {};
    const hero = asObject(existingImages.hero) ?? {};
    imagesToStore = {
      ...existingImages,
      hero: {
        ...hero,
        cdnPath: imageCdnPathUpdate,
      },
    } satisfies Prisma.InputJsonValue;
  }

  const updated = await prisma.recipe.update({
    where: { slug },
    data: {
      ...data,
      ...(imagesToStore ? { images: imagesToStore } : {}),
    },
  });

  const images = await normalizeRecipeImages(updated.images, updated.imageCdnPath);
  const normalized = {
    ...updated,
    imageCdnPath: images.hero?.cdnPath ?? (await normalizeImageCdnPath(updated.imageCdnPath)),
    images,
  };

  return toRecipeDto(normalized as Recipe);
};

/**
 * Deletes a recipe by slug.
 *
 * @param {string} slug Recipe slug.
 * @returns {Promise<import('@/types/recipes').Recipe>} Deleted recipe.
 */
export const deleteRecipe = async (slug: string) => {
  const deleted = await prisma.recipe.delete({ where: { slug } });
  const images = await normalizeRecipeImages(deleted.images, deleted.imageCdnPath);
  const normalized = {
    ...deleted,
    imageCdnPath: images.hero?.cdnPath ?? (await normalizeImageCdnPath(deleted.imageCdnPath)),
    images,
  };
  return toRecipeDto(normalized as Recipe);
};
