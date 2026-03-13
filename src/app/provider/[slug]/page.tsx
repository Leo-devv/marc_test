"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProviderProfile } from "@/components/provider/ProviderProfile";
import { AuthGate } from "@/components/auth/AuthGate";
import { BookingDialog } from "@/components/provider/BookingDialog";
import { IProvider } from "@/types";

export default function ProviderDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{ ref: string } | null>(null);

  useEffect(() => {
    fetch(`/api/providers?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setProvider(null);
        else setProvider(data);
      })
      .catch(() => setProvider(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleRequestBooking = useCallback(() => {
    if (!session) {
      setShowAuthGate(true);
      return;
    }
    setShowBookingDialog(true);
  }, [session]);

  const handleBookingSubmit = useCallback(async (data: {
    date: string;
    time: string;
    duration: number;
    total: number;
  }) => {
    if (!provider) return;

    // Generate booking details
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let refCode = "";
    for (let i = 0; i < 4; i++) refCode += chars[Math.floor(Math.random() * chars.length)];
    const referenceNumber = `BK-${refCode}`;
    const whatsapp = `+34 6${Math.floor(10 + Math.random() * 90)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: provider._id || "",
        providerSlug: provider.slug,
        providerName: provider.displayName,
        providerPhoto: provider.photos[0]?.url || "",
        providerDistrict: provider.district,
        referenceNumber,
        requestedDate: data.date,
        requestedTime: data.time,
        duration: data.duration,
        rate: provider.pricing.hourly,
        totalAmount: data.total,
        contactDetails: { whatsapp },
        messages: [],
      }),
    });

    if (res.ok) {
      setShowBookingDialog(false);
      router.push("/bookings");
    }
  }, [provider, router]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
        <p className="mt-2 text-muted-foreground">
          This profile may no longer be available.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto mb-4 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back
        </button>
      </div>
      <ProviderProfile
        provider={provider}
        isAuthenticated={!!session}
        onRequestBooking={handleRequestBooking}
        bookingSubmitted={!!bookingSuccess}
      />

      {/* Booking success banner */}
      {bookingSuccess && (
        <div className="mx-auto mt-6 max-w-4xl">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950/30">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-800 dark:text-green-300">Booking request sent</p>
                <p className="mt-0.5 text-sm text-green-700 dark:text-green-400/80">
                  Your request (Ref: {bookingSuccess.ref}) has been sent to {provider.displayName}.
                  You&apos;ll be notified once they confirm.
                </p>
                <button
                  onClick={() => router.push("/bookings")}
                  className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BookingDialog
        provider={provider}
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        onSubmit={handleBookingSubmit}
      />

      {showAuthGate && (
        <AuthGate
          title="Sign in to request a booking"
          description="Create a free account to send booking requests and contact providers directly."
          onClose={() => setShowAuthGate(false)}
        />
      )}
    </div>
  );
}
