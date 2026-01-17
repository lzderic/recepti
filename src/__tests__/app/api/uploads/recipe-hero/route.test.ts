/**
 * @file Tests for the recipe hero upload API route.
 */

import { describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", () => {
  return {
    default: {
      mkdir: vi.fn(async () => undefined),
      writeFile: vi.fn(async () => undefined),
    },
    mkdir: vi.fn(async () => undefined),
    writeFile: vi.fn(async () => undefined),
  };
});

import { POST } from "@/app/api/uploads/recipe-hero/route";

describe("/api/uploads/recipe-hero", () => {
  it("returns 400 if slug is missing", async () => {
    const form = new FormData();
    form.set("file", new File(["x"], "hero.png", { type: "image/png" }));

    const req = new Request("http://localhost/api/uploads/recipe-hero", {
      method: "POST",
      body: form,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty("error");
  });

  it("uploads hero and returns cdnPath", async () => {
    const form = new FormData();
    form.set("slug", "moj-recept");
    form.set("file", new File(["fake"], "hero.webp", { type: "image/webp" }));

    const req = new Request("http://localhost/api/uploads/recipe-hero", {
      method: "POST",
      body: form,
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toHaveProperty("data.cdnPath");
    expect(json.data.cdnPath).toMatch(/^\/recipes\/moj-recept\/hero\.[a-f0-9]{12}\.webp$/);
  });
});
