/**
 * @file API error factories and reusable error messages.
 */

import "server-only";

import { apiError } from "@/lib/server/http";

/**
 * Stable error messages used by server route handlers.
 */
export const API_MESSAGES = {
  expectedMultipartFormData: "Expected multipart/form-data",
  invalidSlug: "Invalid slug",
  missingFile: "Missing file",
  emptyFile: "Empty file",
  unsupportedImageType: "Unsupported image type",
  invalidPath: "Invalid path",
  invalidPayload: "Invalid payload",
  recipeNotFound: "Recipe not found",
  unexpectedError: "Unexpected error",
  slugCouldNotBeGenerated: "Slug could not be generated",
  recipeSlugMustBeUnique: "Recipe slug must be unique",
} as const;

/**
 * 400 Bad Request.
 *
 * @param {string} message Message.
 * @param {unknown} [details] Optional details.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const badRequest = (message: string, details?: unknown) => {
  return apiError(400, "BAD_REQUEST", message, details);
};

/**
 * 400 Validation error.
 *
 * @param {string} message Message.
 * @param {unknown} [details] Optional details.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const validationError = (message: string, details?: unknown) => {
  return apiError(400, "VALIDATION_ERROR", message, details);
};

/**
 * 413 Payload too large.
 *
 * @param {string} message Message.
 * @param {unknown} [details] Optional details.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const payloadTooLarge = (message: string, details?: unknown) => {
  return apiError(413, "BAD_REQUEST", message, details);
};

/**
 * 404 Not found.
 *
 * @param {string} message Message.
 * @param {unknown} [details] Optional details.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const notFound = (message: string, details?: unknown) => {
  return apiError(404, "NOT_FOUND", message, details);
};

/**
 * 409 Conflict.
 *
 * @param {string} message Message.
 * @param {unknown} [details] Optional details.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const conflict = (message: string, details?: unknown) => {
  return apiError(409, "CONFLICT", message, details);
};

/**
 * 500 Internal error.
 *
 * @param {string} message Message.
 * @param {unknown} [details] Optional details.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const internalError = (message: string, details?: unknown) => {
  return apiError(500, "INTERNAL", message, details);
};

/**
 * 400 when request is expected to be `multipart/form-data`.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errExpectedMultipartFormData = () =>
  badRequest(API_MESSAGES.expectedMultipartFormData);

/**
 * 400 when a slug is invalid.
 *
 * @param {unknown} [details] Optional validation details.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errInvalidSlug = (details?: unknown) =>
  validationError(API_MESSAGES.invalidSlug, details);

/**
 * 400 when a file is missing.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errMissingFile = () => validationError(API_MESSAGES.missingFile);

/**
 * 400 when a provided file is empty.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errEmptyFile = () => validationError(API_MESSAGES.emptyFile);

/**
 * 413 when a file exceeds max size.
 *
 * @param {number} maxBytes Maximum bytes.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errMaxFileSize = (maxBytes: number) =>
  payloadTooLarge(`Max file size is ${maxBytes} bytes`);

/**
 * 400 when an image MIME type is unsupported.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errUnsupportedImageType = () => validationError(API_MESSAGES.unsupportedImageType);

/**
 * 400 when a path is invalid or unsafe.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errInvalidPath = () => badRequest(API_MESSAGES.invalidPath);

/**
 * 400 when the request JSON payload is invalid.
 *
 * @param {unknown} [details] Optional validation details.
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errInvalidPayload = (details?: unknown) =>
  validationError(API_MESSAGES.invalidPayload, details);

/**
 * 404 when a recipe is not found.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errRecipeNotFound = () => notFound(API_MESSAGES.recipeNotFound);

/**
 * 500 for unexpected errors.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errUnexpectedError = () => internalError(API_MESSAGES.unexpectedError);

/**
 * 400 when a slug cannot be generated.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errSlugCouldNotBeGenerated = () => badRequest(API_MESSAGES.slugCouldNotBeGenerated);

/**
 * 409 when a slug must be unique.
 *
 * @returns {{ status: number, body: unknown }} Error payload.
 */
export const errRecipeSlugMustBeUnique = () => conflict(API_MESSAGES.recipeSlugMustBeUnique);
