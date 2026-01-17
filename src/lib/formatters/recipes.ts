/**
 * @file Formatting helpers for recipe values.
 */

import type { CookingMethod, Difficulty, DishGroup } from "@/types/recipes";

/**
 * Human-readable labels for difficulty values (Croatian).
 */
export const DIFFICULTY_HR_LABELS: Record<Difficulty, string> = {
  EASY: "Jednostavno",
  MEDIUM: "Srednje zahtjevno",
  HARD: "Složeno",
} as const;

/**
 * Human-readable labels for dish group values (Croatian).
 */
export const DISH_GROUP_HR_LABELS: Record<DishGroup, string> = {
  MAIN: "Glavna jela",
  DESSERT: "Deserti",
  BREAD: "Kruh i peciva",
  APPETIZER: "Predjela",
  SALAD: "Salate",
  SOUP: "Juhe",
} as const;

/**
 * Human-readable labels for cooking method values (Croatian).
 */
export const COOKING_METHOD_HR_LABELS: Record<CookingMethod, string> = {
  BAKE: "Pečenje",
  BOIL: "Kuhanje",
  FRY: "Prženje",
  GRILL: "Grilanje",
  NO_COOK: "Bez termičke obrade",
} as const;

/**
 * Select options derived from `DIFFICULTY_HR_LABELS`.
 */
export const DIFFICULTY_OPTIONS_HR = Object.entries(DIFFICULTY_HR_LABELS).map(([value, label]) => ({
  value: value as Difficulty,
  label,
}));

/**
 * Select options derived from `DISH_GROUP_HR_LABELS`.
 */
export const DISH_GROUP_OPTIONS_HR = Object.entries(DISH_GROUP_HR_LABELS).map(([value, label]) => ({
  value: value as DishGroup,
  label,
}));

/**
 * Select options derived from `COOKING_METHOD_HR_LABELS`.
 */
export const COOKING_METHOD_OPTIONS_HR = Object.entries(COOKING_METHOD_HR_LABELS).map(
  ([value, label]) => ({ value: value as CookingMethod, label }),
);

/**
 * Formats a difficulty value into Croatian.
 */
export const formatDifficultyHr = (d: Difficulty | string) => {
  if (d in DIFFICULTY_HR_LABELS) return DIFFICULTY_HR_LABELS[d as Difficulty];
  return d;
};

/**
 * Formats a dish group value into Croatian.
 */
export const formatDishGroupHr = (g: DishGroup | string) => {
  if (g in DISH_GROUP_HR_LABELS) return DISH_GROUP_HR_LABELS[g as DishGroup];
  return g;
};

/**
 * Formats a cooking method value into Croatian.
 */
export const formatCookingMethodHr = (m: CookingMethod | string) => {
  if (m in COOKING_METHOD_HR_LABELS) return COOKING_METHOD_HR_LABELS[m as CookingMethod];
  return m;
};

/**
 * Formats an ISO date string into `hr-HR` locale date.
 *
 * Returns an empty string for invalid inputs.
 */
export const formatDateHr = (iso: string) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";

    return d.toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
};
