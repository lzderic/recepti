/**
 * @file Search overlay component.
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  clearRecipeFilters,
  setCookingMethod,
  setDifficulty,
  setDishGroup,
  setRecipeQuery,
} from "@/store/uiSlice";
import { buildCdnUrl } from "@/lib/cdn";
import {
  COOKING_METHOD_OPTIONS_HR,
  DIFFICULTY_OPTIONS_HR,
  DISH_GROUP_OPTIONS_HR,
  formatDifficultyHr,
  formatDishGroupHr,
} from "@/lib/formatters/recipes";
import { shouldUnoptimizeImage } from "@/lib/images";
import { STRINGS } from "@/shared/strings";
import { listRecipes } from "@/services/recipes.client";
import type { CookingMethod, Difficulty, DishGroup, RecipeListItem } from "@/types/recipes";
import type { ChipProps, SearchOverlayProps, SectionTitleProps } from "./search-overlay.types";

const SectionTitle = ({ children }: SectionTitleProps) => (
  <div className="inline-flex items-center rounded bg-yellow-300 px-2 py-1 text-[11px] font-black tracking-[0.22em] text-zinc-900">
    {children}
  </div>
);

const Chip = ({ label, active, onClick }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={
      active
        ? "cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
        : "cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
    }
  >
    {label}
  </button>
);

const formatDifficulty = (d: Difficulty) => formatDifficultyHr(d);

const formatDishGroup = (g: DishGroup) => formatDishGroupHr(g);

/**
 * Fullscreen search and filtering overlay.
 *
 * @param {SearchOverlayProps} props Overlay state and positioning inputs.
 * @returns {JSX.Element | null} Portal content when open, otherwise null.
 */
const SearchOverlay = ({ open, onClose, anchorRect, snapLeft }: SearchOverlayProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const recipeQuery = useSelector((s: RootState) => s.ui.recipeQuery);
  const difficulty = useSelector((s: RootState) => s.ui.difficulty);
  const dishGroup = useSelector((s: RootState) => s.ui.dishGroup);
  const cookingMethod = useSelector((s: RootState) => s.ui.cookingMethod);

  const resetAll = useCallback(() => {
    dispatch(setRecipeQuery(""));
    dispatch(clearRecipeFilters());
  }, [dispatch]);

  const closeAndReset = useCallback(() => {
    resetAll();
    onClose();
  }, [resetAll, onClose]);

  const hasAnyFilter = Boolean(difficulty || dishGroup || cookingMethod || recipeQuery.trim());

  const inputRef = useRef<HTMLInputElement | null>(null);
  const wasOpenRef = useRef(false);

  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    const q = recipeQuery.trim().toLowerCase();
    return recipes.filter((r) => {
      if (q && !`${r.title} ${r.lead}`.toLowerCase().includes(q)) return false;
      if (difficulty && r.difficulty !== difficulty) return false;
      if (dishGroup && r.dishGroup !== dishGroup) return false;
      if (cookingMethod && r.cookingMethod !== cookingMethod) return false;
      return true;
    });
  }, [recipes, recipeQuery, difficulty, dishGroup, cookingMethod]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAndReset();
    };

    window.addEventListener("keydown", onKeyDown);
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(id);
    };
  }, [open, closeAndReset]);

  useEffect(() => {
    if (wasOpenRef.current && !open) resetAll();
    wasOpenRef.current = open;
  }, [open, resetAll]);

  const startLoadRecipes = useCallback(() => {
    const ac = new AbortController();

    setRecipesLoading(true);
    setRecipesError(null);

    listRecipes({ signal: ac.signal })
      .then(setRecipes)
      .catch((e) => {
        if (e instanceof Error && e.name === "AbortError") return;
        setRecipesError(e instanceof Error ? e.message : STRINGS.errors.generic);
      })
      .finally(() => setRecipesLoading(false));

    return () => ac.abort();
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!hasAnyFilter) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    return startLoadRecipes();
  }, [open, hasAnyFilter, startLoadRecipes]);

  const difficultyOptions = DIFFICULTY_OPTIONS_HR as Array<{ value: Difficulty; label: string }>;
  const dishGroupOptions = DISH_GROUP_OPTIONS_HR as Array<{ value: DishGroup; label: string }>;
  const cookingMethodOptions = COOKING_METHOD_OPTIONS_HR as Array<{
    value: CookingMethod;
    label: string;
  }>;

  if (!open || !anchorRect) return null;
  // Guard for SSR/prerender: createPortal requires a DOM.
  if (typeof document === "undefined") return null;

  const anchorLeft = Math.max(0, Math.round(anchorRect.left));
  const top = Math.max(0, Math.round(anchorRect.top));
  const anchorWidth = Math.max(0, Math.round(anchorRect.width));
  const anchorHeight = Math.max(0, Math.round(anchorRect.height));
  const left = typeof snapLeft === "number" ? Math.max(0, Math.round(snapLeft)) : anchorLeft;

  const width = typeof snapLeft === "number" ? 640 : Math.max(560, Math.round(anchorRect.width));
  const overlayLeft = left + width;

  const closeSize = Math.max(36, anchorHeight);
  const closeGap = 8;
  const viewportWidth = document.documentElement?.clientWidth ?? window.innerWidth;
  const closeLeft = Math.min(
    Math.round(anchorLeft + anchorWidth + closeGap),
    Math.max(0, Math.round(viewportWidth - closeSize - 12)),
  );

  const panelPaddingTop = Math.max(16, anchorHeight + 16);
  const canShowResults = viewportWidth - overlayLeft > 240;
  const showResultsPanel = canShowResults && hasAnyFilter;

  return createPortal(
    <div className="fixed inset-0 z-[999]">
      {showResultsPanel ? (
        <div
          className="fixed inset-y-0 right-0 z-[999] overflow-y-auto bg-white cooli-pattern"
          style={{ left: overlayLeft }}
          aria-label={STRINGS.searchOverlay.aria.resultsPanel}
        >
          <div
            className="mx-auto w-full max-w-[1200px] px-6 pb-10"
            style={{ paddingTop: panelPaddingTop }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-2xl font-black tracking-tight text-zinc-900">
                  {STRINGS.searchOverlay.results.title}
                </div>
                <div className="mt-1 text-sm font-semibold text-zinc-600">
                  {recipesLoading
                    ? STRINGS.searchOverlay.results.loading
                    : recipesError
                      ? STRINGS.searchOverlay.results.fetchError
                      : `${filteredRecipes.length} ${STRINGS.searchOverlay.results.recipeCountLabel}`}
                </div>
              </div>

              <div className="text-xs font-semibold text-zinc-500">
                {STRINGS.searchOverlay.results.openHint}
              </div>
            </div>

            {recipesError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {recipesError}
              </div>
            ) : null}

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((r) => {
                const imageUrl = buildCdnUrl(r.imageCdnPath);
                const unoptimized = shouldUnoptimizeImage([r.imageCdnPath, imageUrl]);

                return (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => {
                      router.push(`/recepti/${r.slug}`);
                      onClose();
                    }}
                    className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                  >
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-zinc-100">
                      <Image
                        src={imageUrl}
                        alt={r.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        unoptimized={unoptimized}
                      />
                    </div>

                    <div className="space-y-2 p-5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold text-zinc-600">
                        <span>{formatDishGroup(r.dishGroup)}</span>
                        <span className="text-zinc-300" aria-hidden>
                          •
                        </span>
                        <span>{r.prepTimeMinutes} min</span>
                        <span className="text-zinc-300" aria-hidden>
                          •
                        </span>
                        <span>{formatDifficulty(r.difficulty)}</span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="line-clamp-2 text-lg font-extrabold leading-snug text-zinc-900 group-hover:text-red-700">
                            {r.title}
                          </div>
                        </div>
                      </div>

                      <p className="line-clamp-2 text-base text-zinc-600">{r.lead}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {!recipesLoading && !recipesError && filteredRecipes.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
                {STRINGS.searchOverlay.results.noMatches}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="fixed bottom-0 right-0 top-0 cursor-pointer bg-black/25"
          style={{ left: overlayLeft }}
          onClick={closeAndReset}
          aria-label={STRINGS.searchOverlay.aria.closeBackdrop}
        />
      )}

      <div
        className="fixed z-[1001] pointer-events-auto"
        style={{ left: anchorLeft, top, width: anchorWidth }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            value={recipeQuery}
            onChange={(e) => dispatch(setRecipeQuery(e.target.value))}
            placeholder={STRINGS.searchOverlay.inputPlaceholder}
            className="h-9 w-full cursor-text rounded-full border border-zinc-200 bg-white/90 px-3.5 pr-9 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-500 shadow-md outline-none backdrop-blur focus:border-zinc-300"
            aria-label={STRINGS.searchOverlay.aria.searchInput}
          />
          <div
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-700"
            aria-hidden
          >
            🔍
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={closeAndReset}
        className="fixed z-[1002] inline-flex cursor-pointer items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
        style={{ left: closeLeft, top, width: closeSize, height: closeSize }}
        aria-label={STRINGS.searchOverlay.aria.closeButton}
      >
        ✕
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={STRINGS.searchOverlay.aria.dialog}
        className="fixed z-[1000] overflow-hidden rounded-2xl rounded-l-none bg-white shadow-2xl cooli-slide-in"
        style={{
          left,
          top: 0,
          width,
          maxWidth: `calc(100vw - ${left}px - 12px)`,
          height: "100dvh",
        }}
      >
        <div className="flex h-full flex-col">
          <div
            className="border-b border-zinc-200 px-4 pb-4"
            style={{ paddingTop: panelPaddingTop }}
          >
            {hasAnyFilter ? (
              <button
                type="button"
                onClick={() => {
                  dispatch(setRecipeQuery(""));
                  dispatch(clearRecipeFilters());
                }}
                className="cursor-pointer text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
              >
                {STRINGS.searchOverlay.clearAll}
              </button>
            ) : null}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-wrap gap-2">
              <Chip label={STRINGS.searchOverlay.chips.featured} />
              <Chip label={STRINGS.searchOverlay.chips.hasVideo} />
            </div>

            <div className="mt-6 space-y-8">
              <section className="space-y-3">
                <SectionTitle>{STRINGS.searchOverlay.sections.difficulty}</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {difficultyOptions.map((o) => (
                    <Chip
                      key={o.value}
                      label={o.label}
                      active={difficulty === o.value}
                      onClick={() =>
                        dispatch(setDifficulty(difficulty === o.value ? null : o.value))
                      }
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <SectionTitle>{STRINGS.searchOverlay.sections.dishGroup}</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {dishGroupOptions.map((o) => (
                    <Chip
                      key={o.value}
                      label={o.label}
                      active={dishGroup === o.value}
                      onClick={() => dispatch(setDishGroup(dishGroup === o.value ? null : o.value))}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <SectionTitle>{STRINGS.searchOverlay.sections.cookingMethod}</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {cookingMethodOptions.map((o) => (
                    <Chip
                      key={o.value}
                      label={o.label}
                      active={cookingMethod === o.value}
                      onClick={() =>
                        dispatch(setCookingMethod(cookingMethod === o.value ? null : o.value))
                      }
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SearchOverlay;
