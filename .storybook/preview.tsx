import type { Preview } from "@storybook/react";
import React from "react";
import "../src/styles/globals.css";
import { AppProviders } from "../src/app/providers";
import { makeStore } from "../src/store/store";
import type { UiState } from "../src/store/uiSlice";
import { __setPathname } from "./mocks/next-navigation.ts";

type ReduxStoryState = Partial<UiState>;

const preview: Preview = {
  decorators: [
    (Story, ctx) => {
      __setPathname(ctx.parameters.nextjs?.pathname ?? "/");
      const initialUi: UiState = {
        recipeQuery: "",
        difficulty: null,
        dishGroup: null,
        cookingMethod: null,
      };

      const store = makeStore({
        ui: {
          ...initialUi,
          ...(ctx.parameters.redux as ReduxStoryState | undefined),
        },
      });

      return (
        <AppProviders store={store}>
          <div className="min-h-dvh bg-zinc-50 text-zinc-900">
            <div className="p-6">
              <Story />
            </div>
          </div>
        </AppProviders>
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true },
    layout: "fullscreen",
  },
};

export default preview;
