"use client";

import { signIn } from "next-auth/react";

interface AuthGateProps {
  title?: string;
  description?: string;
  onClose?: () => void;
}

export function AuthGate({ title, description, onClose }: AuthGateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="animate-overlay-in fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="animate-dialog-slide-up sm:animate-dialog-in relative z-50 mx-4 w-full max-w-md rounded-t-2xl border border-border/60 bg-card p-6 shadow-2xl sm:rounded-2xl sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400/15 to-pink-500/15">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{title || "Sign in required"}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description || "Create a free account to access this feature."}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => signIn(undefined, { callbackUrl: window.location.href })}
            className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105 active:scale-[0.98]"
          >
            Continue to sign in
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
            >
              Not now
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground/50">
          Free to create · Anonymous alias assigned · No personal info shared
        </p>
      </div>
    </div>
  );
}
