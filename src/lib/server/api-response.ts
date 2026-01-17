/**
 * @file NextResponse helpers for consistent API responses.
 */

import "server-only";

import { NextResponse } from "next/server";

/**
 * Returns an error response using an `{ status, body }` object produced by `apiError`.
 *
 * @param {{ status: number, body: unknown }} err Error payload.
 * @returns {import('next/server').NextResponse} JSON response.
 */
export const jsonError = (err: { status: number; body: unknown }) => {
  return NextResponse.json(err.body, { status: err.status });
};

/**
 * Returns a success response in the `{ data: ... }` envelope.
 *
 * @template T
 * @param {T} data Payload.
 * @param {{ status?: number }} [init] Response init.
 * @returns {import('next/server').NextResponse} JSON response.
 */
export const jsonData = <T>(data: T, init?: { status?: number }) => {
  return NextResponse.json({ data }, init);
};
