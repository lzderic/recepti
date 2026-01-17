/**
 * @file Tests for the client-side recipes service.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJsonOrThrowMock = vi.fn();
const requestVoidOrThrowMock = vi.fn();

vi.mock("@/lib/http/axios", () => ({
  requestJsonOrThrow: (cfg: unknown) => requestJsonOrThrowMock(cfg),
  requestVoidOrThrow: (cfg: unknown) => requestVoidOrThrowMock(cfg),
}));

import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  listRecipes,
  updateRecipe,
  type CreateRecipePayload,
} from "@/services/recipes.client";

describe("recipes.client", () => {
  beforeEach(() => {
    requestJsonOrThrowMock.mockReset();
    requestVoidOrThrowMock.mockReset();
  });

  it("listRecipes calls /api/recipes and returns array", async () => {
    requestJsonOrThrowMock.mockResolvedValue({ data: [] });
    const data = await listRecipes();
    expect(Array.isArray(data)).toBe(true);
    expect(requestJsonOrThrowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/recipes",
        method: "GET",
        headers: { "Cache-Control": "no-store" },
      }),
    );
  });

  it("listRecipes throws on unexpected response", async () => {
    requestJsonOrThrowMock.mockResolvedValue({ data: null });
    await expect(listRecipes()).rejects.toThrow(/Unexpected API response/);
  });

  it("getRecipe encodes slug", async () => {
    requestJsonOrThrowMock.mockResolvedValue({
      data: {
        id: "1",
        slug: "a b",
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
      },
    });

    await getRecipe("a b");
    expect(requestJsonOrThrowMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/api/recipes/a%20b", method: "GET" }),
    );
  });

  it("createRecipe sends JSON", async () => {
    const payload = {
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
    } satisfies CreateRecipePayload;

    requestJsonOrThrowMock.mockResolvedValue({ data: { ...payload, id: "1", slug: "x" } });
    await createRecipe(payload);
    expect(requestJsonOrThrowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/recipes",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: payload,
      }),
    );
  });

  it("updateRecipe targets /api/recipes/:slug", async () => {
    requestJsonOrThrowMock.mockResolvedValue({ data: { id: "1" } });
    await updateRecipe("x", { lead: "new" });
    expect(requestJsonOrThrowMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/api/recipes/x", method: "PUT" }),
    );
  });

  it("deleteRecipe issues DELETE", async () => {
    requestVoidOrThrowMock.mockResolvedValue(undefined);
    await deleteRecipe("x");
    expect(requestVoidOrThrowMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/api/recipes/x", method: "DELETE" }),
    );
  });
});
