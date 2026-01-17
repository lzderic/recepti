/**
 * @file Recipes admin page.
 */

import type { Metadata } from "next";
import { getRecipes } from "@/services/recipes.server";
import RecipeAdminClient from "./recipe-admin-client";

/**
 * Always render dynamically (no caching) for this page.
 */
export const dynamic = "force-dynamic";

/**
 * Page-level metadata.
 */
export const metadata: Metadata = {
  title: "Admin — Recepti",
  description: "Interni admin view za testiranje CRUD-a.",
};

const RecipesAdminPage = async () => {
  const recipes = await getRecipes();

  return (
    <section className="pt-14 sm:pt-16 space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
          Admin — Recepti
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-zinc-700 sm:text-base">
          Minimalni UI za testiranje API CRUD operacija (POST/PUT/DELETE).
        </p>
        <div className="h-px w-full bg-zinc-200" />
      </header>

      <RecipeAdminClient initialRecipes={recipes} />
    </section>
  );
};

export default RecipesAdminPage;
