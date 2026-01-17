import React from "react";
import { afterEach, beforeEach, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

// Keep Next component rendering lightweight in unit tests.
vi.mock("next/image", () => ({
  default: (props: unknown) => {
    const p = (props ?? {}) as Record<string, unknown>;
    const { ...rest } = p;

    // Strip Next/Image-only props so React doesn't warn about invalid DOM attributes.
    delete (rest as Record<string, unknown>).fill;
    delete (rest as Record<string, unknown>).priority;
    delete (rest as Record<string, unknown>).unoptimized;
    return React.createElement("img", rest as Record<string, unknown>);
  },
}));

vi.mock("next/link", () => ({
  default: (props: unknown) => {
    const p = (props ?? {}) as Record<string, unknown>;
    const { href, children, ...rest } = p;
    return React.createElement(
      "a",
      { href, ...rest } as Record<string, unknown>,
      children as React.ReactNode,
    );
  },
}));

// Only load DOM matchers when running in jsdom.
if (typeof window !== "undefined") {
  await import("@testing-library/jest-dom/vitest");

  const { cleanup } = await import("@testing-library/react");
  afterEach(() => cleanup());
}

beforeEach(() => {
  // Reset env between tests to avoid cross-test leakage.
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  vi.restoreAllMocks();
});
