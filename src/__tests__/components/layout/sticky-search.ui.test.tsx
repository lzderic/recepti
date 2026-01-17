// @vitest-environment jsdom

/**
 * @file UI tests for the sticky search component.
 */

import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StickySearch from "@/components/layout/sticky-search";
import { STRINGS } from "@/shared/strings";
import { renderWithStore } from "@/test-utils/render";

describe("StickySearch (ui)", () => {
  it("writes into the Redux recipeQuery", async () => {
    const user = userEvent.setup();

    const { store } = renderWithStore(<StickySearch />, { preloadedUi: { recipeQuery: "" } });

    const input = screen.getByLabelText(STRINGS.searchOverlay.aria.searchInput) as HTMLInputElement;
    await user.type(input, "muf");

    expect(store.getState().ui.recipeQuery).toBe("muf");
    expect(input.value).toBe("muf");
  });
});
