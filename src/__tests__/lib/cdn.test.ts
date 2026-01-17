/**
 * @file Tests for CDN URL building.
 */

import { describe, expect, it } from "vitest";
import { buildCdnUrl } from "@/lib/cdn";

describe("buildCdnUrl", () => {
  it("uses NEXT_PUBLIC_CDN_BASE_URL when set", () => {
    process.env.NEXT_PUBLIC_CDN_BASE_URL = "https://cdn.example.com";

    expect(buildCdnUrl("/recipes/x/hero.jpg")).toBe("https://cdn.example.com/recipes/x/hero.jpg");
  });

  it("falls back to CDN_BASE_URL when NEXT_PUBLIC is not set", () => {
    delete process.env.NEXT_PUBLIC_CDN_BASE_URL;
    process.env.CDN_BASE_URL = "https://cdn.example.com";

    expect(buildCdnUrl("/recipes/x/hero.jpg")).toBe("https://cdn.example.com/recipes/x/hero.jpg");
  });

  it("defaults to same-origin fake CDN route when no base is set", () => {
    delete process.env.NEXT_PUBLIC_CDN_BASE_URL;
    delete process.env.CDN_BASE_URL;

    expect(buildCdnUrl("/recipes/x/hero.jpg")).toBe("/cdn/recipes/x/hero.jpg");
    expect(buildCdnUrl("recipes/x/hero.jpg")).toBe("/cdn/recipes/x/hero.jpg");
  });
});
