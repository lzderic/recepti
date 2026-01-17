/**
 * @file Tests for image helper utilities.
 */

import { describe, expect, it } from "vitest";

import { isSvg, shouldUnoptimizeImage } from "@/lib/images";

describe("image utils", () => {
  it("detects svg extension case-insensitively", () => {
    expect(isSvg("/a/b/c.svg")).toBe(true);
    expect(isSvg("/a/b/c.SVG")).toBe(true);
    expect(isSvg("/a/b/c.png")).toBe(false);
  });

  it("decides whether to unoptimize based on any svg", () => {
    expect(shouldUnoptimizeImage(["/x.png", "/y.jpg"])).toBe(false);
    expect(shouldUnoptimizeImage(["/x.png", "/y.svg"])).toBe(true);
    expect(shouldUnoptimizeImage([null, undefined, "  "])).toBe(false);
  });
});
