/**
 * @file Tests for slug helpers.
 */

import { describe, expect, it } from "vitest";
import { makeSlug } from "@/lib/server/slug";

describe("makeSlug", () => {
  it("slugifies Croatian-ish input to a stable lower/strict slug", () => {
    expect(makeSlug("Čokoladni Muffini!!")).toBe("cokoladni-muffini");
  });
});
