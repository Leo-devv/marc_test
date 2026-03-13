"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const alias = (session?.user as Record<string, unknown>)?.alias as string || session?.user?.email || "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 5.2c-.9-1.5-2.3-2.4-4.2-2.4C7 2.8 4.5 5.6 4.5 9.5c0 3.8 2.4 6.5 5.7 6.5 2 0 3.4-1 4.3-2.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="16" cy="4" r="1.3" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight">Concierge</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-[11px] font-bold text-white transition-opacity hover:opacity-90"
              >
                {alias[0]?.toUpperCase() || "U"}
              </button>

              {menuOpen && (
                <div className="animate-dialog-in absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-card p-1.5 shadow-lg">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{alias}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                  <div className="my-1 h-px bg-border/60" />
                  <Link
                    href="/bookings"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    My Bookings
                  </Link>
                  <div className="my-1 h-px bg-border/60" />
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: pathname })}
              className="rounded-lg bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
