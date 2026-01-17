/**
 * @file Client-side upload API service.
 */

import { requestJsonOrThrow } from "@/lib/http/axios";
import { requireNonEmptyString } from "@/lib/http/unwrap";

/**
 * Response shape for the recipe hero upload endpoint.
 *
 * `cdnPath` is expected to be present on success.
 */
export type UploadRecipeHeroResponse = {
  data?: {
    cdnPath?: string;
  };
};

/**
 * Uploads a recipe hero image and returns the resulting CDN path.
 *
 * @param {string} slug Recipe slug to associate with the image.
 * @param {File} file Image file.
 * @returns {Promise<string>} CDN path returned by the API.
 */
export const uploadRecipeHeroImage = async (slug: string, file: File) => {
  const form = new FormData();
  form.set("slug", slug);
  form.set("file", file);

  const json = await requestJsonOrThrow<UploadRecipeHeroResponse>({
    url: "/api/uploads/recipe-hero",
    method: "POST",
    data: form,
  });

  return requireNonEmptyString(json.data?.cdnPath);
};
