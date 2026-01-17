/**
 * @file Client-side recipes API service.
 */

import type {
  CookingMethod,
  Difficulty,
  DishGroup,
  Ingredient,
  Recipe,
  RecipeImages,
  RecipeListItem,
  Step,
} from "@/types/recipes";
import { requestJsonOrThrow, requestVoidOrThrow } from "@/lib/http/axios";
import { unwrapArrayData, unwrapData } from "@/lib/http/unwrap";

/**
 * Payload for creating a new recipe via `/api/recipes`.
 *
 * Note: `slug` is optional; the server may generate one when omitted.
 */
export type CreateRecipePayload = {
  title: string;
  lead: string;
  prepTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  dishGroup: DishGroup;
  cookingMethod: CookingMethod;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  imageCdnPath: string;
  images?: RecipeImages;
  slug?: string;
};

/**
 * Patch payload for updating a recipe via `/api/recipes/:slug`.
 */
export type UpdateRecipePayload = Partial<Omit<CreateRecipePayload, "slug">>;

/**
 * Lists recipes.
 *
 * @param {{ signal?: AbortSignal }} [opts] Optional fetch options (e.g. `AbortSignal`).
 * @returns {Promise<import('@/types/recipes').RecipeListItem[]>} Recipes list.
 */
export const listRecipes = async (opts?: { signal?: AbortSignal }) => {
  const json = await requestJsonOrThrow<{ data?: RecipeListItem[] }>({
    url: "/api/recipes",
    method: "GET",
    headers: { "Cache-Control": "no-store" },
    signal: opts?.signal,
  });

  return unwrapArrayData(json);
};

/**
 * Fetches a single recipe by slug.
 *
 * @param {string} slug Recipe slug.
 * @param {{ signal?: AbortSignal }} [opts] Optional fetch options (e.g. `AbortSignal`).
 * @returns {Promise<import('@/types/recipes').Recipe>} Recipe.
 */
export const getRecipe = async (slug: string, opts?: { signal?: AbortSignal }) => {
  const json = await requestJsonOrThrow<{ data?: Recipe }>({
    url: `/api/recipes/${encodeURIComponent(slug)}`,
    method: "GET",
    headers: { "Cache-Control": "no-store" },
    signal: opts?.signal,
  });

  return unwrapData(json);
};

/**
 * Creates a new recipe.
 *
 * @param {CreateRecipePayload} payload Create payload.
 * @returns {Promise<import('@/types/recipes').Recipe>} Created recipe.
 */
export const createRecipe = async (payload: CreateRecipePayload) => {
  const json = await requestJsonOrThrow<{ data?: Recipe }>({
    url: "/api/recipes",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: payload,
  });

  return unwrapData(json);
};

/**
 * Updates an existing recipe (partial update).
 *
 * @param {string} slug Recipe slug.
 * @param {UpdateRecipePayload} patch Partial update.
 * @returns {Promise<import('@/types/recipes').Recipe>} Updated recipe.
 */
export const updateRecipe = async (slug: string, patch: UpdateRecipePayload) => {
  const json = await requestJsonOrThrow<{ data?: Recipe }>({
    url: `/api/recipes/${encodeURIComponent(slug)}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: patch,
  });

  return unwrapData(json);
};

/**
 * Deletes a recipe by slug.
 *
 * @param {string} slug Recipe slug.
 * @returns {Promise<void>} Resolves when deleted.
 */
export const deleteRecipe = async (slug: string) => {
  await requestVoidOrThrow({
    url: `/api/recipes/${encodeURIComponent(slug)}`,
    method: "DELETE",
  });
};
