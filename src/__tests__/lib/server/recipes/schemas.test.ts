/**
 * @file Tests for recipe payload schemas.
 */

import { describe, expect, it, vi } from "vitest";
import { createRecipeSchema, updateRecipeSchema } from "@/lib/server/recipes/schemas";

const validCreate = {
  title: "Test recept",
  lead: "Ovo je validan lead opis.",
  prepTimeMinutes: 15,
  servings: 2,
  difficulty: "EASY",
  dishGroup: "MAIN",
  cookingMethod: "NO_COOK",
  tags: ["test"],
  ingredients: [{ name: "tuna", amount: 1, unit: "konz" }],
  steps: [{ text: "Sve pomiješaj." }],
  imageCdnPath: "/recipes/test/hero.jpg",
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
  default: {},
}));

describe("recipes schemas", () => {
  it("createRecipeSchema accepts a valid payload", () => {
    const parsed = createRecipeSchema.safeParse(validCreate);
    expect(parsed.success).toBe(true);
  });

  it("createRecipeSchema rejects missing required fields", () => {
    const parsed = createRecipeSchema.safeParse({ title: "x" });
    expect(parsed.success).toBe(false);
  });

  it("updateRecipeSchema allows partial updates", () => {
    const parsed = updateRecipeSchema.safeParse({ lead: "Ovo je novi lead." });
    expect(parsed.success).toBe(true);
  });
});
