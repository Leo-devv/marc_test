"use client";

import { useEffect, useState } from "react";

export function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const confirmed = localStorage.getItem("age_verified");
    if (!confirmed) setShow(true);
  }, []);

  if (!show) return null;

  const confirm = () => {
    localStorage.setItem("age_verified", "1");
    setShow(false);
  };

  const deny = () => {
    window.location.href = "https://google.com";
  };

  return (
    <div className="animate-overlay-in fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div role="dialog" aria-modal="true" className="animate-dialog-in mx-4 w-full max-w-lg rounded-2xl border border-border/20 bg-card p-8 shadow-2xl sm:p-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border/60 bg-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Age Verification Required</h2>
            <p className="text-sm text-muted-foreground">Restricted content ahead</p>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed text-foreground/80">
          This website contains content intended exclusively for adults aged 18 and over.
          By proceeding, you confirm that you meet the minimum age requirement in your jurisdiction
          and consent to viewing adult material.
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/60">
          We are committed to preventing minors from accessing this platform.
          Misrepresenting your age is a violation of our Terms of Service and may be subject to legal action.
          We comply with all applicable age verification regulations.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            onClick={confirm}
            className="flex-1 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 active:scale-[0.98]"
          >
            I confirm I am 18 or older
          </button>
          <button
            onClick={deny}
            className="flex-1 rounded-xl border border-border/60 px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
