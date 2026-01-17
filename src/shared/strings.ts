/**
 * @file Centralized UI strings.
 */

/**
 * Centralized UI copy/labels used throughout the app.
 *
 * Treat keys as part of the public UI contract (stable identifiers).
 */
export const STRINGS = {
  app: {
    name: "Recepti",
  },

  errors: {
    generic: "Nešto je pošlo krivo.",
    unexpectedApiResponse: "Unexpected API response",
    selectHeroOrCdnPath: "Odaberi hero sliku ili unesi imageCdnPath.",
    titleRequired: "Naslov je obavezan (min 3 znaka).",
    leadRequired: "Lead je obavezan (min 10 znakova).",
    ingredientsJsonInvalid: "Ingredients JSON nije validan.",
    stepsJsonInvalid: "Steps JSON nije validan.",
    ingredientsArrayRequired: "Ingredients mora biti JSON array s barem jednim itemom.",
    stepsArrayRequired: "Steps mora biti JSON array s barem jednim itemom.",
  },

  nav: {
    main: {
      home: "Naslovica",
      foodhacks: "Foodhacks",
      coolie: "Coolie",
      greenCorner: "Zeleni kutak",
      inspiration: "Inspiracija",
    },
    recipes: {
      new: "Novi",
      popular: "Popularni",
      video: "Video recepti",
      featured: "Izbor",
      recipeOfDay: "Recept dana",
    },
    admin: "Admin",
    explore: {
      dishes: "Jela",
      ingredients: "Namirnice",
      images: "Slike",
      blog: "Blog",
      people: "Ljudi",
    },
    footer: {
      registration: "Registracija",
      newsletter: "Newsletter",
      glossary: "Rječnik",
      contact: "Kontakt",
      impressum: "Impressum",
      howToUse: "Kako koristiti aplikaciju",
    },
  },

  labels: {
    title: "Naslov",
    lead: "Lead",
    prepTimeMinutes: "Vrijeme (min)",
    servings: "Porcije",
    difficulty: "Težina",
    dishGroup: "Grupa jela",
    cookingMethod: "Način pripreme",
    tagsCsv: "Tagovi (CSV)",
    imageCdnPath: "imageCdnPath",
    ingredientsJson: "Ingredients (JSON)",
    stepsJson: "Steps (JSON)",
    heroUploadDev: "Hero image upload (dev)",
  },

  actions: {
    create: "Kreiraj",
    update: "Update",
    delete: "Delete",
    refreshList: "Osvježi listu",
  },

  ui: {
    chooseFile: "Choose file",
    noFileChosen: "No file chosen",
    previewUrl: "Preview URL:",
    working: "Radi…",
    deleting: "Deleting…",
  },

  searchOverlay: {
    inputPlaceholder: "Što ti se danas jede?",
    clearAll: "Očisti sve",
    aria: {
      resultsPanel: "Rezultati pretrage",
      closeBackdrop: "Zatvori pretragu",
      closeButton: "Zatvori",
      dialog: "Pretraga recepata",
      searchInput: "Pretraži recepte",
    },
    results: {
      title: "Pronašli smo…",
      loading: "Učitavanje…",
      fetchError: "Greška pri dohvaćanju",
      recipeCountLabel: "recepata",
      openHint: "Klik na karticu otvara recept",
      noMatches: "Nema rezultata za odabrane filtere.",
    },
    chips: {
      featured: "Izbor",
      hasVideo: "Imaju Video",
    },
    sections: {
      difficulty: "TEŽINA PRIPREME",
      dishGroup: "GRUPA JELA",
      cookingMethod: "NAČIN PRIPREME",
    },
  },

  admin: {
    actions: {
      loadAll: "Učitaj sve",
      openDetail: "Otvori detalj",
      cancel: "Cancel",
    },
    empty: {
      noRecipes: "Nema recepata.",
    },
    toasts: {
      created: "Recept kreiran.",
      updated: "Recept ažuriran.",
    },
    confirm: {
      deleteTitle: "Delete recipe",
      deleteBodyPrefix: "Are you sure you want to delete",
    },
  },

  placeholders: {
    imageCdnPath: "/recipes/<slug>/hero.jpg",
  },

  pages: {
    recipes: {
      title: "Recepti",
      description: "Lista recepata.",
      intro: "Inspiriraj se i pronađi nešto fino za danas.",
    },
  },
} as const;
