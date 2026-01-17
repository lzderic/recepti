import type { Meta, StoryObj } from "@storybook/react";
import StickySearch from "./sticky-search";

const meta = {
  title: "Layout/StickySearch",
  component: StickySearch,
} satisfies Meta<typeof StickySearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithQuery: Story = {
  parameters: {
    redux: {
      recipeQuery: "pala",
    },
  },
};
