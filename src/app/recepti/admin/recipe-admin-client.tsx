/**
 * @file Client-side admin UI for managing recipes.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  listRecipes,
  updateRecipe,
} from "@/services/recipes.client";
import { uploadRecipeHeroImage } from "@/services/uploads.client";
import { buildCdnUrl } from "@/lib/cdn";
import { IMAGE_MIME_ACCEPT_ATTR, imageExtFromFile } from "@/lib/images";
import { STRINGS } from "@/shared/strings";
import type {
  CookingMethod,
  Difficulty,
  DishGroup,
  Ingredient,
  RecipeListItem,
  Step,
} from "@/types/recipes";

const ERROR_MESSAGE = STRINGS.errors.generic;

const ERROR_SELECT_HERO_OR_CDN_PATH = STRINGS.errors.selectHeroOrCdnPath;
const ERROR_TITLE_REQUIRED = STRINGS.errors.titleRequired;
const ERROR_LEAD_REQUIRED = STRINGS.errors.leadRequired;
const ERROR_INGREDIENTS_JSON_INVALID = STRINGS.errors.ingredientsJsonInvalid;
const ERROR_STEPS_JSON_INVALID = STRINGS.errors.stepsJsonInvalid;
const ERROR_INGREDIENTS_ARRAY_REQUIRED = STRINGS.errors.ingredientsArrayRequired;
const ERROR_STEPS_ARRAY_REQUIRED = STRINGS.errors.stepsArrayRequired;

const LABEL_TITLE = STRINGS.labels.title;
const LABEL_LEAD = STRINGS.labels.lead;
const LABEL_PREP_TIME_MINUTES = STRINGS.labels.prepTimeMinutes;
const LABEL_SERVINGS = STRINGS.labels.servings;
const LABEL_DIFFICULTY = STRINGS.labels.difficulty;
const LABEL_DISH_GROUP = STRINGS.labels.dishGroup;
const LABEL_COOKING_METHOD = STRINGS.labels.cookingMethod;
const LABEL_TAGS_CSV = STRINGS.labels.tagsCsv;
const LABEL_IMAGE_CDN_PATH = STRINGS.labels.imageCdnPath;
const LABEL_INGREDIENTS_JSON = STRINGS.labels.ingredientsJson;
const LABEL_STEPS_JSON = STRINGS.labels.stepsJson;
const LABEL_HERO_UPLOAD_DEV = STRINGS.labels.heroUploadDev;
const LABEL_CHOOSE_FILE = STRINGS.ui.chooseFile;
const LABEL_NO_FILE_CHOSEN = STRINGS.ui.noFileChosen;
const LABEL_PREVIEW_URL = STRINGS.ui.previewUrl;

const PLACEHOLDER_IMAGE_CDN_PATH = STRINGS.placeholders.imageCdnPath;
const ACTION_CREATE = STRINGS.actions.create;
const ACTION_UPDATE = STRINGS.actions.update;
const ACTION_DELETE = STRINGS.actions.delete;

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const DISH_GROUPS: DishGroup[] = ["MAIN", "DESSERT", "BREAD", "APPETIZER", "SALAD", "SOUP"];
const COOKING_METHODS: CookingMethod[] = ["BAKE", "FRY", "BOIL", "GRILL", "NO_COOK"];

const defaultIngredients = (): Ingredient[] => [{ name: "Sastojak", amount: 1, unit: "kom" }];

const defaultSteps = (): Step[] => [{ text: "Korak pripreme" }];

type EditPatch = {
  title: string;
  lead: string;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  dishGroup: DishGroup;
  cookingMethod: CookingMethod;
  imageCdnPath: string;
  heroFile?: File | null;
  advancedLoaded?: boolean;
  servings?: number;
  tagsCsv?: string;
  ingredientsJson?: string;
  stepsJson?: string;
};

const patchFromListItem = (r: RecipeListItem): EditPatch => ({
  title: r.title,
  lead: r.lead,
  prepTimeMinutes: r.prepTimeMinutes,
  difficulty: r.difficulty,
  dishGroup: r.dishGroup,
  cookingMethod: r.cookingMethod,
  imageCdnPath: r.imageCdnPath,
  heroFile: null,
  advancedLoaded: false,
});

type Toast = {
  id: string;
  kind: "success" | "error";
  message: string;
};

type RecipeAdminClientProps = {
  initialRecipes: RecipeListItem[];
};

const makeToastId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const extFromFile = (file: File): string | null => {
  return imageExtFromFile(file);
};

/**
 * Renders the admin interface for creating, editing and deleting recipes.
 *
 * @param {RecipeAdminClientProps} props Initial recipes payload.
 * @returns {JSX.Element} Admin page content.
 */
const RecipeAdminClient = ({ initialRecipes }: RecipeAdminClientProps) => {
  const [recipes, setRecipes] = useState<RecipeListItem[]>(initialRecipes);
  const [busy, setBusy] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);

  const pushToast = (kind: Toast["kind"], message: string, opts?: { durationMs?: number }) => {
    const id = makeToastId();
    const durationMs = opts?.durationMs ?? (kind === "error" ? 6000 : 3500);

    setToasts((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  };

  const [createForm, setCreateForm] = useState({
    title: "",
    slug: "",
    lead: "",
    prepTimeMinutes: 30,
    servings: 4,
    difficulty: "EASY" as Difficulty,
    dishGroup: "MAIN" as DishGroup,
    cookingMethod: "BAKE" as CookingMethod,
    tagsCsv: "",
    ingredientsJson: JSON.stringify(defaultIngredients(), null, 2),
    stepsJson: JSON.stringify(defaultSteps(), null, 2),
    imageCdnPath: "",
  });

  const [heroFile, setHeroFile] = useState<File | null>(null);

  const [editState, setEditState] = useState<Record<string, EditPatch>>(() =>
    Object.fromEntries(recipes.map((r) => [r.slug, patchFromListItem(r)])),
  );

  const sorted = useMemo(() => {
    return [...recipes].sort((a, b) => a.title.localeCompare(b.title, "hr"));
  }, [recipes]);

  const refresh = async () => {
    const data = await listRecipes();

    setRecipes(data);
    setEditState((prev) => {
      const next: Record<string, EditPatch> = { ...prev };
      for (const r of data) {
        if (!next[r.slug]) {
          next[r.slug] = patchFromListItem(r);
          continue;
        }

        if (!next[r.slug].advancedLoaded) {
          next[r.slug] = {
            ...next[r.slug],
            ...patchFromListItem(r),
            advancedLoaded: false,
          };
        }
      }
      return next;
    });
  };

  const clearMessages = () => {
    // no-op: toasts auto-dismiss
  };

  const onCreate = async () => {
    clearMessages();

    if (!heroFile && !createForm.imageCdnPath.trim()) {
      pushToast("error", ERROR_SELECT_HERO_OR_CDN_PATH);
      return;
    }

    if (!createForm.title.trim() || createForm.title.trim().length < 3) {
      pushToast("error", ERROR_TITLE_REQUIRED + "\n");
      return;
    }

    if (!createForm.lead.trim() || createForm.lead.trim().length < 10) {
      pushToast("error", ERROR_LEAD_REQUIRED);
      return;
    }

    setBusy(true);
    try {
      const tags = createForm.tagsCsv
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      let ingredients: Ingredient[];
      let steps: Step[];
      try {
        ingredients = JSON.parse(createForm.ingredientsJson);
      } catch {
        throw new Error(ERROR_INGREDIENTS_JSON_INVALID);
      }
      try {
        steps = JSON.parse(createForm.stepsJson);
      } catch {
        throw new Error(ERROR_STEPS_JSON_INVALID);
      }

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        throw new Error(ERROR_INGREDIENTS_ARRAY_REQUIRED);
      }

      if (!ingredients.every((i) => i && typeof i.name === "string" && i.name.trim().length > 0)) {
        throw new Error("Svaki ingredient mora imati name.");
      }

      if (!Array.isArray(steps) || steps.length === 0) {
        throw new Error(ERROR_STEPS_ARRAY_REQUIRED);
      }

      if (!steps.every((s) => s && typeof s.text === "string" && s.text.trim().length > 0)) {
        throw new Error("Svaki step mora imati text.");
      }

      const createImageCdnPath = (() => {
        if (!heroFile) return createForm.imageCdnPath.trim();
        const ext = extFromFile(heroFile) ?? ".jpg";
        // Placeholder required by schema; real path is set right after upload.
        return `/recipes/_pending_/hero${ext}`;
      })();

      const payload = {
        title: createForm.title,
        lead: createForm.lead,
        prepTimeMinutes: Number(createForm.prepTimeMinutes),
        servings: Number(createForm.servings),
        difficulty: createForm.difficulty,
        dishGroup: createForm.dishGroup,
        cookingMethod: createForm.cookingMethod,
        tags,
        ingredients,
        steps,
        imageCdnPath: createImageCdnPath,
        ...(createForm.slug.trim() ? { slug: createForm.slug.trim() } : {}),
      };

      const created = await createRecipe(payload);

      if (heroFile) {
        const cdnPath = await uploadRecipeHeroImage(created.slug, heroFile);
        await updateRecipe(created.slug, { imageCdnPath: cdnPath });
        setCreateForm((f) => ({ ...f, imageCdnPath: cdnPath }));
        pushToast("success", "Recept kreiran i slika uploadana.");
        setHeroFile(null);
      } else {
        pushToast("success", STRINGS.admin.toasts.created);
      }

      setCreateForm((f) => ({ ...f, title: "", slug: "", lead: "" }));
      await refresh();
    } catch (e) {
      pushToast("error", e instanceof Error ? e.message : ERROR_MESSAGE);
    } finally {
      setBusy(false);
    }
  };

  const onLoadFull = async (slug: string) => {
    clearMessages();
    setBusy(true);
    try {
      const full = await getRecipe(slug);
      setEditState((s) => ({
        ...s,
        [slug]: {
          ...(s[slug] ?? patchFromListItem(full)),
          title: full.title,
          lead: full.lead,
          prepTimeMinutes: full.prepTimeMinutes,
          servings: full.servings,
          difficulty: full.difficulty,
          dishGroup: full.dishGroup,
          cookingMethod: full.cookingMethod,
          tagsCsv: full.tags.join(", "),
          ingredientsJson: JSON.stringify(full.ingredients, null, 2),
          stepsJson: JSON.stringify(full.steps, null, 2),
          imageCdnPath: full.imageCdnPath,
          heroFile: s[slug]?.heroFile ?? null,
          advancedLoaded: true,
        },
      }));
      pushToast("success", "Učitana su napredna polja (servings/tags/ingredients/steps).");
    } catch (e) {
      pushToast("error", e instanceof Error ? e.message : ERROR_MESSAGE);
    } finally {
      setBusy(false);
    }
  };

  const onUpdate = async (slug: string) => {
    clearMessages();
    setBusy(true);
    try {
      const patch = editState[slug];

      if (!patch) throw new Error("Nedostaje edit state.");
      if (!patch.title.trim() || patch.title.trim().length < 3) {
        throw new Error(ERROR_TITLE_REQUIRED);
      }
      if (!patch.lead.trim() || patch.lead.trim().length < 10) {
        throw new Error(ERROR_LEAD_REQUIRED);
      }
      if (!patch.heroFile && !patch.imageCdnPath.trim()) {
        throw new Error(ERROR_SELECT_HERO_OR_CDN_PATH);
      }

      const uploadedCdnPath = patch.heroFile
        ? await uploadRecipeHeroImage(slug, patch.heroFile)
        : null;

      const updatePayload: Parameters<typeof updateRecipe>[1] = {
        title: patch.title.trim(),
        lead: patch.lead,
        prepTimeMinutes: Number(patch.prepTimeMinutes),
        difficulty: patch.difficulty,
        dishGroup: patch.dishGroup,
        cookingMethod: patch.cookingMethod,
        imageCdnPath: (uploadedCdnPath ?? patch.imageCdnPath).trim(),
      };

      if (patch.advancedLoaded) {
        const tags = (patch.tagsCsv ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        let ingredients: Ingredient[] | undefined;
        let steps: Step[] | undefined;
        try {
          ingredients = JSON.parse(patch.ingredientsJson ?? "[]");
        } catch {
          throw new Error(ERROR_INGREDIENTS_JSON_INVALID);
        }
        try {
          steps = JSON.parse(patch.stepsJson ?? "[]");
        } catch {
          throw new Error(ERROR_STEPS_JSON_INVALID);
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
          throw new Error(ERROR_INGREDIENTS_ARRAY_REQUIRED);
        }

        if (!Array.isArray(steps) || steps.length === 0) {
          throw new Error(ERROR_STEPS_ARRAY_REQUIRED);
        }

        updatePayload.servings = Number(patch.servings ?? 0);
        updatePayload.tags = tags;
        updatePayload.ingredients = ingredients;
        updatePayload.steps = steps;
      }

      await updateRecipe(slug, updatePayload);

      if (uploadedCdnPath) {
        setEditState((s) => ({
          ...s,
          [slug]: {
            ...s[slug],
            imageCdnPath: uploadedCdnPath,
            heroFile: null,
          },
        }));
      }

      pushToast("success", STRINGS.admin.toasts.updated);
      await refresh();
    } catch (e) {
      pushToast("error", e instanceof Error ? e.message : ERROR_MESSAGE);
    } finally {
      setBusy(false);
    }
  };

  const requestDelete = (slug: string) => {
    clearMessages();
    setDeleteConfirmSlug(slug);
  };

  const cancelDelete = () => setDeleteConfirmSlug(null);

  const confirmDelete = async () => {
    if (!deleteConfirmSlug) return;
    clearMessages();
    setBusy(true);
    try {
      await deleteRecipe(deleteConfirmSlug);
      pushToast("success", "Recept obrisan.");
      setDeleteConfirmSlug(null);
      await refresh();
    } catch (e) {
      pushToast("error", e instanceof Error ? e.message : ERROR_MESSAGE);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!deleteConfirmSlug) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelDelete();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [deleteConfirmSlug]);

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-extrabold text-zinc-900">Kreiraj recept</h2>
          <div className="text-xs font-semibold text-zinc-500">
            POST → <code className="font-mono">/api/recipes</code>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_TITLE}</div>
            <input
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
              className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
              placeholder="Npr. Brzi ručak"
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-zinc-600">Slug (opcionalno)</div>
            <input
              value={createForm.slug}
              onChange={(e) => setCreateForm((f) => ({ ...f, slug: e.target.value }))}
              className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
              placeholder="npr. brzi-rucak"
            />
            <div className="text-xs text-zinc-500">
              Tip: ako ne uneseš slug, server ga generira iz naslova.
            </div>
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_LEAD}</div>
            <textarea
              value={createForm.lead}
              onChange={(e) => setCreateForm((f) => ({ ...f, lead: e.target.value }))}
              className="min-h-[84px] w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="Kratki opis (min 10 znakova)"
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_PREP_TIME_MINUTES}</div>
            <input
              type="number"
              value={createForm.prepTimeMinutes}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, prepTimeMinutes: Number(e.target.value) }))
              }
              className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
              min={1}
              max={1440}
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_SERVINGS}</div>
            <input
              type="number"
              value={createForm.servings}
              onChange={(e) => setCreateForm((f) => ({ ...f, servings: Number(e.target.value) }))}
              className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
              min={1}
              max={100}
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_DIFFICULTY}</div>
            <select
              value={createForm.difficulty}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, difficulty: e.target.value as Difficulty }))
              }
              className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 px-3 text-sm transition hover:border-zinc-300"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_DISH_GROUP}</div>
            <select
              value={createForm.dishGroup}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, dishGroup: e.target.value as DishGroup }))
              }
              className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 px-3 text-sm transition hover:border-zinc-300"
            >
              {DISH_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_COOKING_METHOD}</div>
            <select
              value={createForm.cookingMethod}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, cookingMethod: e.target.value as CookingMethod }))
              }
              className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 px-3 text-sm transition hover:border-zinc-300"
            >
              {COOKING_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_TAGS_CSV}</div>
            <input
              value={createForm.tagsCsv}
              onChange={(e) => setCreateForm((f) => ({ ...f, tagsCsv: e.target.value }))}
              className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
              placeholder="npr. brzo, slatko"
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_IMAGE_CDN_PATH}</div>
            <input
              value={createForm.imageCdnPath}
              onChange={(e) => setCreateForm((f) => ({ ...f, imageCdnPath: e.target.value }))}
              disabled={Boolean(heroFile)}
              className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
              placeholder={PLACEHOLDER_IMAGE_CDN_PATH}
            />
            <div className="mt-2 grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
              <label className="space-y-1">
                <div className="text-xs font-semibold text-zinc-600">{LABEL_HERO_UPLOAD_DEV}</div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer">
                    {LABEL_CHOOSE_FILE}
                    <input
                      type="file"
                      accept={IMAGE_MIME_ACCEPT_ATTR}
                      onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-xs text-zinc-500">
                    {heroFile ? heroFile.name : LABEL_NO_FILE_CHOSEN}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">
                  Odaberi sliku i klikni <strong>{ACTION_CREATE}</strong>. Aplikacija će nakon
                  kreiranja recepta (kad dobije finalni slug) spremiti fajl u{" "}
                  <code className="font-mono">public/cdn/recipes/&lt;final-slug&gt;/hero.*</code> i
                  upisati ispravan <code className="font-mono">{LABEL_IMAGE_CDN_PATH}</code> u bazu.
                </div>
              </label>
            </div>

            {createForm.imageCdnPath.trim() ? (
              <div className="mt-2 text-xs text-zinc-500">
                {LABEL_PREVIEW_URL}{" "}
                <code className="font-mono">{buildCdnUrl(createForm.imageCdnPath.trim())}</code>
              </div>
            ) : null}
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_INGREDIENTS_JSON}</div>
            <textarea
              value={createForm.ingredientsJson}
              onChange={(e) => setCreateForm((f) => ({ ...f, ingredientsJson: e.target.value }))}
              className="min-h-[120px] w-full rounded-xl border border-zinc-200 px-3 py-2 font-mono text-xs"
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs font-semibold text-zinc-600">{LABEL_STEPS_JSON}</div>
            <textarea
              value={createForm.stepsJson}
              onChange={(e) => setCreateForm((f) => ({ ...f, stepsJson: e.target.value }))}
              className="min-h-[120px] w-full rounded-xl border border-zinc-200 px-3 py-2 font-mono text-xs"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onCreate}
            disabled={busy}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-extrabold text-white transition hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? STRINGS.ui.working : ACTION_CREATE}
          </button>

          <button
            type="button"
            onClick={async () => {
              clearMessages();
              setBusy(true);
              try {
                await refresh();
              } catch (e) {
                pushToast("error", e instanceof Error ? e.message : ERROR_MESSAGE);
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {STRINGS.actions.refreshList}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-extrabold text-zinc-900">Postojeći recepti</h2>
          <div className="text-xs font-semibold text-zinc-500">
            PUT/DELETE → <code className="font-mono">/api/recipes/:slug</code>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {sorted.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {STRINGS.admin.empty.noRecipes}
            </div>
          ) : null}

          {sorted.map((r) => {
            const patch = editState[r.slug] ?? patchFromListItem(r);

            return (
              <div key={r.slug} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-zinc-900">{r.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-600">
                      <span className="font-mono">{r.slug}</span>
                      <span className="text-zinc-300" aria-hidden>
                        •
                      </span>
                      <Link
                        className="font-semibold hover:text-zinc-900"
                        href={`/recepti/${r.slug}`}
                      >
                        {STRINGS.admin.actions.openDetail}
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {!patch.advancedLoaded ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onLoadFull(r.slug)}
                        className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-extrabold text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {STRINGS.admin.actions.loadAll}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onUpdate(r.slug)}
                      className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-zinc-900 px-3 text-xs font-extrabold text-white transition hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {ACTION_UPDATE}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => requestDelete(r.slug)}
                      className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {ACTION_DELETE}
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <label className="space-y-1 md:col-span-2">
                    <div className="text-xs font-semibold text-zinc-600">{LABEL_TITLE}</div>
                    <input
                      value={patch.title}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [r.slug]: { ...patch, title: e.target.value },
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
                    />
                  </label>

                  <label className="space-y-1 md:col-span-2">
                    <div className="text-xs font-semibold text-zinc-600">{LABEL_LEAD}</div>
                    <textarea
                      value={patch.lead}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [r.slug]: { ...patch, lead: e.target.value },
                        }))
                      }
                      className="min-h-[70px] w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-600">
                      {LABEL_PREP_TIME_MINUTES}
                    </div>
                    <input
                      type="number"
                      value={patch.prepTimeMinutes}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [r.slug]: { ...patch, prepTimeMinutes: Number(e.target.value) },
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
                      min={1}
                      max={1440}
                    />
                  </label>

                  <label className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-600">
                      {LABEL_IMAGE_CDN_PATH}
                    </div>
                    <input
                      value={patch.imageCdnPath}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [r.slug]: { ...patch, imageCdnPath: e.target.value },
                        }))
                      }
                      disabled={Boolean(patch.heroFile)}
                      className="h-10 w-full rounded-xl border border-zinc-200 px-3 font-mono text-xs"
                      placeholder={PLACEHOLDER_IMAGE_CDN_PATH}
                    />
                    <div className="mt-2 grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                      <label className="space-y-1">
                        <div className="text-xs font-semibold text-zinc-600">
                          {LABEL_HERO_UPLOAD_DEV}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer">
                            {LABEL_CHOOSE_FILE}
                            <input
                              type="file"
                              accept={IMAGE_MIME_ACCEPT_ATTR}
                              onChange={(e) =>
                                setEditState((s) => ({
                                  ...s,
                                  [r.slug]: { ...patch, heroFile: e.target.files?.[0] ?? null },
                                }))
                              }
                              className="sr-only"
                            />
                          </label>
                          <span className="text-xs text-zinc-500">
                            {patch.heroFile ? patch.heroFile.name : LABEL_NO_FILE_CHOSEN}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500">
                          Odaberi sliku i klikni <strong>{ACTION_UPDATE}</strong>. Aplikacija će
                          uploadati fajl u{" "}
                          <code className="font-mono">public/cdn/recipes/&lt;slug&gt;/hero.*</code>{" "}
                          i upisati ispravan{" "}
                          <code className="font-mono">{LABEL_IMAGE_CDN_PATH}</code> u bazu.
                        </div>
                      </label>
                    </div>
                    {patch.imageCdnPath.trim() ? (
                      <div className="text-[11px] text-zinc-500">
                        {LABEL_PREVIEW_URL}{" "}
                        <code className="font-mono">{buildCdnUrl(patch.imageCdnPath.trim())}</code>
                      </div>
                    ) : null}
                  </label>

                  <label className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-600">{LABEL_DIFFICULTY}</div>
                    <select
                      value={patch.difficulty}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [r.slug]: { ...patch, difficulty: e.target.value as Difficulty },
                        }))
                      }
                      className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 px-3 text-sm transition hover:border-zinc-300"
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-600">{LABEL_DISH_GROUP}</div>
                    <select
                      value={patch.dishGroup}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [r.slug]: { ...patch, dishGroup: e.target.value as DishGroup },
                        }))
                      }
                      className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 px-3 text-sm transition hover:border-zinc-300"
                    >
                      {DISH_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-600">
                      {LABEL_COOKING_METHOD}
                    </div>
                    <select
                      value={patch.cookingMethod}
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [r.slug]: { ...patch, cookingMethod: e.target.value as CookingMethod },
                        }))
                      }
                      className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 px-3 text-sm transition hover:border-zinc-300"
                    >
                      {COOKING_METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {patch.advancedLoaded ? (
                  <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="text-sm font-extrabold text-zinc-900">Napredno</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="space-y-1">
                        <div className="text-xs font-semibold text-zinc-600">{LABEL_SERVINGS}</div>
                        <input
                          type="number"
                          value={patch.servings ?? 0}
                          onChange={(e) =>
                            setEditState((s) => ({
                              ...s,
                              [r.slug]: { ...patch, servings: Number(e.target.value) },
                            }))
                          }
                          className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
                          min={1}
                          max={100}
                        />
                      </label>

                      <label className="space-y-1">
                        <div className="text-xs font-semibold text-zinc-600">{LABEL_TAGS_CSV}</div>
                        <input
                          value={patch.tagsCsv ?? ""}
                          onChange={(e) =>
                            setEditState((s) => ({
                              ...s,
                              [r.slug]: { ...patch, tagsCsv: e.target.value },
                            }))
                          }
                          className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm"
                          placeholder="npr. brzo, slatko"
                        />
                      </label>

                      <label className="space-y-1 md:col-span-2">
                        <div className="text-xs font-semibold text-zinc-600">
                          {LABEL_INGREDIENTS_JSON}
                        </div>
                        <textarea
                          value={patch.ingredientsJson ?? ""}
                          onChange={(e) =>
                            setEditState((s) => ({
                              ...s,
                              [r.slug]: { ...patch, ingredientsJson: e.target.value },
                            }))
                          }
                          className="min-h-[120px] w-full rounded-xl border border-zinc-200 px-3 py-2 font-mono text-xs"
                        />
                      </label>

                      <label className="space-y-1 md:col-span-2">
                        <div className="text-xs font-semibold text-zinc-600">
                          {LABEL_STEPS_JSON}
                        </div>
                        <textarea
                          value={patch.stepsJson ?? ""}
                          onChange={(e) =>
                            setEditState((s) => ({
                              ...s,
                              [r.slug]: { ...patch, stepsJson: e.target.value },
                            }))
                          }
                          className="min-h-[120px] w-full rounded-xl border border-zinc-200 px-3 py-2 font-mono text-xs"
                        />
                      </label>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => {
          const isError = t.kind === "error";
          return (
            <div
              key={t.id}
              role={isError ? "alert" : "status"}
              className={
                "pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-lg " +
                (isError
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="whitespace-pre-wrap">{t.message}</div>
                <button
                  type="button"
                  onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                  className={
                    "-m-1 cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold opacity-80 transition hover:opacity-100 " +
                    (isError ? "text-red-900" : "text-emerald-900")
                  }
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {deleteConfirmSlug ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-[2px]"
            onClick={cancelDelete}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div id="delete-title" className="text-sm font-extrabold text-zinc-900">
                    {STRINGS.admin.confirm.deleteTitle}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600">
                    {STRINGS.admin.confirm.deleteBodyPrefix}{" "}
                    <span className="font-mono">{deleteConfirmSlug}</span>?
                  </div>
                </div>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="-m-1 cursor-pointer rounded-xl px-2 py-1 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={busy}
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {STRINGS.admin.actions.cancel}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={busy}
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {busy ? STRINGS.ui.deleting : ACTION_DELETE}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecipeAdminClient;
