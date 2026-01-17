/**
 * @file Tests for runtime environment validation.
 */

import { describe, expect, it } from "vitest";

import { getEnv } from "@/env";

describe("getEnv", () => {
  it("returns an object when vars are unset", () => {
    const prevNext = process.env.NEXT_PUBLIC_CDN_BASE_URL;
    const prevCdn = process.env.CDN_BASE_URL;

    delete process.env.NEXT_PUBLIC_CDN_BASE_URL;
    delete process.env.CDN_BASE_URL;

    const env = getEnv();
    expect(env).toEqual({});

    if (typeof prevNext === "string") process.env.NEXT_PUBLIC_CDN_BASE_URL = prevNext;
    if (typeof prevCdn === "string") process.env.CDN_BASE_URL = prevCdn;
  });

  it("throws when a value is present but empty", () => {
    const prev = process.env.NEXT_PUBLIC_CDN_BASE_URL;
    process.env.NEXT_PUBLIC_CDN_BASE_URL = "";

    expect(() => getEnv()).toThrow(/Invalid environment variables/i);

    if (typeof prev === "string") process.env.NEXT_PUBLIC_CDN_BASE_URL = prev;
    else delete process.env.NEXT_PUBLIC_CDN_BASE_URL;
  });
});
