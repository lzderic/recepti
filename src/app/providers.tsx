/**
 * @file Client-side app providers.
 */

"use client";

import { Provider } from "react-redux";
import { store as defaultStore, type AppStore } from "@/store/store";

/**
 * Application-level providers (client-side).
 *
 * @param {{ children: React.ReactNode }} props Provider props.
 * @returns {JSX.Element} Provider wrapper.
 */
export const AppProviders = ({
  children,
  store,
}: {
  children: React.ReactNode;
  store?: AppStore;
}) => <Provider store={store ?? defaultStore}>{children}</Provider>;
