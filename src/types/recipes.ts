/**
 * @file Recipe domain types and DTOs.
 */

/**
 * Recipe difficulty levels.
 */
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

/**
 * High-level grouping/category of a recipe.
 */
export type DishGroup = "MAIN" | "DESSERT" | "BREAD" | "APPETIZER" | "SALAD" | "SOUP";

/**
 * Primary cooking technique used for a recipe.
 */
export type CookingMethod = "BAKE" | "FRY" | "BOIL" | "GRILL" | "NO_COOK";

/**
 * Reference to an image stored/served from the CDN.
 */
export type RecipeImageRef = {
  cdnPath: string;
  alt?: string;
};

/**
 * Structured image set for a recipe.
 */
export type RecipeImages = {
  hero?: RecipeImageRef;
  gallery?: RecipeImageRef[];
  variants?: Record<string, RecipeImageRef>;
};

/**
 * Single ingredient line item.
 */
export type Ingredient = {
  name: string;
  amount?: number | string;
  unit?: string;
};

/**
 * One instruction step.
 */
export type Step = {
  text: string;
};

/**
 * Summary recipe shape used in lists/grids.
 */
export type RecipeListItem = {
  id: string;
  slug: string;
  title: string;
  lead: string;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  dishGroup: DishGroup;
  cookingMethod: CookingMethod;
  imageCdnPath: string;
  images?: RecipeImages;
};

/**
 * Full recipe shape used on the recipe details page.
 */
export type Recipe = RecipeListItem & {
  servings: number;
  cookingMethod: CookingMethod;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  createdAt: string;
  updatedAt: string;
};

/**
 * Standard API response wrapper used by Next.js route handlers.
 */
export type ApiResponse<T> = { data: T };
