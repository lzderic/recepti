/**
 * @file Sticky search input for recipe lists.
 */

"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setRecipeQuery } from "@/store/uiSlice";
import { STRINGS } from "@/shared/strings";

/**
 * Search input that stays visible while scrolling.
 *
 * @returns {JSX.Element} Sticky search markup.
 */
const StickySearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const recipeQuery = useSelector((s: RootState) => s.ui.recipeQuery);

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-b from-white/90 to-white/0 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 pb-2 pt-4">
        <div className="flex items-center">
          <div className="relative">
            <input
              value={recipeQuery}
              onChange={(e) => dispatch(setRecipeQuery(e.target.value))}
              placeholder={STRINGS.searchOverlay.inputPlaceholder}
              className="h-11 w-[340px] rounded-full border border-zinc-200 bg-white pl-5 pr-12 text-sm outline-none shadow-sm placeholder:text-zinc-400 focus:border-red-200 focus:ring-4 focus:ring-red-600/10 sm:w-[420px]"
              aria-label={STRINGS.searchOverlay.aria.searchInput}
            />
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-500">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21l-4.2-4.2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="hidden h-9 items-center rounded-full bg-red-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 lg:inline-flex"
          aria-label="Jela (demo)"
        >
          Jela
        </button>
      </div>
    </div>
  );
};

export default StickySearch;
