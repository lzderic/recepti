/**
 * @file Test helpers for Next.js routing.
 */

import { vi } from "vitest";

/**
 * Minimal Next.js router mock used in unit tests.
 *
 * @param {Partial<{ push: (href: string) => void }>} [overrides] Optional overrides.
 * @returns {{ push: ReturnType<typeof vi.fn> } & Partial<{ push: (href: string) => void }>} Mock router.
 */
export const createMockRouter = (overrides?: Partial<{ push: (href: string) => void }>) => ({
  push: vi.fn(),
  ...overrides,
});
