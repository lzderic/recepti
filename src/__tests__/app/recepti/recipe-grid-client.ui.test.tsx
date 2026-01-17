// @vitest-environment jsdom

/**
 * @file UI tests for the recipe grid client.
 */

import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import type { RecipeListItem } from "@/types/recipes";
import RecipeGridClient from "@/app/recepti/recipe-grid-client";
import { renderWithStore } from "@/test-utils/render";

const recipes: RecipeListItem[] = [
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
  {
    id: "2",
    slug: "domaci-kruh",
    title: "Domaći kruh",
    lead: "Klasik.",
    prepTimeMinutes: 180,
    difficulty: "MEDIUM",
    dishGroup: "BREAD",
    cookingMethod: "BAKE",
    imageCdnPath: "/cdn/recipes/domaci-kruh/hero.svg",
  },
];

describe("RecipeGridClient (ui)", () => {
  it("filters recipes based on store query", () => {
    renderWithStore(<RecipeGridClient initialRecipes={recipes} />, {
      preloadedUi: { recipeQuery: "muffini" },
    });

    expect(screen.getByText(/Prikazano:/)).toHaveTextContent("Prikazano: 1");
    expect(screen.getByText("Čokoladni muffini")).toBeInTheDocument();
    expect(screen.queryByText("Domaći kruh")).not.toBeInTheDocument();
  });

  it("renders localized labels", () => {
    renderWithStore(<RecipeGridClient initialRecipes={recipes} />);

    expect(screen.getByText("Deserti")).toBeInTheDocument();
    expect(screen.getByText("Jednostavno")).toBeInTheDocument();
  });
});
