/**
 * @file Runtime environment validation.
 */

import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CDN_BASE_URL: z.string().min(1).optional(),
  CDN_BASE_URL: z.string().min(1).optional(),
});

/**
 * Validated environment variables used by the frontend/server runtime.
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Reads and validates environment variables.
 *
 * @throws When required variables are invalid.
 */
export const getEnv = (): Env => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_CDN_BASE_URL: process.env.NEXT_PUBLIC_CDN_BASE_URL,
    CDN_BASE_URL: process.env.CDN_BASE_URL,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid environment variables: ${issues}`);
  }

  return parsed.data;
};
