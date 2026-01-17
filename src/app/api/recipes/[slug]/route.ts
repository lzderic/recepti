/**
 * @file Single recipe API route.
 */

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  errInvalidPayload,
  errInvalidSlug,
  errRecipeNotFound,
  errUnexpectedError,
} from "@/lib/server/api-errors";
import { jsonData, jsonError } from "@/lib/server/api-response";
import { updateRecipeSchema } from "@/lib/server/recipes/schemas";
import { deleteRecipe, getRecipeBySlug, updateRecipe } from "@/lib/server/recipes/repo";
import { deleteRecipeCdnFolder } from "@/lib/server/recipes/cdn-files";

const paramsSchema = z.object({ slug: z.string().min(1) });

type SlugCtx = { params: Promise<{ slug: string }> };

/**
 * Parses a slug from Next.js route params.
 *
 * Returns either the slug (string) or an error `Response`.
 *
 * @param {{ params: Promise<{ slug: string }> }} ctx Route context.
 * @returns {Promise<string|Response>} Slug or error response.
 */
const getSlugOrResponse = async (ctx: SlugCtx): Promise<string | Response> => {
  const params = paramsSchema.safeParse(await ctx.params);
  if (!params.success) return jsonError(errInvalidSlug(params.error.flatten()));
  return params.data.slug;
};

type RecipeBySlug = Awaited<ReturnType<typeof getRecipeBySlug>>;

/**
 * Loads a recipe or returns a 404 error response.
 *
 * @param {string} slug Recipe slug.
 * @returns {Promise<NonNullable<RecipeBySlug>|Response>} Recipe or error response.
 */
const getRecipeOrNotFoundResponse = async (
  slug: string,
): Promise<NonNullable<RecipeBySlug> | Response> => {
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return jsonError(errRecipeNotFound());
  return recipe;
};

/**
 * Fetches a recipe by slug.
 *
 * @param {import('next/server').NextRequest} _req Request.
 * @param {{ params: Promise<{ slug: string }> }} ctx Route context.
 * @returns {Promise<import('next/server').NextResponse|Response>} JSON response.
 */
export const GET = async (_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  const slugOrRes = await getSlugOrResponse(ctx);
  if (typeof slugOrRes !== "string") return slugOrRes;

  const recipeOrRes = await getRecipeOrNotFoundResponse(slugOrRes);
  if (recipeOrRes instanceof Response) return recipeOrRes;

  return jsonData(recipeOrRes);
};

/**
 * Updates a recipe by slug.
 *
 * @param {import('next/server').NextRequest} req Request.
 * @param {{ params: Promise<{ slug: string }> }} ctx Route context.
 * @returns {Promise<import('next/server').NextResponse|Response>} JSON response.
 */
export const PUT = async (req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  const slugOrRes = await getSlugOrResponse(ctx);
  if (typeof slugOrRes !== "string") return slugOrRes;

  const existingOrRes = await getRecipeOrNotFoundResponse(slugOrRes);
  if (existingOrRes instanceof Response) return existingOrRes;

  const json = await req.json().catch(() => null);
  const parsed = updateRecipeSchema.safeParse(json);
  if (!parsed.success) {
    return jsonError(errInvalidPayload(parsed.error.flatten()));
  }

  try {
    const updated = await updateRecipe(slugOrRes, {
      ...parsed.data,
      ingredients: parsed.data.ingredients as unknown as Prisma.InputJsonValue,
      steps: parsed.data.steps as unknown as Prisma.InputJsonValue,
      ...(parsed.data.images
        ? { images: parsed.data.images as unknown as Prisma.InputJsonValue }
        : {}),
    });

    return jsonData(updated);
  } catch {
    return jsonError(errUnexpectedError());
  }
};

/**
 * Deletes a recipe by slug.
 *
 * @param {import('next/server').NextRequest} _req Request.
 * @param {{ params: Promise<{ slug: string }> }} ctx Route context.
 * @returns {Promise<import('next/server').NextResponse|Response>} Empty response.
 */
export const DELETE = async (_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  const slugOrRes = await getSlugOrResponse(ctx);
  if (typeof slugOrRes !== "string") return slugOrRes;

  const existingOrRes = await getRecipeOrNotFoundResponse(slugOrRes);
  if (existingOrRes instanceof Response) return existingOrRes;

  await deleteRecipe(slugOrRes);
  await deleteRecipeCdnFolder(slugOrRes);
  return new NextResponse(null, { status: 204 });
};
