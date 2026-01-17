// @vitest-environment jsdom

/**
 * @file UI tests for the sidebar.
 */

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Sidebar from "@/components/layout/sidebar";
import { STRINGS } from "@/shared/strings";

let currentPathname = "/recepti";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

describe("Sidebar (ui)", () => {
  it("renders disabled items as non-links", () => {
    currentPathname = "/recepti";
    render(<Sidebar />);

    const homeLabel = screen.getByText(STRINGS.nav.main.home);
    expect(homeLabel.closest("a")).toBeNull();
    expect(homeLabel.closest("div[aria-disabled]"))?.toBeTruthy();
  });

  it("highlights Recipes when on /recepti", () => {
    currentPathname = "/recepti";
    render(<Sidebar />);

    const recipesLink = screen.getByRole("link", { name: STRINGS.pages.recipes.title });
    expect(recipesLink).toHaveClass("bg-red-50");

    const adminLink = screen.getByRole("link", { name: STRINGS.nav.admin });
    expect(adminLink).not.toHaveClass("bg-red-50");
  });

  it("highlights Admin when on /recepti/admin", () => {
    currentPathname = "/recepti/admin";
    render(<Sidebar />);

    const recipesLink = screen.getByRole("link", { name: STRINGS.pages.recipes.title });
    expect(recipesLink).not.toHaveClass("bg-red-50");

    const adminLink = screen.getByRole("link", { name: STRINGS.nav.admin });
    expect(adminLink).toHaveClass("bg-red-50");
  });
});
