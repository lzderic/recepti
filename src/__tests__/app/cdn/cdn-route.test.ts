/**
 * @file Tests for the local CDN route handler.
 */

import { describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", () => {
  return {
    default: {
      stat: vi.fn(),
      readFile: vi.fn(),
    },
    stat: vi.fn(),
    readFile: vi.fn(),
  };
});

import fs from "node:fs/promises";
import { GET } from "@/app/cdn/[...path]/route";

describe("/cdn/* route", () => {
  it("returns Cache-Control and ETag", async () => {
    vi.mocked(fs.stat).mockResolvedValueOnce({ size: 3, mtimeMs: 1000 } as never);
    vi.mocked(fs.readFile).mockResolvedValueOnce(Buffer.from([1, 2, 3]) as never);

    const req = new Request("http://localhost/cdn/recipes/x/hero.webp");
    const res = await GET(req as never, {
      params: Promise.resolve({ path: ["recipes", "x", "hero.webp"] }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBeTruthy();
    expect(res.headers.get("etag")).toBeTruthy();
    expect(res.headers.get("last-modified")).toBeTruthy();
  });

  it("returns 304 when If-None-Match matches", async () => {
    vi.mocked(fs.stat).mockResolvedValueOnce({ size: 3, mtimeMs: 1000 } as never);
    vi.mocked(fs.readFile).mockResolvedValueOnce(Buffer.from([1, 2, 3]) as never);

    const etag = 'W/"3-1000"';
    const req = new Request("http://localhost/cdn/recipes/x/hero.webp", {
      headers: { "If-None-Match": etag },
    });

    const res = await GET(req as never, {
      params: Promise.resolve({ path: ["recipes", "x", "hero.webp"] }),
    });

    expect(res.status).toBe(304);
    expect(res.headers.get("etag")).toBe(etag);
  });
});
