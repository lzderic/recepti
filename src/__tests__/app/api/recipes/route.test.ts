/**
 * @file Tests for the recipes collection API route.
 */

import { describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import type { Recipe } from "@/types/recipes";

vi.mock("@/lib/server/recipes/repo", () => {
  return {
    listRecipes: vi.fn(),
    createRecipe: vi.fn(),
  };
});

import { POST, GET } from "@/app/api/recipes/route";
import { createRecipe, listRecipes } from "@/lib/server/recipes/repo";

describe("/api/recipes route", () => {
  it("GET returns {data} from repo", async () => {
    vi.mocked(listRecipes).mockResolvedValueOnce([
      {
        id: "1",
        slug: "a",
        title: "A",
        lead: "Lead lead lead",
        prepTimeMinutes: 10,
        difficulty: "EASY",
        dishGroup: "MAIN",
        cookingMethod: "NO_COOK",
        imageCdnPath: "/recipes/a/hero.jpg",
      },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(json.data).toHaveLength(1);
  });

  it("POST validates input and returns 400 on invalid payload", async () => {
    const req = new Request("http://localhost/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "x" }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error");
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST returns 201 and created recipe", async () => {
    vi.mocked(createRecipe).mockResolvedValueOnce({
      id: "1",
      slug: "test-recept",
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
      imageCdnPath: "/recipes/test-recept/hero.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } satisfies Recipe);

    const req = new Request("http://localhost/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
        imageCdnPath: "/recipes/test-recept/hero.jpg",
      }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data.slug).toBe("test-recept");
  });
});
