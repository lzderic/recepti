/**
 * @file Recipes collection API route.
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import {
  errInvalidPayload,
  errRecipeSlugMustBeUnique,
  errSlugCouldNotBeGenerated,
  errUnexpectedError,
} from "@/lib/server/api-errors";
import { jsonData, jsonError } from "@/lib/server/api-response";
import { createRecipeSchema } from "@/lib/server/recipes/schemas";
import { createRecipe, listRecipes } from "@/lib/server/recipes/repo";

/**
 * Lists recipes.
 *
 * @returns {Promise<import('next/server').NextResponse>} JSON response.
 */
export const GET = async () => {
  const recipes = await listRecipes();
  return jsonData(recipes);
};

/**
 * Creates a recipe.
 *
 * @param {import('next/server').NextRequest} req Request.
 * @returns {Promise<import('next/server').NextResponse>} JSON response.
 */
export const POST = async (req: NextRequest) => {
  const json = await req.json().catch(() => null);
  const parsed = createRecipeSchema.safeParse(json);
  if (!parsed.success) {
    return jsonError(errInvalidPayload(parsed.error.flatten()));
  }

  try {
    const created = await createRecipe({
      ...parsed.data,
      ingredients: parsed.data.ingredients as unknown as Prisma.InputJsonValue,
      steps: parsed.data.steps as unknown as Prisma.InputJsonValue,
      ...(parsed.data.images
        ? { images: parsed.data.images as unknown as Prisma.InputJsonValue }
        : {}),
    });

    return jsonData(created, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "SLUG_GENERATION_FAILED") {
      return jsonError(errSlugCouldNotBeGenerated());
    }

    // Prisma unique constraint
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return jsonError(errRecipeSlugMustBeUnique());
    }

    return jsonError(errUnexpectedError());
  }
};
