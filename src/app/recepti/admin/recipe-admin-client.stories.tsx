import type { Meta, StoryObj } from "@storybook/react";
import RecipeAdminClient from "./recipe-admin-client";
import { demoRecipes } from "@/stories/recipes.fixtures";

const meta = {
  title: "Pages/Admin/RecipeAdminClient",
  component: RecipeAdminClient,
  args: {
    initialRecipes: demoRecipes,
  },
  parameters: {
    nextjs: {
      pathname: "/recepti/admin",
    },
  },
} satisfies Meta<typeof RecipeAdminClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
