/**
 * @file Tests for the server-side recipes service.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Recipe, RecipeListItem } from "@/types/recipes";

const listRecipesMock = vi.fn<() => Promise<RecipeListItem[]>>();
const getRecipeBySlugMock = vi.fn<(slug: string) => Promise<Recipe | null>>();

vi.mock("@/lib/server/recipes/repo", () => ({
  listRecipes: () => listRecipesMock(),
  getRecipeBySlug: (slug: string) => getRecipeBySlugMock(slug),
}));

import { getRecipe, getRecipes } from "@/services/recipes.server";

describe("recipes.server", () => {
  beforeEach(() => {
    listRecipesMock.mockReset();
    getRecipeBySlugMock.mockReset();
  });

  it("getRecipes returns listRecipes()", async () => {
    listRecipesMock.mockResolvedValue([
      {
        id: "1",
        slug: "x",
        title: "T",
        lead: "L",
        prepTimeMinutes: 10,
        difficulty: "EASY",
        dishGroup: "MAIN",
        cookingMethod: "BAKE",
        imageCdnPath: "/recipes/x/hero.svg",
        images: undefined,
      },
    ]);

    await expect(getRecipes()).resolves.toHaveLength(1);
  });

  it("getRecipe returns recipe when found", async () => {
    getRecipeBySlugMock.mockResolvedValue({
      id: "1",
      slug: "x",
      title: "T",
      lead: "L",
      prepTimeMinutes: 10,
      servings: 2,
      difficulty: "EASY",
      dishGroup: "MAIN",
      cookingMethod: "BAKE",
      tags: [],
      ingredients: [],
      steps: [],
      imageCdnPath: "/recipes/x/hero.svg",
      images: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const recipe = await getRecipe("x");
    expect(recipe.slug).toBe("x");
  });

  it("getRecipe throws NOT_FOUND when missing", async () => {
    getRecipeBySlugMock.mockResolvedValue(null);
    await expect(getRecipe("missing")).rejects.toThrow("NOT_FOUND");
  });
});
