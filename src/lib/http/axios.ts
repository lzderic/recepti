/**
 * @file Axios wrapper helpers.
 */

import axios, { type AxiosRequestConfig } from "axios";

import { prettyApiError } from "@/lib/http/api-error";

/**
 * Shared Axios instance for client/server HTTP calls.
 */
export const http = axios.create({
  timeout: 15_000,
});

/**
 * Normalizes Axios' response body into `null` for empty/undefined values.
 */
const normalizeBody = (data: unknown) => {
  if (data === "") return null;
  return data ?? null;
};

/**
 * Performs an HTTP request and returns a JSON body.
 *
 * Uses `validateStatus: () => true` and throws for non-2xx statuses with a
 * user-friendly message.
 *
 * @template T
 * @param {import('axios').AxiosRequestConfig} config Axios config.
 * @returns {Promise<T>} Parsed JSON body.
 */
export const requestJsonOrThrow = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const res = await http.request({
    ...config,
    validateStatus: () => true,
  });

  const body = normalizeBody(res.data);

  if (res.status < 200 || res.status >= 300) {
    throw new Error(prettyApiError(res.status, body));
  }

  return body as T;
};

/**
 * Performs an HTTP request where the response body is ignored.
 *
 * @param opts.okStatus Expected status or list of statuses (defaults to 200/204).
 * @param {import('axios').AxiosRequestConfig} config Axios config.
 * @param {{ okStatus?: number | number[] }} [opts] Options.
 * @returns {Promise<void>} Resolves when status is OK.
 * @throws For unexpected statuses.
 */
export const requestVoidOrThrow = async (
  config: AxiosRequestConfig,
  opts?: { okStatus?: number | number[] },
): Promise<void> => {
  const ok = opts?.okStatus ?? [200, 204];
  const okStatuses = Array.isArray(ok) ? ok : [ok];

  const res = await http.request({
    ...config,
    validateStatus: () => true,
  });

  if (okStatuses.includes(res.status)) return;

  const body = normalizeBody(res.data);
  throw new Error(prettyApiError(res.status, body));
};
