"use client";

import { useState } from "react";
import { ProviderPhoto } from "@/types";

interface PhotoGalleryProps {
  photos: ProviderPhoto[];
  name: string;
  isAuthenticated: boolean;
}

export function PhotoGallery({ photos, name, isAuthenticated }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl bg-muted">
        <span className="text-5xl font-light text-muted-foreground/20">{name[0]}</span>
      </div>
    );
  }

  // Blur all non-first photos (they're placeholders) + any explicitly blurred photos for non-auth users
  const shouldBlur = (index: number, photo: ProviderPhoto) => {
    if (index > 0) return true; // all non-first photos are blurred (placeholder images)
    return !isAuthenticated && photo.isBlurred;
  };

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted sm:aspect-[2/1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[selectedIndex].url}
          alt={`${name} photo ${selectedIndex + 1}`}
          className={`h-full w-full object-cover transition-all ${
            shouldBlur(selectedIndex, photos[selectedIndex]) ? "blur-xl scale-110" : ""
          }`}
        />
        {shouldBlur(selectedIndex, photos[selectedIndex]) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="rounded-2xl border border-white/10 bg-background/95 px-8 py-5 text-center shadow-xl backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <p className="font-semibold text-sm">Private photo</p>
              <p className="mt-1 text-xs text-muted-foreground">Sign in to unlock full gallery</p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === selectedIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={`${name} thumbnail ${i + 1}`}
                className={`h-16 w-16 object-cover sm:h-20 sm:w-20 ${shouldBlur(i, photo) ? "blur-md" : ""}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
