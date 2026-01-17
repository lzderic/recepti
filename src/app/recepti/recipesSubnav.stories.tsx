import type { Meta, StoryObj } from "@storybook/react";
import RecipesSubnav from "./recipesSubnav";

const meta = {
  title: "Pages/Recepti/RecipesSubnav",
  component: RecipesSubnav,
  parameters: {
    nextjs: {
      pathname: "/recepti/novi",
    },
  },
} satisfies Meta<typeof RecipesSubnav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
