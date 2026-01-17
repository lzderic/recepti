/**
 * @file Test render helpers.
 */

import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

import { makeStore, type AppStore } from "@/test-utils/store";

/**
 * Renders a React element wrapped with a Redux Provider.
 *
 * @param {React.ReactElement} ui UI element to render.
 * @param {{ store?: AppStore; preloadedUi?: Parameters<typeof makeStore>[0] }} [opts] Optional store overrides.
 * @returns {{ store: AppStore } & ReturnType<typeof render>} Render result plus store.
 */
export const renderWithStore = (
  ui: React.ReactElement,
  opts?: { store?: AppStore; preloadedUi?: Parameters<typeof makeStore>[0] },
) => {
  const store = opts?.store ?? makeStore(opts?.preloadedUi);

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
};
