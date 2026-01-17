/**
 * @file Prisma client singleton.
 */

import "server-only";

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma client singleton (reused in development to avoid exhausting connections).
 */
export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
