"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IBooking } from "@/types";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Awaiting response", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
  confirmed: { label: "Confirmed", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" },
  declined: { label: "Declined", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" },
  completed: { label: "Completed", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
  cancelled: { label: "Cancelled", color: "text-muted-foreground", bg: "bg-muted/50 border-border" },
};

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === tomorrow) return "Tomorrow";
  if (dateStr === "tonight") return "Tonight";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

export default function BookingsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [revealedContacts, setRevealedContacts] = useState<Set<string>>(new Set());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/bookings");
      return;
    }
    if (authStatus === "authenticated") {
      fetchBookings().finally(() => setLoading(false));
    }
  }, [authStatus, router, fetchBookings]);

  // Poll while any booking is pending
  useEffect(() => {
    const hasPending = bookings.some((b) => b.status === "pending");
    if (hasPending && !pollRef.current) {
      pollRef.current = setInterval(fetchBookings, 5000);
    }
    if (!hasPending && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [bookings, fetchBookings]);

  const cancelBooking = async (id: string) => {
    setCancellingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
        );
      }
    } catch {
      // ignore
    } finally {
      setCancellingId(null);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {bookings.length === 0
            ? "You haven't made any bookings yet."
            : `${bookings.length} booking${bookings.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400/10 to-pink-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          </div>
          <p className="font-medium">No bookings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse providers and send a booking request to get started.
          </p>
          <Link
            href="/"
            className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse providers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const sc = statusConfig[booking.status] || statusConfig.pending;
            const isRevealed = revealedContacts.has(booking._id!);

            return (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
              >
                <div className="flex gap-4 p-5">
                  {/* Provider photo */}
                  <Link href={`/provider/${booking.providerSlug}`} className="flex-shrink-0">
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted">
                      {booking.providerPhoto ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={booking.providerPhoto}
                          alt={booking.providerName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                          <span className="text-lg font-light text-primary/30">
                            {booking.providerName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Booking info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/provider/${booking.providerSlug}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {booking.providerName}
                        </Link>
                        <p className="text-xs text-muted-foreground">{booking.providerDistrict}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${sc.bg} ${sc.color}`}>
                        {booking.status === "pending" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        )}
                        {sc.label}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span>{formatDate(booking.requestedDate)}{booking.requestedTime ? ` · ${booking.requestedTime}` : ""}</span>
                      <span>{booking.duration}h</span>
                      <span className="font-medium text-foreground">€{booking.totalAmount}</span>
                    </div>

                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      Ref: {booking.referenceNumber}
                      {booking.createdAt && (
                        <> · {new Date(booking.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Pending state */}
                {booking.status === "pending" && (
                  <div className="border-t border-border/40 bg-amber-50/50 px-5 py-3 dark:bg-amber-950/10">
                    <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Waiting for {booking.providerName} to confirm...
                    </div>
                  </div>
                )}

                {/* Confirmed state — contact reveal */}
                {booking.status === "confirmed" && (
                  <div className="border-t border-border/40">
                    {!isRevealed ? (
                      <button
                        onClick={() => toggleReveal(booking._id!)}
                        className="flex w-full items-center justify-center gap-2 bg-green-50 py-3 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 dark:bg-green-950/20 dark:text-green-400 dark:hover:bg-green-950/30"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {booking.providerName} confirmed — View contact details
                      </button>
                    ) : (
                      <div className="bg-green-50/50 px-5 py-3 dark:bg-green-950/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.522 5.857L.055 23.488a.5.5 0 0 0 .613.613L6.21 22.51A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 0 1-5.39-1.585l-.386-.232-4.003 1.05 1.069-3.906-.254-.404A9.94 9.94 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                            <span className="font-medium text-green-700 dark:text-green-400">
                              {booking.contactDetails?.whatsapp || "Contact not available"}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleReveal(booking._id!)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Hide
                          </button>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Mention reference {booking.referenceNumber} when messaging
                        </p>
                      </div>
                    )}

                    <div className="flex border-t border-border/40">
                      <button
                        onClick={() => cancelBooking(booking._id!)}
                        disabled={cancellingId === booking._id}
                        className="flex-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive disabled:opacity-50"
                      >
                        {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                      </button>
                      <div className="w-px bg-border/40" />
                      <Link
                        href={`/provider/${booking.providerSlug}`}
                        className="flex-1 py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
