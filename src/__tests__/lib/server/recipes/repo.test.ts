/**
 * @file Tests for the server recipes repository.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CookingMethod, Difficulty, DishGroup, Prisma } from "@prisma/client";

type PrismaRecipeDelegate = {
  findMany: ReturnType<typeof vi.fn>;
  findUnique: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const prismaRecipe: PrismaRecipeDelegate = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/lib/server/db", () => ({
  prisma: {
    recipe: prismaRecipe,
  },
}));

const accessMock = vi.fn();
vi.mock("node:fs/promises", () => ({
  default: {
    access: accessMock,
  },
}));

vi.mock("@/lib/server/slug", () => ({
  makeSlug: (s: string) => s.toLowerCase().replace(/\s+/g, "-"),
}));

describe("recipes repo", () => {
  const cwdSpy = vi.spyOn(process, "cwd").mockReturnValue("C:/app");

  beforeEach(() => {
    prismaRecipe.findMany.mockReset();
    prismaRecipe.findUnique.mockReset();
    prismaRecipe.create.mockReset();
    prismaRecipe.update.mockReset();
    prismaRecipe.delete.mockReset();
    accessMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Ensure module-level caches are reset between tests.
    vi.resetModules();
  });

  afterEach(() => {
    // keep spy active for all tests
    void cwdSpy;
  });

  it("getRecipeBySlug returns null when missing", async () => {
    prismaRecipe.findUnique.mockResolvedValueOnce(null);

    const { getRecipeBySlug } = await import("@/lib/server/recipes/repo");
    await expect(getRecipeBySlug("nope")).resolves.toBeNull();
  });

  it("createRecipe generates a unique slug and backfills images.hero.cdnPath", async () => {
    prismaRecipe.findUnique
      .mockResolvedValueOnce({ id: "x" }) // slug exists
      .mockResolvedValueOnce(null); // slug-2 available

    prismaRecipe.create.mockImplementationOnce(
      async ({ data }: { data: Record<string, unknown> }) => {
        const d = data as {
          slug: string;
          title: string;
          lead: string;
          prepTimeMinutes: number;
          servings: number;
          difficulty: Difficulty;
          dishGroup: DishGroup;
          cookingMethod: CookingMethod;
          tags: unknown;
          ingredients: unknown;
          steps: unknown;
          imageCdnPath: string;
          images: unknown;
        };

        return {
          id: "r1",
          slug: d.slug,
          title: d.title,
          lead: d.lead,
          prepTimeMinutes: d.prepTimeMinutes,
          servings: d.servings,
          difficulty: d.difficulty,
          dishGroup: d.dishGroup,
          cookingMethod: d.cookingMethod,
          tags: d.tags,
          ingredients: d.ingredients,
          steps: d.steps,
          imageCdnPath: d.imageCdnPath,
          images: d.images,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-02T00:00:00.000Z"),
        };
      },
    );

    // image exists as-is
    accessMock.mockResolvedValue(undefined);

    const { createRecipe } = await import("@/lib/server/recipes/repo");

    const created = await createRecipe({
      title: "Test Recipe",
      lead: "Lead",
      prepTimeMinutes: 10,
      servings: 2,
      difficulty: "EASY" as Difficulty,
      dishGroup: "MAIN" as DishGroup,
      cookingMethod: "BAKE" as CookingMethod,
      tags: [],
      ingredients: [],
      steps: [],
      imageCdnPath: "/cdn/recipes/test/hero.png",
    });

    expect(prismaRecipe.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "test-recipe-2",
          images: { hero: { cdnPath: "/cdn/recipes/test/hero.png" } },
        }),
      }),
    );

    expect(created.slug).toBe("test-recipe-2");
    expect(created.images?.hero?.cdnPath).toBe("/cdn/recipes/test/hero.png");
  });

  it("listRecipes normalizes hero image extension when original is missing", async () => {
    prismaRecipe.findMany.mockResolvedValueOnce([
      {
        id: "r1",
        slug: "a",
        title: "A",
        lead: "L",
        prepTimeMinutes: 5,
        difficulty: "EASY",
        dishGroup: "MAIN",
        cookingMethod: "BAKE",
        imageCdnPath: "/cdn/recipes/a/hero.png",
        images: null,
      },
    ]);

    // First check for png: missing; then webp: exists
    accessMock.mockImplementation(async (p: string) => {
      const asString = String(p).replace(/\\/g, "/");
      if (asString.endsWith("/public/cdn/cdn/recipes/a/hero.webp")) return;
      throw new Error("ENOENT");
    });

    const { listRecipes } = await import("@/lib/server/recipes/repo");

    const list = await listRecipes();
    expect(list).toHaveLength(1);
    expect(list[0]?.imageCdnPath).toBe("/cdn/recipes/a/hero.webp");
    expect(list[0]?.images?.hero?.cdnPath).toBe("/cdn/recipes/a/hero.webp");
  });

  it("updateRecipe updates images.hero.cdnPath when only imageCdnPath changes", async () => {
    prismaRecipe.findUnique.mockResolvedValueOnce({
      images: { hero: { cdnPath: "/old.webp" }, other: 1 },
      imageCdnPath: "/old.webp",
    });

    prismaRecipe.update.mockImplementationOnce(
      async ({ data }: { data: Record<string, unknown> }) => {
        const d = data as { imageCdnPath?: unknown; images?: unknown };

        const imageCdnPath = (() => {
          const raw = d.imageCdnPath;
          if (typeof raw === "string") return raw;
          if (raw && typeof raw === "object") {
            const set = (raw as { set?: unknown }).set;
            if (typeof set === "string") return set;
          }
          return raw;
        })();

        return {
          id: "r1",
          slug: "a",
          title: "A",
          lead: "L",
          prepTimeMinutes: 5,
          servings: 1,
          difficulty: "EASY",
          dishGroup: "MAIN",
          cookingMethod: "BAKE",
          tags: [],
          ingredients: [],
          steps: [],
          imageCdnPath: imageCdnPath as string,
          images: d.images,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-02T00:00:00.000Z"),
        };
      },
    );

    accessMock.mockResolvedValue(undefined);

    const { updateRecipe } = await import("@/lib/server/recipes/repo");

    await updateRecipe("a", {
      imageCdnPath: { set: "/cdn/recipes/a/new.png" },
    } satisfies Prisma.RecipeUpdateInput);

    expect(prismaRecipe.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: "a" },
        data: expect.objectContaining({
          images: expect.objectContaining({
            hero: expect.objectContaining({ cdnPath: "/cdn/recipes/a/new.png" }),
            other: 1,
          }),
        }),
      }),
    );
  });
});
