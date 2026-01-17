/**
 * @file Redux UI slice.
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CookingMethod, Difficulty, DishGroup } from "@/types/recipes";

/**
 * UI state (client-side) used for recipe search/filtering.
 */
export type UiState = {
  recipeQuery: string;
  difficulty: Difficulty | null;
  dishGroup: DishGroup | null;
  cookingMethod: CookingMethod | null;
};

const initialState: UiState = {
  recipeQuery: "",
  difficulty: null,
  dishGroup: null,
  cookingMethod: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setRecipeQuery(state, action: PayloadAction<string>) {
      state.recipeQuery = action.payload;
    },
    setDifficulty(state, action: PayloadAction<Difficulty | null>) {
      state.difficulty = action.payload;
    },
    setDishGroup(state, action: PayloadAction<DishGroup | null>) {
      state.dishGroup = action.payload;
    },
    setCookingMethod(state, action: PayloadAction<CookingMethod | null>) {
      state.cookingMethod = action.payload;
    },
    clearRecipeFilters(state) {
      state.difficulty = null;
      state.dishGroup = null;
      state.cookingMethod = null;
    },
  },
});

/**
 * UI slice action creators.
 */
export const { setRecipeQuery, setDifficulty, setDishGroup, setCookingMethod, clearRecipeFilters } =
  uiSlice.actions;

/**
 * UI slice reducer.
 */
export const uiReducer = uiSlice.reducer;
