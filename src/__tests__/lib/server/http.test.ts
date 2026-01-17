/**
 * @file Tests for server HTTP helpers.
 */

import { describe, expect, it } from "vitest";
import { apiError } from "@/lib/server/http";

describe("apiError", () => {
  it("returns consistent error shape", () => {
    const err = apiError(400, "VALIDATION_ERROR", "Invalid payload", { a: 1 });

    expect(err.status).toBe(400);
    expect(err.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid payload",
        details: { a: 1 },
      },
    });
  });
});
