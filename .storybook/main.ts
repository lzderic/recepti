import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import { resolve } from "node:path";

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (baseConfig) => {
    return mergeConfig(baseConfig, {
      publicDir: resolve(__dirname, "../public"),
      resolve: {
        alias: {
          "@": resolve(__dirname, "../src"),
          "next/navigation": resolve(__dirname, "./mocks/next-navigation.ts"),
          "next/link": resolve(__dirname, "./mocks/next-link.tsx"),
          "next/image": resolve(__dirname, "./mocks/next-image.tsx"),
        },
      },
    });
  },
};

export default config;
