/**
 * @file API error type guards and formatters.
 */

/**
 * Canonical error codes returned by API route handlers.
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "INTERNAL";

/**
 * Standard API error response body.
 */
export type ApiErrorBody = {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

/**
 * Type guard for `ApiErrorBody`.
 *
 * @param {unknown} value Candidate value.
 * @returns {boolean} Whether the value matches `ApiErrorBody`.
 */
export const isApiErrorBody = (value: unknown): value is ApiErrorBody => {
  if (!value || typeof value !== "object") return false;
  const v = value as { error?: unknown };
  if (!v.error || typeof v.error !== "object") return false;
  const e = v.error as { code?: unknown; message?: unknown };
  return typeof e.code === "string" && typeof e.message === "string";
};

/**
 * Converts an HTTP status + response body into a readable error message.
 *
 * @param {number} status HTTP status.
 * @param {unknown} body Response body.
 * @returns {string} Readable message.
 */
export const prettyApiError = (status: number, body: unknown) => {
  if (isApiErrorBody(body)) return `${status} ${body.error.code}: ${body.error.message}`;
  if (typeof body === "string") return `${status}: ${body}`;
  return `${status}: Unexpected error`;
};
