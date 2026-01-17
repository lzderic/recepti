import type { Meta, StoryObj } from "@storybook/react";
import { STRINGS } from "@/shared/strings";
import RecipeGridClient from "./recipe-grid-client";
import { demoRecipes } from "@/stories/recipes.fixtures";

const RecipesPageMock = () => {
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

      <RecipeGridClient initialRecipes={demoRecipes} />
    </section>
  );
};

const meta = {
  title: "Pages/Recepti/RecipesPage (Mock)",
  component: RecipesPageMock,
  parameters: {
    nextjs: {
      pathname: "/recepti",
    },
  },
} satisfies Meta<typeof RecipesPageMock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
