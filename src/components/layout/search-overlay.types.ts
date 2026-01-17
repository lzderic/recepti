/**
 * @file Types for the search overlay component.
 */

import type { ReactNode } from "react";
import type { RecipeListItem } from "@/types/recipes";

/**
 * Props for the search overlay dialog.
 */
export type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null;
  snapLeft?: number | null;
};

/**
 * Props for overlay section titles.
 */
export type SectionTitleProps = { children: ReactNode };

/**
 * Filter chip props.
 */
export type ChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

/**
 * API response shape for recipe list queries.
 */
export type RecipesResponse = { data: RecipeListItem[] };
