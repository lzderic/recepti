/**
 * @file Tests for the recipe details page.
 */

import { describe, expect, it, vi } from "vitest";

import type { Recipe } from "@/types/recipes";

vi.mock("@/services/recipes.server", () => ({
  getRecipe: vi.fn(),
  getRecipes: vi.fn(),
}));

import { generateMetadata } from "@/app/recepti/[slug]/page";
import { getRecipe } from "@/services/recipes.server";

describe("recepti/[slug] page", () => {
  it("generates metadata from recipe", async () => {
    (getRecipe as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "1",
      slug: "cokoladni-muffini",
      title: "Čokoladni muffini",
      lead: "Brzo i fino.",
      prepTimeMinutes: 25,
      difficulty: "EASY",
      dishGroup: "DESSERT",
      cookingMethod: "BAKE",
      imageCdnPath: "/cdn/recipes/cokoladni-muffini/hero.jpg",
      servings: 4,
      tags: [],
      ingredients: [],
      steps: [],
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-01-15T10:00:00.000Z",
    } satisfies Recipe);

    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "cokoladni-muffini" }),
    });

    expect(meta.title).toBe("Čokoladni muffini");
    expect(meta.description).toBe("Brzo i fino.");
    expect(meta.openGraph?.title).toBe("Čokoladni muffini");
  });
});
