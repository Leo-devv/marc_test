"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SearchBar } from "@/components/search/SearchBar";
import { ResultTabs } from "@/components/search/ResultTabs";
import { IProvider, ParsedIntent } from "@/types";
import { Suspense } from "react";

function intentToLabel(key: string, value: unknown): string {
  const v = Array.isArray(value) ? value.join(", ") : String(value);
  switch (key) {
    case "hair": return `${v} hair`;
    case "bodyType": return `${v}`;
    case "ethnicity": return v;
    case "district": return `in ${v}`;
    case "maxPrice": return `under €${v}/hr`;
    case "availability": return `available ${v}`;
    case "languages": return `speaks ${v}`;
    case "services": return v;
    case "minAge": return `${v}+`;
    case "maxAge": return `under ${v}`;
    case "minHeight": return `${v}cm+`;
    case "maxHeight": return `under ${v}cm`;
    default: return v;
  }
}

function FlipText({ labels }: { labels: string[] }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const count = labels.length;

  useEffect(() => {
    if (count <= 1) return;
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % count);
        setAnimate(true);
      }, 150);
    }, 2000);
    return () => clearInterval(interval);
  }, [count]);

  if (count === 0) return null;

  return (
    <span className="relative inline-flex overflow-hidden align-bottom" style={{ height: "1.4em", minWidth: "3em" }}>
      <span
        key={index}
        className={`absolute inset-x-0 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-300 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {labels[index]}
      </span>
    </span>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent>({});
  const [pendingIntent, setPendingIntent] = useState<ParsedIntent>({});
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const initialQuerySent = useRef(false);
  const conversationRef = useRef<{ role: string; content: string }[]>([]);

  const sendMessage = useCallback(async (userMessage: string) => {
    setLastQuery(userMessage);
    setIsLoading(true);
    setStreamingText("");
    setAiMessage("");
    setProviders([]);

    // Extract keywords from the query for the loading state
    setPendingIntent(parsedIntent);

    conversationRef.current = [
      ...conversationRef.current,
      { role: "user", content: userMessage },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationRef.current.map((m) => ({ role: m.role, content: m.content })),
          parsedIntent,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.meta) {
              setParsedIntent(parsed.parsedIntent);
              setPendingIntent(parsed.parsedIntent);
            } else if (parsed.providers) {
              setProviders(parsed.providers.allMatches || []);
            } else if (parsed.text) {
              assistantText += parsed.text;
              setStreamingText(assistantText);
            }
          } catch {
            // skip
          }
        }
      }

      if (assistantText) {
        conversationRef.current.push({ role: "assistant", content: assistantText });
        setAiMessage(assistantText);
        setStreamingText("");
      }
    } catch {
      setAiMessage("Something went wrong. Please try again.");
      setStreamingText("");
    } finally {
      setIsLoading(false);
    }
  }, [parsedIntent]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !initialQuerySent.current) {
      initialQuerySent.current = true;
      sendMessage(q);
    }
  }, [searchParams, sendMessage]);

  // Derive loading labels from the user's raw query when no parsed intent yet
  const intentEntries = Object.entries(pendingIntent).filter(
    ([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
  );
  const loadingLabels = intentEntries.length > 0
    ? intentEntries.map(([k, v]) => intentToLabel(k, v))
    : lastQuery.split(/[,]+/).map((s) => s.trim()).filter(Boolean);

  const displayMessage = streamingText || aiMessage;

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-7xl flex-col px-4 sm:px-6">
      {/* Results area */}
      <div className="flex-1 overflow-y-auto py-6" ref={resultsRef}>

        {/* Loading state */}
        {isLoading && providers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500" style={{ animation: "glow-pulse 2s ease-in-out infinite" }}>
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="mt-4 text-sm text-foreground/60">
              {loadingLabels.length > 0 ? (
                <>
                  Looking for{" "}
                  <FlipText labels={loadingLabels} />
                </>
              ) : (
                "Searching..."
              )}
            </p>
          </div>
        )}

        {/* AI response — subtle inline note */}
        {!isLoading && displayMessage && (
          <div className="mb-4 flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-rose-400 to-pink-500">
              <span className="text-[9px] font-bold text-white">C</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{displayMessage}</p>
          </div>
        )}

        {/* Streaming text while results are showing */}
        {isLoading && providers.length > 0 && streamingText && (
          <div className="mb-4 flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-rose-400 to-pink-500">
              <span className="text-[9px] font-bold text-white">C</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {streamingText}
              <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-muted-foreground/50" />
            </p>
          </div>
        )}

        {/* Results grid */}
        {providers.length > 0 && (
          <ResultTabs allMatches={providers} isAuthenticated={!!session} />
        )}

        {/* No results initial state */}
        {!isLoading && providers.length === 0 && !displayMessage && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400/10 to-pink-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Describe what you&apos;re looking for
            </p>
          </div>
        )}
      </div>

      {/* Bottom search bar + filter pills */}
      <div className="border-t border-border/40 bg-background py-3">
        <SearchBar
          onSubmit={sendMessage}
          isLoading={isLoading}
          placeholder="Refine your search..."
          autoFocus={!searchParams.get("q")}
        />
        {intentEntries.length > 0 && !isLoading && (
          <div className="mt-2 flex flex-wrap gap-1.5 px-1">
            {intentEntries.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {intentToLabel(key, value)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
