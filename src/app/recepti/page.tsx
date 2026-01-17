/**
 * @file Recipes listing page.
 */

import type { Metadata } from "next";
import { getRecipes } from "@/services/recipes.server";
import RecipeGridClient from "./recipe-grid-client";
import { STRINGS } from "@/shared/strings";

/**
 * Always render dynamically (no caching) for this page.
 */
export const dynamic = "force-dynamic";

/**
 * Page-level metadata.
 */
export const metadata: Metadata = {
  title: STRINGS.pages.recipes.title,
  description: STRINGS.pages.recipes.description,
};

const RecipesPage = async () => {
  const recipes = await getRecipes();

  return (
    <section className="pt-14 sm:pt-16 space-y-6">
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
            {STRINGS.pages.recipes.title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
            {STRINGS.pages.recipes.intro}
          </p>
        </div>

        <div className="h-px w-full bg-zinc-200" />
      </header>

      <RecipeGridClient initialRecipes={recipes} />
    </section>
  );
};

export default RecipesPage;
