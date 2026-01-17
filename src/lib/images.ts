/**
 * @file Image/file extension helpers.
 */

/**
 * Returns `true` when the provided path/name ends with `.svg` (case-insensitive).
 *
 * Useful for Next.js Image decisions where SVGs are typically served unoptimized.
 *
 * @param {string} value Path or filename.
 * @returns {boolean} Whether the value ends with `.svg`.
 */
export const isSvg = (value: string) => value.trim().toLowerCase().endsWith(".svg");

/**
 * Returns `true` if any provided path points to an SVG.
 *
 * Accepts nullable/undefined entries to make callers simpler.
 *
 * @param {(string|null|undefined)[]} paths Candidate paths.
 * @returns {boolean} Whether any entry is an SVG.
 */
export const shouldUnoptimizeImage = (paths: Array<string | null | undefined>) =>
  paths.some((p) => (typeof p === "string" ? isSvg(p) : false));

/**
 * MIME types supported by the upload pipeline and `<input accept>`.
 */
export const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
] as const;

export type SupportedImageMime = (typeof SUPPORTED_IMAGE_MIME_TYPES)[number];

/**
 * Value for an `<input type="file" accept>` attribute.
 *
 * @returns {string} Comma-separated MIME types.
 */
export const IMAGE_MIME_ACCEPT_ATTR = SUPPORTED_IMAGE_MIME_TYPES.join(",");

/**
 * Normalizes a file extension into one of the supported extensions.
 *
 * - Ensures a leading dot.
 * - Lowercases.
 * - Converts `.jpeg` to `.jpg`.
 *
 * Returns `null` for unsupported extensions.
 *
 * @param {string} ext File extension with or without leading dot.
 * @returns {string|null} Normalized extension or `null`.
 */
export const normalizeImageExt = (ext: string): string | null => {
  const e = ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  if (e === ".jpeg") return ".jpg";
  if ([".jpg", ".png", ".webp", ".svg"].includes(e)) return e;
  return null;
};

/**
 * Maps a MIME type to a normalized extension.
 *
 * Returns `null` for unsupported/unknown MIME types.
 *
 * @param {string} mime MIME type.
 * @returns {string|null} Normalized extension or `null`.
 */
export const imageExtFromMime = (mime: string): string | null => {
  const m = mime.trim().toLowerCase();
  switch (m) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/svg+xml":
      return ".svg";
    default:
      return null;
  }
};

/**
 * Extracts an extension from a filename and normalizes it.
 *
 * Returns `null` when the filename has no extension or it is unsupported.
 *
 * @param {string} fileName Filename.
 * @returns {string|null} Normalized extension or `null`.
 */
export const imageExtFromName = (fileName: string): string | null => {
  const m = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  if (!m) return null;
  return normalizeImageExt(`.${m[1]}`);
};

/**
 * Derives the most likely extension from a `File`-like object.
 *
 * Prefers MIME type (more reliable), then falls back to parsing the name.
 *
 * @param {{type?: (string|null), name?: (string|null)}} file File-like object.
 * @returns {string|null} Normalized extension or `null`.
 */
export const imageExtFromFile = (file: {
  type?: string | null;
  name?: string | null;
}): string | null => {
  const byMime = typeof file.type === "string" ? imageExtFromMime(file.type) : null;
  if (byMime) return byMime;
  const byName = typeof file.name === "string" ? imageExtFromName(file.name) : null;
  return byName;
};
