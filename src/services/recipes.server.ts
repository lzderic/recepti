/**
 * @file Server-side recipes accessors.
 */

import "server-only";

import { getRecipeBySlug, listRecipes } from "@/lib/server/recipes/repo";

/**
 * Server-side list of recipes.
 *
 * @returns {Promise<import("@/types/recipes").RecipeListItem[]>} Recipes list.
 */
export const getRecipes = async () => {
  return listRecipes();
};

/**
 * Server-side recipe lookup.
 *
 * @param {string} slug Recipe slug.
 * @returns {Promise<import("@/types/recipes").Recipe>} Recipe.
 * @throws {Error} Error with message `"NOT_FOUND"` when the recipe does not exist.
 */
export const getRecipe = async (slug: string) => {
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) throw new Error("NOT_FOUND");
  return recipe;
};
