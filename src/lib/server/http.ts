/**
 * @file Server-side API error payload helpers.
 */

import "server-only";

export type { ApiErrorBody, ApiErrorCode } from "@/lib/http/api-error";
import type { ApiErrorBody, ApiErrorCode } from "@/lib/http/api-error";

/**
 * Constructs the canonical `{ status, body }` error payload used by route handlers.
 *
 * @param {number} status HTTP status.
 * @param {ApiErrorCode} code Error code.
 * @param {string} message Human-readable message.
 * @param {unknown} [details] Optional structured details.
 * @returns {{ status: number, body: ApiErrorBody }} Error payload.
 */
export const apiError = (
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: unknown,
) => {
  return {
    status,
    body: { error: { code, message, details } } satisfies ApiErrorBody,
  };
};
