/**
 * @file Client-side recipe grid rendering and filtering.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildCdnUrl } from "@/lib/cdn";
import { formatDifficultyHr, formatDishGroupHr } from "@/lib/formatters/recipes";
import { shouldUnoptimizeImage } from "@/lib/images";
import type { AppDispatch, RootState } from "@/store/store";
import { setRecipeQuery } from "@/store/uiSlice";
import type { RecipeGridClientProps } from "./recipe-grid-client.types";

/**
 * Renders a filterable recipe grid.
 *
 * @param {RecipeGridClientProps} props Initial recipes payload.
 * @returns {JSX.Element} Grid markup.
 */
const RecipeGridClient = ({ initialRecipes }: RecipeGridClientProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const recipeQuery = useSelector((s: RootState) => s.ui.recipeQuery);
  const difficulty = useSelector((s: RootState) => s.ui.difficulty);
  const dishGroup = useSelector((s: RootState) => s.ui.dishGroup);
  const cookingMethod = useSelector((s: RootState) => s.ui.cookingMethod);

  const filtered = useMemo(() => {
    const q = recipeQuery.trim().toLowerCase();
    return initialRecipes.filter((r) => {
      if (q && !`${r.title} ${r.lead}`.toLowerCase().includes(q)) return false;
      if (difficulty && r.difficulty !== difficulty) return false;
      if (dishGroup && r.dishGroup !== dishGroup) return false;
      if (cookingMethod && r.cookingMethod !== cookingMethod) return false;
      return true;
    });
  }, [initialRecipes, recipeQuery, difficulty, dishGroup, cookingMethod]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-600">Prikazano: {filtered.length}</div>
        {recipeQuery.trim() ? (
          <button
            type="button"
            onClick={() => dispatch(setRecipeQuery(""))}
            className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
          >
            Očisti pretragu
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r, idx) => {
          const imageUrl = buildCdnUrl(r.imageCdnPath);
          const unoptimized = shouldUnoptimizeImage([r.imageCdnPath, imageUrl]);

          return (
            <Link
              key={r.slug}
              href={`/recepti/${r.slug}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={imageUrl}
                  alt={r.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                  priority={idx < 2}
                  unoptimized={unoptimized}
                />
              </div>

              <div className="space-y-2 p-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold text-zinc-600">
                  <span>{formatDishGroupHr(r.dishGroup)}</span>
                  <span className="text-zinc-300" aria-hidden>
                    •
                  </span>
                  <span>{r.prepTimeMinutes} min</span>
                  <span className="text-zinc-300" aria-hidden>
                    •
                  </span>
                  <span>{formatDifficultyHr(r.difficulty)}</span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 text-lg font-extrabold leading-snug text-zinc-900 group-hover:text-red-700">
                    {r.title}
                  </h2>
                </div>

                <p className="line-clamp-2 text-base text-zinc-600">{r.lead}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeGridClient;
