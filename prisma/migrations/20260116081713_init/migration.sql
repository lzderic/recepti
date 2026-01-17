-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "DishGroup" AS ENUM ('MAIN', 'DESSERT', 'BREAD', 'APPETIZER', 'SALAD', 'SOUP');

-- CreateEnum
CREATE TYPE "CookingMethod" AS ENUM ('BAKE', 'FRY', 'BOIL', 'GRILL', 'NO_COOK');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "prepTimeMinutes" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "dishGroup" "DishGroup" NOT NULL,
    "cookingMethod" "CookingMethod" NOT NULL,
    "tags" TEXT[],
    "ingredients" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "imageCdnPath" TEXT NOT NULL,
    "images" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_slug_key" ON "Recipe"("slug");
