/**
 * @file Types for the sidebar component.
 */

import type { ReactNode } from "react";
import type { NavItem } from "@/types/nav";

/**
 * Props for sidebar icon wrapper.
 */
export type IconProps = { children: ReactNode };

/**
 * Props for a single navigation link entry.
 */
export type NavLinkProps = {
  item: NavItem;
  active: boolean;
};
