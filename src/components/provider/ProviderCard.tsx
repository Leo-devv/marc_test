"use client";

import { useState } from "react";
import Link from "next/link";
import { IProvider } from "@/types";

interface ProviderCardProps {
  provider: IProvider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const mainPhoto = provider.photos[0];
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/provider/${provider.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-muted aspect-[3/4]">
        {mainPhoto && !imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={mainPhoto.url}
            alt={provider.displayName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
            <span className="text-4xl font-light text-primary/25">{provider.displayName[0]}</span>
          </div>
        )}

        {/* Online dot */}
        {provider.availability.isAvailableNow && (
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            <span className="text-[10px] font-medium text-white">Online</span>
          </div>
        )}

        {/* Verified */}
        {provider.verification.idVerified && (
          <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}

        {/* Bottom info overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent px-3 pb-2.5 pt-10">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">{provider.displayName}, {provider.age}</h3>
              <p className="text-[11px] text-white/70">{provider.district}</p>
            </div>
            <span className="text-sm font-semibold text-white">€{provider.pricing.hourly}</span>
          </div>
          <div className="mt-1.5 flex gap-1">
            <span className="rounded-full bg-white/15 px-1.5 py-px text-[9px] font-medium text-white/80 capitalize backdrop-blur-sm">{provider.appearance.hair}</span>
            <span className="rounded-full bg-white/15 px-1.5 py-px text-[9px] font-medium text-white/80 capitalize backdrop-blur-sm">{provider.appearance.bodyType}</span>
            <span className="rounded-full bg-white/15 px-1.5 py-px text-[9px] font-medium text-white/80 backdrop-blur-sm">{provider.appearance.height}cm</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
