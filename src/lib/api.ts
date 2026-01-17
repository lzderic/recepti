/**
 * @file Server-only API re-exports.
 */

import "server-only";

/**
 * Server-only API surface (re-export) intended for server components.
 */
export { getRecipe, getRecipes } from "@/services/recipes.server";
