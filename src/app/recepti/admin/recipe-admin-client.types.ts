/**
 * @file Types for the recipe admin client UI.
 */

/**
 * Minimal API error response shape used by the admin UI.
 */
export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
