import type { Meta, StoryObj } from "@storybook/react";
import SearchOverlay from "./search-overlay";

const meta = {
  title: "Layout/SearchOverlay",
  component: SearchOverlay,
  parameters: {
    nextjs: {
      pathname: "/recepti",
    },
  },
} satisfies Meta<typeof SearchOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => undefined,
    anchorRect: new DOMRect(24, 24, 320, 36),
    snapLeft: null,
  },
};
