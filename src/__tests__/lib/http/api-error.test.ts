/**
 * @file Tests for API error helpers.
 */

import { describe, expect, it } from "vitest";

import { isApiErrorBody, prettyApiError } from "@/lib/http/api-error";

describe("api-error", () => {
  describe("isApiErrorBody", () => {
    it("returns true for valid error shape", () => {
      expect(
        isApiErrorBody({
          error: { code: "NOT_FOUND", message: "Missing" },
        }),
      ).toBe(true);
    });

    it("returns false for null/invalid shapes", () => {
      expect(isApiErrorBody(null)).toBe(false);
      expect(isApiErrorBody({})).toBe(false);
      expect(isApiErrorBody({ error: {} })).toBe(false);
      expect(isApiErrorBody({ error: { code: 123, message: "x" } })).toBe(false);
      expect(isApiErrorBody({ error: { code: "NOT_FOUND", message: 123 } })).toBe(false);
    });
  });

  describe("prettyApiError", () => {
    it("formats ApiErrorBody", () => {
      const msg = prettyApiError(404, { error: { code: "NOT_FOUND", message: "Nope" } });
      expect(msg).toBe("404 NOT_FOUND: Nope");
    });

    it("formats string body", () => {
      expect(prettyApiError(400, "Bad")).toBe("400: Bad");
    });

    it("falls back for unknown body", () => {
      expect(prettyApiError(500, { a: 1 })).toBe("500: Unexpected error");
    });
  });
});
