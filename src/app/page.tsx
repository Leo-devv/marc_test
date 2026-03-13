"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Find your perfect companion
        </h1>

        <SearchBar
          onSubmit={handleSearch}
          placeholder={'Try "blonde, athletic, available tonight"'}
          autoFocus
        />

        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            "Available now",
            "Blonde, athletic",
            "Dinner date tonight",
            "Speaks French",
            "Under €200/hr",
            "Eixample",
          ].map((s) => (
            <button
              key={s}
              onClick={() => handleSearch(s)}
              className="rounded-full border border-border/60 px-3.5 py-1.5 text-sm text-muted-foreground transition-all hover:border-border hover:bg-secondary hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
