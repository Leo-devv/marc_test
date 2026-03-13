"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ onSubmit, isLoading, placeholder, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSubmit(query.trim());
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "What are you looking for?"}
          disabled={isLoading}
          className="w-full rounded-2xl border border-border/60 bg-card px-5 py-4 pr-14 text-base shadow-lg transition-all placeholder:text-muted-foreground/50 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30"
        >
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          )}
        </button>
      </div>
    </form>
  );
}
