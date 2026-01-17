/**
 * @file Test helpers for Redux store setup.
 */

import { configureStore } from "@reduxjs/toolkit";

import { uiReducer, type UiState } from "@/store/uiSlice";

/**
 * Creates a Redux store instance for tests.
 *
 * @param {Partial<UiState>} [preloadedUi] Optional UI slice overrides.
 * @returns {ReturnType<typeof configureStore>} Configured Redux store.
 */
export const makeStore = (preloadedUi?: Partial<UiState>) =>
  configureStore({
    reducer: { ui: uiReducer },
    preloadedState: {
      ui: {
        recipeQuery: "",
        difficulty: null,
        dishGroup: null,
        cookingMethod: null,
        ...preloadedUi,
      },
    },
  });

/**
 * Store type returned by `makeStore`.
 */
export type AppStore = ReturnType<typeof makeStore>;

/**
 * Root state type for test store.
 */
export type RootState = ReturnType<AppStore["getState"]>;

/**
 * Dispatch type for test store.
 */
export type AppDispatch = AppStore["dispatch"];
