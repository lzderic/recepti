/**
 * @file Zod validation schemas for recipe payloads.
 */

import "server-only";

import { CookingMethod, Difficulty, DishGroup } from "@prisma/client";
import { z } from "zod";

/**
 * Ingredient validation schema.
 */
export const ingredientSchema = z.object({
  name: z.string().min(1),
  amount: z.union([z.number(), z.string()]).optional(),
  unit: z.string().min(1).optional(),
});

/**
 * Step validation schema.
 */
export const stepSchema = z.object({
  text: z.string().min(1),
});

const recipeImageRefSchema = z.object({
  cdnPath: z.string().min(1),
  alt: z.string().min(1).optional(),
});

export const recipeImagesSchema = z
  .object({
    hero: recipeImageRefSchema.optional(),
    gallery: z.array(recipeImageRefSchema).optional(),
    variants: z.record(z.string(), recipeImageRefSchema).optional(),
  })
  .partial();

/**
 * Base recipe schema shared by create/update flows.
 */
export const recipeBaseSchema = z.object({
  title: z.string().min(3),
  lead: z.string().min(10),
  prepTimeMinutes: z
    .number()
    .int()
    .positive()
    .max(24 * 60),
  servings: z.number().int().positive().max(100),
  difficulty: z.nativeEnum(Difficulty),
  dishGroup: z.nativeEnum(DishGroup),
  cookingMethod: z.nativeEnum(CookingMethod),
  tags: z.array(z.string().min(1)).default([]),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(stepSchema).min(1),
  imageCdnPath: z.string().min(1),
  images: recipeImagesSchema.optional(),
});

/**
 * Schema for creating a recipe.
 */
export const createRecipeSchema = recipeBaseSchema.extend({
  slug: z.string().min(1).optional(),
});

/**
 * Schema for updating a recipe (partial patch).
 */
export const updateRecipeSchema = recipeBaseSchema.partial();
