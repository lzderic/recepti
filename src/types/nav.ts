/**
 * @file Navigation types.
 */

import type { ReactNode } from "react";

/**
 * Generic navigation entry used by layout components.
 */
export type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  indent?: boolean;
  disabled?: boolean;
};
