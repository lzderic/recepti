/**
 * @file Tests for the single recipe API route.
 */

import { describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import type { Recipe } from "@/types/recipes";

const makeRecipe = (overrides?: Partial<Recipe>): Recipe => {
  return {
    id: "1",
    slug: "x",
    title: "T",
    lead: "Lead opis koji je dovoljno dug.",
    prepTimeMinutes: 10,
    servings: 2,
    difficulty: "EASY",
    dishGroup: "MAIN",
    cookingMethod: "NO_COOK",
    tags: [],
    ingredients: [{ name: "tuna" }],
    steps: [{ text: "Korak" }],
    imageCdnPath: "/recipes/x/hero.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
};

vi.mock("@prisma/client", () => ({
  Difficulty: { EASY: "EASY", MEDIUM: "MEDIUM", HARD: "HARD" },
  DishGroup: {
    MAIN: "MAIN",
    DESSERT: "DESSERT",
    BREAD: "BREAD",
    APPETIZER: "APPETIZER",
    SALAD: "SALAD",
    SOUP: "SOUP",
  },
  CookingMethod: { BAKE: "BAKE", FRY: "FRY", BOIL: "BOIL", GRILL: "GRILL", NO_COOK: "NO_COOK" },
}));

vi.mock("@/lib/server/recipes/repo", () => {
  return {
    getRecipeBySlug: vi.fn(),
    updateRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
  };
});

vi.mock("@/lib/server/recipes/cdn-files", () => {
  return {
    deleteRecipeCdnFolder: vi.fn(),
  };
});

import { DELETE, GET, PUT } from "@/app/api/recipes/[slug]/route";
import { deleteRecipe, getRecipeBySlug, updateRecipe } from "@/lib/server/recipes/repo";
import { deleteRecipeCdnFolder } from "@/lib/server/recipes/cdn-files";

describe("/api/recipes/[slug] route", () => {
  it("GET returns 404 when missing", async () => {
    vi.mocked(getRecipeBySlug).mockResolvedValueOnce(null);

    const res = await GET(new Request("http://localhost/api/recipes/x") as unknown as NextRequest, {
      params: Promise.resolve({ slug: "x" }),
    });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error.code).toBe("NOT_FOUND");
  });

  it("PUT validates payload and returns 400 on invalid", async () => {
    vi.mocked(getRecipeBySlug).mockResolvedValueOnce(makeRecipe());

    const req = new Request("http://localhost/api/recipes/x", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prepTimeMinutes: -1 }),
    });

    const res = await PUT(req as unknown as NextRequest, {
      params: Promise.resolve({ slug: "x" }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("DELETE returns 204 when deleted", async () => {
    vi.mocked(getRecipeBySlug).mockResolvedValueOnce(makeRecipe());
    vi.mocked(deleteRecipe).mockResolvedValueOnce(makeRecipe());

    const res = await DELETE(
      new Request("http://localhost/api/recipes/x") as unknown as NextRequest,
      {
        params: Promise.resolve({ slug: "x" }),
      },
    );

    expect(res.status).toBe(204);
    expect(deleteRecipeCdnFolder).toHaveBeenCalledWith("x");
  });

  it("PUT returns updated recipe", async () => {
    vi.mocked(getRecipeBySlug).mockResolvedValueOnce(makeRecipe());
    vi.mocked(updateRecipe).mockResolvedValueOnce({
      id: "1",
      slug: "x",
      title: "T",
      lead: "Novi lead opis koji je dovoljno dug.",
      prepTimeMinutes: 20,
      servings: 2,
      difficulty: "EASY",
      dishGroup: "MAIN",
      cookingMethod: "NO_COOK",
      tags: [],
      ingredients: [{ name: "tuna" }],
      steps: [{ text: "Ok" }],
      imageCdnPath: "/recipes/x/hero.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } satisfies Recipe);

    const req = new Request("http://localhost/api/recipes/x", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead: "Novi lead opis koji je dovoljno dug.", prepTimeMinutes: 20 }),
    });

    const res = await PUT(req as unknown as NextRequest, {
      params: Promise.resolve({ slug: "x" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.slug).toBe("x");
  });
});
