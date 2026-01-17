/**
 * @file Redux store configuration.
 */

import { configureStore, type PreloadedState } from "@reduxjs/toolkit";
import { uiReducer, type UiState } from "./uiSlice";

type StateShape = {
  ui: UiState;
};

/**
 * Creates a new store instance (useful for tests / Storybook isolation).
 */
export const makeStore = (preloadedState?: PreloadedState<StateShape>) =>
  configureStore({
    reducer: {
      ui: uiReducer,
    },
    preloadedState,
  });

/**
 * Application store type.
 */
export type AppStore = ReturnType<typeof makeStore>;

/**
 * Application Redux store.
 */
export const store = makeStore();

/**
 * Root state type derived from the store.
 */
export type RootState = ReturnType<AppStore["getState"]>;

/**
 * Dispatch type derived from the store.
 */
export type AppDispatch = AppStore["dispatch"];
