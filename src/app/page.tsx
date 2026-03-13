"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { IProvider } from "@/types";

const SCENARIOS = [
  {
    query: "Slim, blonde",
    match: (p: IProvider) =>
      p.appearance.bodyType === "slim" &&
      p.appearance.hair === "blonde",
  },
  {
    query: "Redhead, available now",
    match: (p: IProvider) =>
      (p.appearance.hair === "red" || p.appearance.hair === "auburn") &&
      p.availability.isAvailableNow,
  },
  {
    query: "Athletic, speaks French",
    match: (p: IProvider) =>
      p.appearance.bodyType === "athletic" &&
      p.languages.includes("fr"),
  },
  {
    query: "Petite, under €200",
    match: (p: IProvider) =>
      p.appearance.bodyType === "petite" &&
      p.pricing.hourly <= 200,
  },
  {
    query: "Curvy, Latina",
    match: (p: IProvider) =>
      p.appearance.bodyType === "curvy" &&
      p.appearance.ethnicity === "Latina",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [providers, setProviders] = useState<IProvider[]>([]);

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProviders(data); })
      .catch(() => {});
  }, []);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 pb-8 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-rose-400/8 via-pink-500/5 to-transparent blur-3xl" />
        </div>

        <div className="relative w-full max-w-xl space-y-5 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your evening,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
              curated
            </span>
          </h1>
          <p className="mx-auto max-w-md text-base text-muted-foreground">
            We find, contact and confirm your booking — discreetly. All you have to do is show up.
          </p>

          <div className="pt-1">
            <SearchBar
              onSubmit={handleSearch}
              placeholder={'Try "red hair, slim, available tonight"'}
              autoFocus
            />
          </div>

        </div>
      </section>

      {/* Search like you think */}
      {providers.length > 0 && (
        <section className="border-t border-border/30 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-2.5">
            <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground/40">
              Try a search
            </p>

            {SCENARIOS.map((s, i) => {
              const matched = providers.filter(s.match).slice(0, 5);
              if (matched.length === 0) return null;

              return (
                <button
                  key={i}
                  onClick={() => handleSearch(s.query)}
                  className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all hover:bg-card hover:shadow-sm"
                >
                  {/* Avatar stack */}
                  <div className="flex flex-shrink-0 -space-x-2.5">
                    {matched.slice(0, 3).map((p) => (
                      <div key={p.slug} className="h-9 w-9 overflow-hidden rounded-full border-2 border-background bg-muted">
                        {p.photos[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={p.photos[0].url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                            <span className="text-xs text-primary/40">{p.displayName[0]}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {matched.length > 3 && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-secondary text-[10px] font-semibold text-muted-foreground">
                        +{matched.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Query */}
                  <p className="flex-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {s.query}
                  </p>

                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-muted-foreground/20 transition-all group-hover:translate-x-0.5 group-hover:text-primary"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Trust bar */}
      <section className="border-t border-border/30 px-4 py-8">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground/60">
          <span className="inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            Verified profiles
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            Anonymous aliases
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            End-to-end encrypted
          </span>
        </div>
      </section>
    </div>
  );
}
