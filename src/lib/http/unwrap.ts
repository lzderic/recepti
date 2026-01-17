/**
 * @file Helpers for unwrapping JSON API responses.
 */

import { STRINGS } from "@/shared/strings";

/**
 * Extracts `data` from an API response and asserts it is an array.
 *
 * @template T
 * @param {{ data?: T[] }} json API response.
 * @param {string} [message] Error message.
 * @returns {T[]} Array data.
 * @throws When `data` is missing or not an array.
 */
export const unwrapArrayData = <T>(
  json: { data?: T[] },
  message: string = STRINGS.errors.unexpectedApiResponse,
): T[] => {
  const data = json.data;
  if (!Array.isArray(data)) throw new Error(message);
  return data;
};

/**
 * Extracts `data` from an API response and asserts it is present.
 *
 * @template T
 * @param {{ data?: T }} json API response.
 * @param {string} [message] Error message.
 * @returns {T} Data.
 * @throws When `data` is `null` or `undefined`.
 */
export const unwrapData = <T>(
  json: { data?: T },
  message: string = STRINGS.errors.unexpectedApiResponse,
): T => {
  const data = json.data;
  if (data === undefined || data === null) throw new Error(message);
  return data;
};

/**
 * Asserts that a value is a non-empty string.
 *
 * @param {unknown} value Candidate value.
 * @param {string} [message] Error message.
 * @returns {string} Trimmed string.
 * @throws When the value is not a string or is blank.
 */
export const requireNonEmptyString = (
  value: unknown,
  message: string = STRINGS.errors.unexpectedApiResponse,
): string => {
  if (typeof value !== "string") throw new Error(message);
  const trimmed = value.trim();
  if (!trimmed) throw new Error(message);
  return trimmed;
};
