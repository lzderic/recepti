/**
 * @file Sticky site header with search entry.
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { STRINGS } from "@/shared/strings";
import SearchOverlay from "./search-overlay";

const LG_MIN_WIDTH_PX = 1024;
const SIDEBAR_WIDTH_PX = 292;

/**
 * Renders the top search entry that opens the search overlay.
 *
 * @returns {JSX.Element} Header markup.
 */
const SiteHeader = () => {
  const recipeQuery = useSelector((s: RootState) => s.ui.recipeQuery);
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [snapLeft, setSnapLeft] = useState<number | null>(null);
  const anchorRef = useRef<HTMLInputElement | null>(null);

  const computeSnapLeft = useCallback(() => {
    if (typeof window === "undefined") return null;
    return window.innerWidth >= LG_MIN_WIDTH_PX ? SIDEBAR_WIDTH_PX : null;
  }, []);

  const openOverlay = useCallback(() => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) setAnchorRect(rect);
    setSnapLeft(computeSnapLeft());
    setOpen(true);
  }, [computeSnapLeft]);
  const closeOverlay = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (rect) setAnchorRect(rect);
      setSnapLeft(computeSnapLeft());
    };

    window.addEventListener("resize", update);
    const id = window.setTimeout(update, 0);

    return () => {
      window.removeEventListener("resize", update);
      window.clearTimeout(id);
    };
  }, [open, computeSnapLeft]);

  const headerValue = useMemo(() => recipeQuery, [recipeQuery]);

  return (
    <header className="sticky top-4 z-40 h-0 pointer-events-none">
      <div className="w-full px-4 lg:px-3">
        <div className="pointer-events-auto relative w-full max-w-[280px] sm:max-w-[320px]">
          <input
            ref={anchorRef}
            value={headerValue}
            readOnly
            onFocus={openOverlay}
            onMouseDown={(e) => {
              e.preventDefault();
              openOverlay();
            }}
            placeholder={STRINGS.searchOverlay.inputPlaceholder}
            className="h-9 w-full cursor-text rounded-full border border-zinc-200 bg-white/90 px-3.5 pr-9 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-500 shadow-md outline-none backdrop-blur focus:border-zinc-300"
            aria-label={STRINGS.searchOverlay.aria.searchInput}
          />
          <div
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-700"
            aria-hidden
          >
            🔍
          </div>
        </div>
      </div>

      <SearchOverlay
        open={open}
        onClose={closeOverlay}
        anchorRect={anchorRect}
        snapLeft={snapLeft}
      />
    </header>
  );
};

export default SiteHeader;
