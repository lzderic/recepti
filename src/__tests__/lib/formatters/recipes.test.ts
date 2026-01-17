/**
 * @file Tests for recipe formatters.
 */

import { describe, expect, it } from "vitest";

import { formatDateHr, formatDifficultyHr, formatDishGroupHr } from "@/lib/formatters/recipes";

describe("recipe formatters", () => {
  it("formats difficulty in Croatian", () => {
    expect(formatDifficultyHr("EASY")).toBe("Jednostavno");
    expect(formatDifficultyHr("MEDIUM")).toBe("Srednje zahtjevno");
    expect(formatDifficultyHr("HARD")).toBe("Složeno");
    expect(formatDifficultyHr("UNKNOWN")).toBe("UNKNOWN");
  });

  it("formats dish group in Croatian", () => {
    expect(formatDishGroupHr("MAIN")).toBe("Glavna jela");
    expect(formatDishGroupHr("DESSERT")).toBe("Deserti");
    expect(formatDishGroupHr("BREAD")).toBe("Kruh i peciva");
    expect(formatDishGroupHr("APPETIZER")).toBe("Predjela");
    expect(formatDishGroupHr("SALAD")).toBe("Salate");
    expect(formatDishGroupHr("SOUP")).toBe("Juhe");
    expect(formatDishGroupHr("UNKNOWN")).toBe("UNKNOWN");
  });

  it("formats hr date or returns empty string", () => {
    const formatted = formatDateHr("2026-01-15T10:00:00.000Z");
    expect(typeof formatted).toBe("string");
    expect(formatDateHr("not-a-date")).toBe("");
  });
});
