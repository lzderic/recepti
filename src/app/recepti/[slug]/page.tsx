/**
 * @file Recipe details page.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe, getRecipes } from "@/services/recipes.server";
import { buildCdnUrl } from "@/lib/cdn";
import { formatDateHr, formatDifficultyHr, formatDishGroupHr } from "@/lib/formatters/recipes";
import { shouldUnoptimizeImage } from "@/lib/images";

/**
 * Always render dynamically (no caching) for this page.
 */
export const dynamic = "force-dynamic";

const ActionButton = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <button
    type="button"
    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
    aria-label={label}
  >
    <span className="text-zinc-600" aria-hidden>
      {icon}
    </span>
    {label}
  </button>
);

const HeroAction = ({
  label,
  icon,
  variant = "light",
}: {
  label: string;
  icon?: React.ReactNode;
  variant?: "light" | "dark";
}) => {
  const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-sm transition";

  if (variant === "dark") {
    return (
      <button type="button" className={base + " bg-white/95 text-zinc-900 hover:bg-white"}>
        {icon ? <span aria-hidden>{icon}</span> : null}
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={base + " border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"}
    >
      {icon ? (
        <span aria-hidden className="text-zinc-700">
          {icon}
        </span>
      ) : null}
      {label}
    </button>
  );
};

const MetaPill = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm">
    {icon ? (
      <span className="text-zinc-600" aria-hidden>
        {icon}
      </span>
    ) : null}
    <span className="text-zinc-600">{label}</span>
    <span className="font-extrabold text-zinc-900">{value}</span>
  </div>
);

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const recipe = await getRecipe(slug);
    return {
      title: recipe.title,
      description: recipe.lead,
      openGraph: {
        title: recipe.title,
        description: recipe.lead,
        images: [{ url: buildCdnUrl(recipe.imageCdnPath) }],
      },
    };
  } catch {
    return { title: "Recept" };
  }
};

const RecipeDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  let recipe;
  try {
    recipe = await getRecipe(slug);
  } catch {
    notFound();
  }

  const imageUrl = buildCdnUrl(recipe.imageCdnPath);
  const unoptimized = shouldUnoptimizeImage([recipe.imageCdnPath, imageUrl]);

  const dishGroup = formatDishGroupHr(recipe.dishGroup);
  const difficulty = formatDifficultyHr(recipe.difficulty);

  const createdAt = formatDateHr(recipe.createdAt);

  const related = (await getRecipes()).filter((r) => r.slug !== slug).slice(0, 4);

  return (
    <article className="space-y-12">
      <header className="cooli-pattern -mx-6 overflow-hidden bg-zinc-50 sm:rounded-2xl lg:-mx-8 2xl:-mx-10">
        <div className="w-full px-6 py-6 sm:py-8 lg:px-8 2xl:px-10">
          <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
            <div className="space-y-4">
              <nav className="text-sm text-zinc-600">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <li>
                    <Link href="/recepti" className="hover:text-zinc-900">
                      Recepti
                    </Link>
                  </li>
                  <li className="text-zinc-400" aria-hidden>
                    /
                  </li>
                  <li>
                    <Link
                      href="/recepti"
                      className="hover:text-zinc-900"
                      aria-label={`Kategorija: ${dishGroup}`}
                    >
                      {dishGroup}
                    </Link>
                  </li>
                </ol>
              </nav>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-zinc-900">{dishGroup}</div>
                    <div className="mt-1 text-xs font-semibold text-zinc-500">
                      {createdAt ? `Objavljeno ${createdAt}` : ""}
                    </div>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-extrabold tracking-[0.22em] text-zinc-900">
                    RECEPT
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="#sastojci"
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Sastojci
                  </a>
                  <a
                    href="#priprema"
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Priprema
                  </a>
                  <a
                    href="#komentari"
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900"
                  >
                    Komentari
                  </a>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <HeroAction
                    label="Spremi"
                    icon={
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                  <HeroAction
                    label="Komentiraj"
                    icon={
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
              <div className="relative aspect-[16/10]">
                <Image
                  src={imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  priority
                  unoptimized={unoptimized}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 space-y-3">
                  <h1 className="max-w-[22ch] -translate-y-1 text-[clamp(1.5rem,2.2vw,2.25rem)] font-black leading-[1.05] tracking-tight text-white sm:-translate-y-2">
                    <span className="box-decoration-clone rounded-md bg-red-600 px-2.5 py-1.5 sm:px-3 sm:py-2">
                      {recipe.title}
                    </span>
                  </h1>

                  <div className="flex flex-wrap gap-2">
                    <MetaPill
                      label="osobe"
                      value={recipe.servings}
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M4 21a8 8 0 0 1 16 0"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      }
                    />
                    <MetaPill
                      label="min"
                      value={recipe.prepTimeMinutes}
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 8v5l3 2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      }
                    />
                    <MetaPill
                      label="težina"
                      value={difficulty}
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12h6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 9v6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/55 px-4 py-3 text-sm leading-6 text-white backdrop-blur">
                {recipe.lead}
              </div>

              {recipe.tags?.length ? (
                <div className="border-t border-zinc-200 bg-white/80 backdrop-blur px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((t: string) => (
                      <span
                        key={t}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className="cooli-pattern -mx-6 overflow-hidden bg-zinc-50 sm:rounded-2xl lg:-mx-8 2xl:-mx-10">
        <div className="w-full px-6 py-10 lg:px-8 2xl:px-10">
          <div className="grid gap-10 lg:grid-cols-[340px_1fr]">
            <section id="sastojci" className="scroll-mt-28">
              <h2 className="text-4xl font-black tracking-tight text-zinc-900">Sastojci</h2>
              <div className="mt-2 text-sm font-semibold text-zinc-600">
                za {recipe.servings} osobe
              </div>

              <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <ul className="space-y-3">
                  {recipe.ingredients.map((i, idx: number) => (
                    <li key={`${i.name}-${idx}`} className="text-sm text-zinc-900">
                      <span className="font-extrabold text-zinc-900">
                        {i.amount ?? ""}
                        {i.amount ? " " : ""}
                        {i.unit ?? ""}
                      </span>{" "}
                      <span className="font-medium text-zinc-800">{i.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-red-700"
                >
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15"
                    aria-hidden
                  >
                    +
                  </span>
                  Dodaj na popis za kupnju
                </button>
              </div>
            </section>

            <section id="priprema" className="scroll-mt-28">
              <h2 className="text-4xl font-black tracking-tight text-zinc-900">Priprema</h2>

              <ol className="mt-6 space-y-6">
                {recipe.steps.map((s, idx: number) => (
                  <li key={`${idx}-${s.text.slice(0, 16)}`} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-yellow-300 text-sm font-black text-zinc-900 shadow-sm">
                        {idx + 1}.
                      </div>
                    </div>
                    <div className="pt-2 text-sm leading-7 text-zinc-800">{s.text}</div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </section>

      <section className="-mx-6 overflow-hidden rounded-2xl bg-emerald-500 lg:-mx-8 2xl:-mx-10">
        <div className="w-full px-6 py-10 lg:px-8 2xl:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-3xl font-black tracking-tight text-white">
                Kako je tebi ispao recept?
              </div>
              <div className="mt-2 text-sm font-semibold text-emerald-50">
                Poslikaj i pohvali se! :)
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-red-700"
            >
              Dodaj sliku
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      <section id="komentari" className="scroll-mt-28 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">Još nema komentara</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Budi prvi/va, podijeli svoje mišljenje o receptu.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-red-700"
          >
            Napiši komentar
            <span aria-hidden>→</span>
          </button>
        </div>
      </section>

      {related.length ? (
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900">
            Slični recepti, a opet različiti
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r, idx) => {
              const rImageUrl = buildCdnUrl(r.imageCdnPath);
              const rUnoptimized = shouldUnoptimizeImage([r.imageCdnPath, rImageUrl]);
              return (
                <Link
                  key={r.slug}
                  href={`/recepti/${r.slug}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                    <Image
                      src={rImageUrl}
                      alt={r.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={idx < 1}
                      unoptimized={rUnoptimized}
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-zinc-900 group-hover:text-red-700">
                      {r.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-zinc-600">{r.lead}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-2">
        <ActionButton
          label="Ispiši"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 8V3h10v5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path
                d="M7 17h10v4H7v-4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M5 10h14a2 2 0 0 1 2 2v5h-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 17H1v-5a2 2 0 0 1 2-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
        />
        <Link
          href="/recepti"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
        >
          ← Natrag na listu
        </Link>
      </section>
    </article>
  );
};

export default RecipeDetailsPage;
