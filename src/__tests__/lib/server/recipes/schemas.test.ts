/**
 * @file Tests for recipe payload schemas.
 */

import { describe, expect, it } from "vitest";
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
