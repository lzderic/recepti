import type { RecipeListItem } from "@/types/recipes";

export const demoRecipes: RecipeListItem[] = [
  {
    id: "1",
    slug: "palacinke",
    title: "Palačinke",
    lead: "Klasične palačinke, brzo i fino.",
    prepTimeMinutes: 25,
    difficulty: "EASY",
    dishGroup: "DESSERT",
    cookingMethod: "FRY",
    imageCdnPath: "/recipes/palacinke/hero.webp",
  },
  {
    id: "2",
    slug: "pileca-juha",
    title: "Pileća juha",
    lead: "Topla comfort hrana za svaki dan.",
    prepTimeMinutes: 60,
    difficulty: "EASY",
    dishGroup: "SOUP",
    cookingMethod: "BOIL",
    imageCdnPath: "/recipes/pileca-juha/hero.webp",
  },
  {
    id: "3",
    slug: "cokoladni-muffini",
    title: "Čokoladni muffini",
    lead: "Sočni muffini s puno kakaa.",
    prepTimeMinutes: 35,
    difficulty: "MEDIUM",
    dishGroup: "DESSERT",
    cookingMethod: "BAKE",
    imageCdnPath: "/recipes/cokoladni-muffini/hero.webp",
  },
];
