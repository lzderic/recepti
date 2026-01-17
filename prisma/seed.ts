import { PrismaClient, CookingMethod, Difficulty, DishGroup } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const recipes = [
    {
      slug: "rizi-bizi",
      title: "Riži-bizi",
      lead: "Klasičan prilog od riže i graška, brzo i jednostavno.",
      prepTimeMinutes: 25,
      servings: 4,
      difficulty: Difficulty.EASY,
      dishGroup: DishGroup.MAIN,
      cookingMethod: CookingMethod.BOIL,
      tags: ["klasik", "brzo", "prilog"],
      ingredients: [
        { amount: 300, unit: "g", name: "riža" },
        { amount: 200, unit: "g", name: "grašak (smrznuti)" },
        { amount: 1, unit: "kom", name: "luk" },
        { amount: 2, unit: "žlica", name: "ulje" },
        { amount: 1, unit: "žličica", name: "sol" },
      ],
      steps: [
        { text: "Na ulju kratko prodinstajte sitno sjeckani luk." },
        { text: "Dodajte rižu, promiješajte i zalijte vodom." },
        { text: "Pred kraj kuhanja dodajte grašak i kuhajte dok sve ne omekša." },
      ],
      imageCdnPath: "/recipes/rizi-bizi/hero.svg",
      images: { hero: { cdnPath: "/recipes/rizi-bizi/hero.svg" } },
    },
    {
      slug: "cokoladni-muffini",
      title: "Čokoladni muffini",
      lead: "Sočni muffini s puno čokolade — odlični za svaku priliku.",
      prepTimeMinutes: 35,
      servings: 12,
      difficulty: Difficulty.MEDIUM,
      dishGroup: DishGroup.DESSERT,
      cookingMethod: CookingMethod.BAKE,
      tags: ["slatko", "čokolada", "muffini"],
      ingredients: [
        { amount: 2, unit: "kom", name: "jaja" },
        { amount: 120, unit: "g", name: "šećer" },
        { amount: 200, unit: "g", name: "brašno" },
        { amount: 30, unit: "g", name: "kakao" },
        { amount: 1, unit: "pak", name: "prašak za pecivo" },
        { amount: 150, unit: "ml", name: "mlijeko" },
        { amount: 80, unit: "ml", name: "ulje" },
        { amount: 120, unit: "g", name: "čokoladne kapljice" },
      ],
      steps: [
        { text: "Zagrijte pećnicu na 180°C i pripremite kalup za muffine." },
        { text: "Pomiješajte suhe sastojke, zatim dodajte mokre i kratko sjedinite." },
        { text: "Umiješajte čokoladne kapljice i pecite 18–22 minute." },
      ],
      imageCdnPath: "/recipes/cokoladni-muffini/hero.webp",
      images: { hero: { cdnPath: "/recipes/cokoladni-muffini/hero.webp" } },
    },
    {
      slug: "palacinke",
      title: "Palačinke",
      lead: "Klasične tanke palačinke za slatko ili slano.",
      prepTimeMinutes: 30,
      servings: 8,
      difficulty: Difficulty.EASY,
      dishGroup: DishGroup.DESSERT,
      cookingMethod: CookingMethod.FRY,
      tags: ["klasik", "brzo", "slatko"],
      ingredients: [
        { amount: 2, unit: "kom", name: "jaja" },
        { amount: 300, unit: "ml", name: "mlijeko" },
        { amount: 200, unit: "g", name: "brašno" },
        { amount: 1, unit: "prstohvat", name: "sol" },
        { amount: 1, unit: "žlica", name: "šećer (opcionalno)" },
      ],
      steps: [
        { text: "Umutite jaja s mlijekom, dodajte brašno i sol te izmiksajte." },
        { text: "Ostavite smjesu 10 minuta da odstoji." },
        { text: "Pecite tanke palačinke na lagano nauljenoj tavi." },
      ],
      imageCdnPath: "/recipes/palacinke/hero.svg",
      images: { hero: { cdnPath: "/recipes/palacinke/hero.svg" } },
    },
    {
      slug: "pileca-juha",
      title: "Pileća juha",
      lead: "Bistra juha s povrćem — najbolja kad treba nešto toplo.",
      prepTimeMinutes: 60,
      servings: 6,
      difficulty: Difficulty.EASY,
      dishGroup: DishGroup.SOUP,
      cookingMethod: CookingMethod.BOIL,
      tags: ["juha", "klasik", "comfort"],
      ingredients: [
        { amount: 500, unit: "g", name: "piletina (batak/krilca)" },
        { amount: 2, unit: "kom", name: "mrkva" },
        { amount: 1, unit: "kom", name: "luk" },
        { amount: 1, unit: "kom", name: "celer" },
        { amount: 1, unit: "žličica", name: "sol" },
      ],
      steps: [
        { text: "Stavite piletinu i povrće u lonac te prelijte hladnom vodom." },
        { text: "Kuhajte na lagano 45–60 min i povremeno skidajte pjenu." },
        { text: "Procijedite, začinite i poslužite s rezancima po želji." },
      ],
      imageCdnPath: "/recipes/pileca-juha/hero.svg",
      images: { hero: { cdnPath: "/recipes/pileca-juha/hero.svg" } },
    },
    {
      slug: "tuna-salata",
      title: "Tuna salata",
      lead: "Brza salata s tunom, kukuruzom i jogurtom.",
      prepTimeMinutes: 15,
      servings: 2,
      difficulty: Difficulty.EASY,
      dishGroup: DishGroup.SALAD,
      cookingMethod: CookingMethod.NO_COOK,
      tags: ["brzo", "proteini", "salata"],
      ingredients: [
        { amount: 1, unit: "konz", name: "tuna" },
        { amount: 150, unit: "g", name: "kukuruz" },
        { amount: 2, unit: "žlica", name: "jogurt" },
        { amount: 1, unit: "žlica", name: "maslinovo ulje" },
        { amount: 1, unit: "žličica", name: "limun" },
      ],
      steps: [
        { text: "Ocijedite tunu i kukuruz." },
        { text: "Pomiješajte s jogurtom, uljem i limunom." },
        { text: "Začinite po ukusu i poslužite uz salatu ili kruh." },
      ],
      imageCdnPath: "/recipes/tuna-salata/hero.svg",
      images: { hero: { cdnPath: "/recipes/tuna-salata/hero.svg" } },
    },
    {
      slug: "domaci-kruh",
      title: "Domaći kruh",
      lead: "Jednostavan kruh s hrskavom koricom.",
      prepTimeMinutes: 180,
      servings: 10,
      difficulty: Difficulty.MEDIUM,
      dishGroup: DishGroup.BREAD,
      cookingMethod: CookingMethod.BAKE,
      tags: ["kruh", "pecenje", "domaće"],
      ingredients: [
        { amount: 500, unit: "g", name: "glatko brašno" },
        { amount: 7, unit: "g", name: "suhi kvasac" },
        { amount: 320, unit: "ml", name: "voda" },
        { amount: 10, unit: "g", name: "sol" },
      ],
      steps: [
        { text: "Zamijesite tijesto i ostavite da se udvostruči (60–90 min)." },
        { text: "Oblikujte štrucu i ostavite još 30–45 min." },
        { text: "Pecite 35–40 min na 220°C uz malo pare." },
      ],
      imageCdnPath: "/recipes/domaci-kruh/hero.svg",
      images: { hero: { cdnPath: "/recipes/domaci-kruh/hero.svg" } },
    },
    {
      slug: "povrtni-wok",
      title: "Povrtni wok",
      lead: "Šareno povrće na brzinu, uz sojin umak.",
      prepTimeMinutes: 20,
      servings: 2,
      difficulty: Difficulty.EASY,
      dishGroup: DishGroup.MAIN,
      cookingMethod: CookingMethod.FRY,
      tags: ["brzo", "povrće", "wok"],
      ingredients: [
        { amount: 1, unit: "kom", name: "paprika" },
        { amount: 1, unit: "kom", name: "mrkva" },
        { amount: 150, unit: "g", name: "brokula" },
        { amount: 2, unit: "žlica", name: "sojin umak" },
        { amount: 1, unit: "žlica", name: "ulje" },
      ],
      steps: [
        { text: "Narežite povrće na tanke trakice." },
        { text: "Kratko prepecite na jakoj vatri uz miješanje." },
        { text: "Dodajte sojin umak i po potrebi žlicu vode." },
      ],
      imageCdnPath: "/recipes/povrtni-wok/hero.svg",
      images: { hero: { cdnPath: "/recipes/povrtni-wok/hero.svg" } },
    },
    {
      slug: "fritata-od-tikvica",
      title: "Fritata od tikvica",
      lead: "Sočna fritata iz pećnice, idealna za brzi ručak.",
      prepTimeMinutes: 35,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      dishGroup: DishGroup.MAIN,
      cookingMethod: CookingMethod.BAKE,
      tags: ["tikvice", "jaja", "brzo"],
      ingredients: [
        { amount: 4, unit: "kom", name: "jaja" },
        { amount: 2, unit: "kom", name: "tikvice" },
        { amount: 80, unit: "g", name: "sir" },
        { amount: 1, unit: "žlica", name: "maslinovo ulje" },
        { amount: 1, unit: "prstohvat", name: "sol i papar" },
      ],
      steps: [
        { text: "Naribajte tikvice, posolite i ocijedite višak tekućine." },
        { text: "Umutite jaja, dodajte tikvice i sir." },
        { text: "Pecite 20–25 min na 190°C dok se ne stisne." },
      ],
      imageCdnPath: "/recipes/fritata-od-tikvica/hero.svg",
      images: { hero: { cdnPath: "/recipes/fritata-od-tikvica/hero.svg" } },
    },
  ];

  for (const r of recipes) {
    await prisma.recipe.upsert({
      where: { slug: r.slug },
      create: r,
      update: r,
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
