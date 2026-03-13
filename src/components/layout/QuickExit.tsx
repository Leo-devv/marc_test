"use client";

import { useEffect } from "react";

export function QuickExit() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Don't hijack ESC when dialogs/modals/selects are open
        const active = document.activeElement;
        if (active?.tagName === "SELECT" || active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return;
        if (document.querySelector("[data-dialog-open]")) return;
        // Check for any open overlays (booking dialog, auth gate, age gate)
        const overlays = document.querySelectorAll("[role='dialog'], .fixed.z-50, .fixed.z-\\[100\\]");
        if (overlays.length > 0) return;

        window.location.href = "https://weather.com";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <button
      onClick={() => (window.location.href = "https://weather.com")}
      className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground/60 transition-colors hover:bg-secondary hover:text-muted-foreground"
      title="Quick exit (Esc)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      <span className="hidden sm:inline">Exit</span>
    </button>
  );
}
