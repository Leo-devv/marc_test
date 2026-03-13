"use client";

import { ProviderCard } from "@/components/provider/ProviderCard";
import { IProvider } from "@/types";

interface ResultListProps {
  allMatches: IProvider[];
}

export function ResultTabs({ allMatches }: ResultListProps) {
  if (allMatches.length === 0) return null;

  const onlineCount = allMatches.filter((p) => p.availability.isAvailableNow).length;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{allMatches.length} {allMatches.length === 1 ? "result" : "results"}</span>
        {onlineCount > 0 && (
          <>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {onlineCount} online
            </span>
          </>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {allMatches.map((provider, i) => (
          <div
            key={provider.slug}
            className="animate-card-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <ProviderCard provider={provider} />
          </div>
        ))}
      </div>
    </div>
  );
}
