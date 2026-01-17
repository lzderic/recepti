/**
 * @file CDN URL helper.
 */

/**
 * Builds an absolute CDN URL (when `NEXT_PUBLIC_CDN_BASE_URL`/`CDN_BASE_URL` is configured)
 * or falls back to the local Next.js `/cdn` route.
 *
 * Accepts either `"images/foo.jpg"` or `"/images/foo.jpg"` and normalizes slashes.
 *
 * @param {string} cdnPath Path relative to CDN root (with or without leading slash).
 * @returns {string} Absolute CDN URL or a same-origin `/cdn/...` URL.
 */
export const buildCdnUrl = (cdnPath: string): string => {
  // NOTE:
  // - In Next.js, only NEXT_PUBLIC_* variables are available in the browser.
  // - The assignment mentions CDN_BASE_URL, so we support both.
  const base = process.env.NEXT_PUBLIC_CDN_BASE_URL ?? process.env.CDN_BASE_URL;

  if (base && base.length > 0) {
    if (!cdnPath.startsWith("/")) return `${base}/${cdnPath}`;
    return `${base}${cdnPath}`;
  }

  // Default: same-origin fake CDN route
  if (!cdnPath.startsWith("/")) return `/cdn/${cdnPath}`;
  return `/cdn${cdnPath}`;
};
