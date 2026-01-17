/**
 * @file Tests for recipe CDN folder cleanup helpers.
 */

import path from "node:path";

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const rmMock = vi.fn();

vi.mock("node:fs/promises", () => ({
  default: {
    rm: rmMock,
  },
}));

describe("cdn-files", async () => {
  const cwdSpy = vi.spyOn(process, "cwd").mockReturnValue("C:/app");
  const mod = await import("@/lib/server/recipes/cdn-files");

  afterAll(() => {
    cwdSpy.mockRestore();
  });

  beforeEach(() => {
    rmMock.mockReset();
  });

  it("does nothing for invalid slug", async () => {
    await expect(mod.deleteRecipeCdnFolder("../oops")).resolves.toBeUndefined();
    await expect(mod.deleteRecipeCdnFolder("UPPER")).resolves.toBeUndefined();
    expect(rmMock).not.toHaveBeenCalled();
  });

  it("deletes the recipe folder for a valid slug", async () => {
    const slug = "cokoladni-muffini";

    await expect(mod.deleteRecipeCdnFolder(slug)).resolves.toBeUndefined();

    const root = path.resolve(process.cwd(), "public", "cdn", "recipes");
    const absDir = path.resolve(root, slug);

    expect(rmMock).toHaveBeenCalledWith(absDir, { recursive: true, force: true });
  });

  it("swallows fs errors (best-effort cleanup)", async () => {
    rmMock.mockRejectedValueOnce(new Error("EACCES"));
    await expect(mod.deleteRecipeCdnFolder("palacinke")).resolves.toBeUndefined();
  });
});
