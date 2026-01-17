/**
 * @file Tests for the client-side uploads service.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const requestJsonOrThrowMock = vi.fn();

vi.mock("@/lib/http/axios", () => ({
  requestJsonOrThrow: (cfg: unknown) => requestJsonOrThrowMock(cfg),
}));

import { uploadRecipeHeroImage } from "@/services/uploads.client";

describe("uploads.client", () => {
  beforeEach(() => {
    requestJsonOrThrowMock.mockReset();
  });

  it("uploads multipart form and returns cdnPath", async () => {
    requestJsonOrThrowMock.mockResolvedValue({ data: { cdnPath: "/recipes/x/hero.webp" } });

    const file = new File([new Uint8Array([1, 2, 3])], "hero.webp", { type: "image/webp" });
    const cdnPath = await uploadRecipeHeroImage("x", file);
    expect(cdnPath).toBe("/recipes/x/hero.webp");

    const cfg = requestJsonOrThrowMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(cfg.url).toBe("/api/uploads/recipe-hero");
    expect(cfg.method).toBe("POST");
    expect(cfg.data).toBeInstanceOf(FormData);

    const form = cfg.data as FormData;
    expect(form.get("slug")).toBe("x");
    expect(form.get("file")).toBeInstanceOf(File);
  });

  it("throws on missing cdnPath", async () => {
    requestJsonOrThrowMock.mockResolvedValue({ data: {} });
    const file = new File([new Uint8Array([1])], "hero.webp", { type: "image/webp" });
    await expect(uploadRecipeHeroImage("x", file)).rejects.toThrow(/Unexpected API response/);
  });
});
