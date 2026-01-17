// @vitest-environment jsdom

/**
 * @file UI tests for the site header.
 */

import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import SiteHeader from "@/components/layout/site-header";
import { STRINGS } from "@/shared/strings";
import { renderWithStore } from "@/test-utils/render";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("SiteHeader (ui)", () => {
  it("opens SearchOverlay on focus and restores scroll on close", async () => {
    const { store } = renderWithStore(<SiteHeader />, { preloadedUi: { recipeQuery: "pizza" } });

    const input = screen.getByLabelText(STRINGS.searchOverlay.aria.searchInput) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.value).toBe("pizza");

    fireEvent.focus(input);

    expect(
      await screen.findByRole("dialog", { name: STRINGS.searchOverlay.aria.dialog }),
    ).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: STRINGS.searchOverlay.aria.closeButton }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: STRINGS.searchOverlay.aria.dialog }),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
      expect(store.getState().ui.recipeQuery).toBe("");
    });
  });
});
