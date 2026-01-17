import type { Meta, StoryObj } from "@storybook/react";
import RecipeGridClient from "./recipe-grid-client";
import { demoRecipes } from "@/stories/recipes.fixtures";

const meta = {
  title: "Pages/Recepti/RecipeGridClient",
  component: RecipeGridClient,
  args: {
    initialRecipes: demoRecipes,
  },
  parameters: {
    nextjs: {
      pathname: "/recepti",
    },
  },
} satisfies Meta<typeof RecipeGridClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filtered: Story = {
  parameters: {
    redux: {
      recipeQuery: "pala",
    },
  },
};
