/**
 * @file Slug validation and generation (server-only).
 */

import "server-only";

import slugify from "slugify";

/**
 * Slug validator: lowercase alphanumerics separated by single dashes.
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates a slug using `SLUG_REGEX`.
 *
 * @param {string} slug Slug candidate.
 * @returns {boolean} Whether the slug is valid.
 */
export const isValidSlug = (slug: string): boolean => {
  return SLUG_REGEX.test(slug);
};

/**
 * Generates a URL-safe slug from free-form input.
 *
 * @param {string} input Free-form input.
 * @returns {string} Slug.
 */
export const makeSlug = (input: string): string => {
  return slugify(input, { lower: true, strict: true, trim: true });
};
