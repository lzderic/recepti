/**
 * @file Recipes sub-navigation component.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STRINGS } from "@/shared/strings";

const tabs = [
  { href: "/recepti/novi", label: STRINGS.nav.recipes.new },
  { href: "/recepti/popularni", label: STRINGS.nav.recipes.popular },
  { href: "/recepti/video", label: STRINGS.nav.recipes.video },
  { href: "/recepti/izbor", label: STRINGS.nav.recipes.featured },
  { href: "/recepti/recept-dana", label: STRINGS.nav.recipes.recipeOfDay },
];

/**
 * Renders the tabs used to switch between recipes sections.
 *
 * @returns {JSX.Element} Subnav markup.
 */
const RecipesSubnav = () => {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-1">
        {tabs.map((t) => {
          const active =
            pathname === t.href || (pathname === "/recepti" && t.href === "/recepti/novi");
          return (
            <Link
              key={t.href}
              href={t.href}
              className={
                active
                  ? "rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white"
                  : "rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200"
              }
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecipesSubnav;
