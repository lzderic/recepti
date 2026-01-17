/**
 * @file Tests for Axios wrappers.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const requestMock = vi.fn();
const createMock = vi.fn(() => ({ request: requestMock }));

vi.mock("axios", () => ({
  default: {
    create: createMock,
  },
}));

vi.mock("@/lib/http/api-error", () => ({
  prettyApiError: (status: number, body: unknown) => `ERR:${status}:${JSON.stringify(body)}`,
}));

describe("http/axios wrapper", async () => {
  const mod = await import("@/lib/http/axios");

  beforeEach(() => {
    requestMock.mockReset();
  });

  it("requestJsonOrThrow returns parsed body on 2xx", async () => {
    requestMock.mockResolvedValue({ status: 200, data: { ok: true } });

    const res = await mod.requestJsonOrThrow<{ ok: boolean }>({ url: "/x", method: "GET" });
    expect(res).toEqual({ ok: true });

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/x",
        method: "GET",
        validateStatus: expect.any(Function),
      }),
    );

    const [config] = requestMock.mock.calls[0] ?? [];
    expect(config.validateStatus(500)).toBe(true);
  });

  it("requestJsonOrThrow normalizes empty string to null", async () => {
    requestMock.mockResolvedValue({ status: 200, data: "" });

    const res = await mod.requestJsonOrThrow<null>({ url: "/x", method: "GET" });
    expect(res).toBeNull();
  });

  it("requestJsonOrThrow throws on non-2xx", async () => {
    requestMock.mockResolvedValue({ status: 400, data: { a: 1 } });

    await expect(mod.requestJsonOrThrow({ url: "/x", method: "GET" })).rejects.toThrow(
      'ERR:400:{"a":1}',
    );
  });

  it("requestVoidOrThrow accepts 200/204 by default", async () => {
    requestMock.mockResolvedValueOnce({ status: 204, data: "" });
    await expect(mod.requestVoidOrThrow({ url: "/x", method: "DELETE" })).resolves.toBeUndefined();

    const [config204] = requestMock.mock.calls[0] ?? [];
    expect(config204.validateStatus(500)).toBe(true);

    requestMock.mockResolvedValueOnce({ status: 200, data: null });
    await expect(mod.requestVoidOrThrow({ url: "/x", method: "DELETE" })).resolves.toBeUndefined();

    const [config200] = requestMock.mock.calls[1] ?? [];
    expect(config200.validateStatus(500)).toBe(true);
  });

  it("requestVoidOrThrow supports custom okStatus", async () => {
    requestMock.mockResolvedValueOnce({ status: 201, data: null });
    await expect(
      mod.requestVoidOrThrow({ url: "/x", method: "POST" }, { okStatus: 201 }),
    ).resolves.toBeUndefined();

    requestMock.mockResolvedValueOnce({ status: 201, data: null });
    await expect(
      mod.requestVoidOrThrow({ url: "/x", method: "POST" }, { okStatus: [200, 201] }),
    ).resolves.toBeUndefined();
  });

  it("requestVoidOrThrow throws when status not allowed", async () => {
    requestMock.mockResolvedValue({ status: 500, data: undefined });

    await expect(mod.requestVoidOrThrow({ url: "/x", method: "DELETE" })).rejects.toThrow(
      "ERR:500:null",
    );
  });
});
