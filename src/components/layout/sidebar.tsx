/**
 * @file Sidebar layout component.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/nav";
import { STRINGS } from "@/shared/strings";
import type { IconProps, NavLinkProps } from "./sidebar.types";

const Icon = ({ children }: IconProps) => (
  <span className="inline-flex h-5 w-5 items-center justify-center text-zinc-500" aria-hidden>
    {children}
  </span>
);

const icons = {
  home: (
    <Icon>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 11.5 12 4l8 7.5V20a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 20v-8.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M9.5 21.5V14h5v7.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </Icon>
  ),
  spark: (
    <Icon>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M4 14l.7 3L8 18l-3.3 1-.7 3-.7-3L0 18l3.3-1L4 14Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  ),
  leaf: (
    <Icon>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 4c-7 0-12 5-12 12 0 2.5 1 4.5 3.5 4.5C18 20.5 20 13 20 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M8 16c2-1 4-3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Icon>
  ),
  book: (
    <Icon>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v18H7.5A2.5 2.5 0 0 0 5 22.5V4.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  ),
  camera: (
    <Icon>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 7.5A2.5 2.5 0 0 1 6.5 5H9l1-1.5h4L15 5h2.5A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
      </svg>
    </Icon>
  ),
  users: (
    <Icon>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" stroke="currentColor" strokeWidth="2" />
        <path
          d="M4 21a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Icon>
  ),
};

const mainItems: NavItem[] = [
  { label: STRINGS.nav.main.home, href: "/", icon: icons.home, disabled: true },
  {
    label: STRINGS.nav.main.foodhacks,
    href: "/recepti?sek=foodhacks",
    icon: icons.spark,
    disabled: true,
  },
  { label: STRINGS.nav.main.coolie, href: "/recepti?sek=coolie", icon: icons.book, disabled: true },
  {
    label: STRINGS.nav.main.greenCorner,
    href: "/recepti?sek=zeleni",
    icon: icons.leaf,
    disabled: true,
  },
  {
    label: STRINGS.nav.main.inspiration,
    href: "/recepti?sek=inspiracija",
    icon: icons.spark,
    disabled: true,
  },
];

const recipeSection: NavItem[] = [
  { label: STRINGS.pages.recipes.title, href: "/recepti", icon: icons.book },
  { label: STRINGS.nav.recipes.new, href: "/recepti/novi", indent: true, disabled: true },
  {
    label: STRINGS.nav.recipes.popular,
    href: "/recepti?kat=popularni",
    indent: true,
    disabled: true,
  },
  {
    label: STRINGS.nav.recipes.video,
    href: "/recepti?kat=video",
    indent: true,
    disabled: true,
  },
  { label: STRINGS.nav.recipes.featured, href: "/recepti?kat=by", indent: true, disabled: true },
  {
    label: STRINGS.nav.recipes.recipeOfDay,
    href: "/recepti?kat=danas",
    indent: true,
    disabled: true,
  },
];

const adminSection: NavItem[] = [
  { label: STRINGS.nav.admin, href: "/recepti/admin", icon: icons.users },
];

const exploreItems: NavItem[] = [
  {
    label: STRINGS.nav.explore.dishes,
    href: "/recepti?kat=jela",
    icon: icons.book,
    disabled: true,
  },
  {
    label: STRINGS.nav.explore.ingredients,
    href: "/recepti?kat=namirnice",
    icon: icons.book,
    disabled: true,
  },
  {
    label: STRINGS.nav.explore.images,
    href: "/recepti?kat=slike",
    icon: icons.camera,
    disabled: true,
  },
  { label: STRINGS.nav.explore.blog, href: "/recepti?kat=blog", icon: icons.book, disabled: true },
  {
    label: STRINGS.nav.explore.people,
    href: "/recepti?kat=ljudi",
    icon: icons.users,
    disabled: true,
  },
];

const footerLinks: NavItem[] = [
  { label: STRINGS.nav.footer.registration, href: "/recepti?kat=registracija", disabled: true },
  { label: STRINGS.nav.footer.newsletter, href: "/recepti?kat=newsletter", disabled: true },
  { label: STRINGS.nav.footer.glossary, href: "/recepti?kat=rjecnik", disabled: true },
  { label: STRINGS.nav.footer.contact, href: "/recepti?kat=kontakt", disabled: true },
  { label: STRINGS.nav.footer.impressum, href: "/recepti?kat=impressum", disabled: true },
  { label: STRINGS.nav.footer.howToUse, href: "/recepti?kat=upute", disabled: true },
];

const isActive = (pathname: string | null, href: string) => {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (href === "/recepti") {
    if (pathname.startsWith("/recepti/admin")) return false;
    return pathname === "/recepti" || pathname.startsWith("/recepti/");
  }
  return pathname === href || pathname.startsWith(href + "/");
};

const NavLink = ({ item, active }: NavLinkProps) => {
  const base = "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition";
  const disabled = Boolean(item.disabled);

  if (item.indent) {
    const className =
      "block rounded-lg px-9 py-1.5 text-sm transition " +
      (disabled
        ? "cursor-not-allowed text-zinc-500"
        : active
          ? "text-red-700"
          : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900");

    if (disabled) {
      return (
        <div className={className} aria-disabled>
          {item.label}
        </div>
      );
    }

    return (
      <Link href={item.href} className={className}>
        {item.label}
      </Link>
    );
  }

  if (disabled) {
    return (
      <div className={base + " text-zinc-500 cursor-not-allowed"} aria-disabled>
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" aria-hidden />
        {item.icon ? item.icon : <span className="h-5 w-5" aria-hidden />}
        <span className="min-w-0 truncate">{item.label}</span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={
        base +
        " " +
        (active ? "bg-red-50 text-red-700" : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900")
      }
    >
      <span
        className={"h-2.5 w-2.5 rounded-full " + (active ? "bg-red-600" : "bg-zinc-300")}
        aria-hidden
      />
      {item.icon ? item.icon : <span className="h-5 w-5" aria-hidden />}
      <span className="min-w-0 truncate">{item.label}</span>
    </Link>
  );
};

/**
 * Renders the main left sidebar navigation for large screens.
 *
 * @returns {JSX.Element} Sidebar markup.
 */
const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[292px] shrink-0 border-r border-zinc-200 bg-white lg:block">
      <div className="sticky top-0 flex h-dvh flex-col">
        <div className="px-5 pt-5">
          <Link href="/" className="block select-none">
            <div className="flex items-end gap-2">
              <div className="text-xl font-extrabold tracking-tight leading-none">
                <span className="text-red-600">re</span>
                <span className="text-zinc-900">cepti</span>
              </div>
              {/* Intentionally blank: branding removed */}
            </div>
          </Link>
        </div>

        <nav className="mt-5 flex-1 overflow-auto px-3 pb-4">
          <div className="space-y-1">
            {mainItems.map((item) => {
              const active = !item.disabled && isActive(pathname, item.href);
              return <NavLink key={item.href} item={item} active={active} />;
            })}
          </div>

          <div className="mt-2">
            <div className="px-2">
              {recipeSection.map((item) => {
                const active = !item.disabled && isActive(pathname, item.href);
                return <NavLink key={item.href} item={item} active={active} />;
              })}
            </div>
          </div>

          <div className="mt-2 space-y-1">
            {[...adminSection, ...exploreItems].map((item) => {
              const active = !item.disabled && isActive(pathname, item.href);
              return <NavLink key={item.href} item={item} active={active} />;
            })}
          </div>

          <div className="mt-6 border-t border-zinc-200 pt-4 px-2">
            <div className="space-y-2">
              {footerLinks.map((item) =>
                item.disabled ? (
                  <div key={item.href} className="block text-[11px] text-zinc-500" aria-disabled>
                    {item.label}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-[11px] text-zinc-500 hover:text-zinc-700"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </nav>

        <div className="border-t border-zinc-200 p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            aria-label="Moj profil (demo)"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 20a8 8 0 0 0-16 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Moj profil
            <span
              className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500"
              aria-hidden
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
