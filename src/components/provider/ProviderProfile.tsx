"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IProvider } from "@/types";
import { PhotoGallery } from "./PhotoGallery";

interface ProviderProfileProps {
  provider: IProvider;
  isAuthenticated: boolean;
  onRequestBooking: () => void;
}

const langNames: Record<string, string> = {
  es: "Spanish", en: "English", ca: "Catalan", fr: "French", it: "Italian",
  pt: "Portuguese", de: "German", ru: "Russian", ar: "Arabic", ja: "Japanese",
  sv: "Swedish", nl: "Dutch", pl: "Polish", ro: "Romanian", uk: "Ukrainian",
  el: "Greek", fi: "Finnish", hi: "Hindi", vi: "Vietnamese", ga: "Irish",
  ur: "Urdu", id: "Indonesian",
};

function getAvailabilitySummary(provider: IProvider): string {
  const schedule = provider.availability.schedule;
  if (!schedule.length) return "Contact for availability";
  const days = new Set(schedule.map((s) => s.dayOfWeek));
  if (days.size === 7) {
    const start = schedule[0].startTime;
    const end = schedule[0].endTime;
    return `Daily · ${start} – ${end}`;
  }
  if (days.size >= 5) return "Most days · Flexible hours";
  return "Select days · By appointment";
}

export function ProviderProfile({ provider, isAuthenticated, onRequestBooking }: ProviderProfileProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <PhotoGallery photos={provider.photos} name={provider.displayName} isAuthenticated={isAuthenticated} />

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{provider.displayName}</h1>
              {provider.verification.idVerified && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white" title="ID Verified">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>
            <p className="mt-1 text-lg text-muted-foreground">
              {provider.district}, Barcelona · {provider.age} years old
            </p>
          </div>

          <p className="text-base leading-relaxed text-foreground/80">{provider.bio}</p>

          <Separator />

          <div>
            <h3 className="mb-3 font-semibold">Services</h3>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((s) => (
                <Badge key={s} variant="secondary" className="capitalize">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {provider.languages.map((l) => (
                <Badge key={l} variant="outline">
                  {langNames[l] || l.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-muted-foreground">Hair</p>
                <p className="mt-0.5 font-medium capitalize">{provider.appearance.hair}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-muted-foreground">Body</p>
                <p className="mt-0.5 font-medium capitalize">{provider.appearance.bodyType}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-muted-foreground">Height</p>
                <p className="mt-0.5 font-medium">{provider.appearance.height}cm</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-muted-foreground">Ethnicity</p>
                <p className="mt-0.5 font-medium">{provider.appearance.ethnicity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold">€{provider.pricing.hourly}</span>
                  <span className="ml-1 text-sm text-muted-foreground">/ hr</span>
                </div>
                {provider.availability.isAvailableNow ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">By appointment</span>
                )}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {getAvailabilitySummary(provider)}
              </p>

              <Separator className="my-4" />

              <div className="flex flex-wrap gap-1.5">
                {provider.verification.idVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ID Verified
                  </span>
                )}
                {provider.verification.phoneVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Phone
                  </span>
                )}
                {provider.verification.photosVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Photos
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onRequestBooking}
              className="w-full rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-4 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
            >
              Request Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
