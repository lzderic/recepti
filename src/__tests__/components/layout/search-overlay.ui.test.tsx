// @vitest-environment jsdom

/**
 * @file UI tests for the search overlay.
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RecipeListItem } from "@/types/recipes";
import SearchOverlay from "@/components/layout/search-overlay";
import { renderWithStore } from "@/test-utils/render";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const listRecipesMock = vi.fn<() => Promise<RecipeListItem[]>>();

vi.mock("@/services/recipes.client", () => ({
  listRecipes: () => listRecipesMock(),
}));

describe("SearchOverlay (ui)", () => {
  beforeEach(() => {
    pushMock.mockReset();
    listRecipesMock.mockReset();

    // jsdom often reports clientWidth=0; SearchOverlay uses it preferentially over window.innerWidth.
    Object.defineProperty(document.documentElement, "clientWidth", {
      value: 1024,
      configurable: true,
    });
  });

  it("loads and shows results, then navigates on click", async () => {
    const onClose = vi.fn();

    listRecipesMock.mockResolvedValue([
      {
        id: "1",
        slug: "cokoladni-muffini",
        title: "Čokoladni muffini",
        lead: "Brzo i fino.",
        prepTimeMinutes: 25,
        difficulty: "EASY",
        dishGroup: "DESSERT",
        cookingMethod: "BAKE",
        imageCdnPath: "/cdn/recipes/cokoladni-muffini/hero.jpg",
      },
    ]);

    renderWithStore(
      <SearchOverlay
        open
        onClose={onClose}
        anchorRect={new DOMRect(0, 0, 120, 40)}
        snapLeft={null}
      />,
      { preloadedUi: { recipeQuery: "muf" } },
    );

    expect(await screen.findByText("Čokoladni muffini")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Čokoladni muffini/i }));
    expect(pushMock).toHaveBeenCalledWith("/recepti/cokoladni-muffini");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();

    listRecipesMock.mockResolvedValue([]);

    renderWithStore(
      <SearchOverlay
        open
        onClose={onClose}
        anchorRect={new DOMRect(0, 0, 120, 40)}
        snapLeft={null}
      />,
      { preloadedUi: { recipeQuery: "x" } },
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
