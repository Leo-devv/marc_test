"use client";

import { useState, useMemo } from "react";
import { IProvider } from "@/types";

interface BookingDialogProps {
  provider: IProvider;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    time: string;
    duration: number;
    total: number;
  }) => Promise<void>;
}

function getNext7Days(): { label: string; sub: string; value: string }[] {
  const days: { label: string; sub: string; value: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const value = d.toISOString().split("T")[0];
    const sub = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    let label: string;
    if (i === 0) label = "Today";
    else if (i === 1) label = "Tomorrow";
    else label = d.toLocaleDateString("en-GB", { weekday: "short" });
    days.push({ label, sub: i <= 1 ? sub : sub, value });
  }
  return days;
}

const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
  "22:00", "23:00", "00:00", "01:00",
];

export function BookingDialog({ provider, open, onClose, onSubmit }: BookingDialogProps) {
  const dates = useMemo(() => getNext7Days(), []);

  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedTime, setSelectedTime] = useState("21:00");
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = provider.pricing.hourly * duration;

  if (!open) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({ date: selectedDate, time: selectedTime, duration, total });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="animate-overlay-in fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="animate-dialog-slide-up sm:animate-dialog-in relative z-50 w-full max-w-md rounded-t-2xl border border-border/60 bg-background shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <div>
            <h2 className="text-lg font-semibold">Request Booking</h2>
            <p className="text-sm text-muted-foreground">{provider.displayName} · €{provider.pricing.hourly}/hr</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-5 pt-4 space-y-5">
          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium">Date</label>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {dates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`flex flex-shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition-all ${
                    selectedDate === d.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="text-xs font-medium">{d.label}</span>
                  <span className="text-[10px] opacity-60">{d.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time — visual grid */}
          <div>
            <label className="mb-2 block text-sm font-medium">Time</label>
            <div className="grid grid-cols-4 gap-1.5">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`rounded-lg border py-2 text-sm transition-all ${
                    selectedTime === t
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-sm font-medium">Duration</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((h) => (
                <button
                  key={h}
                  onClick={() => setDuration(h)}
                  className={`flex-1 rounded-lg border py-2 text-sm transition-all ${
                    duration === h
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </span>
            ) : (
              "Send Request"
            )}
          </button>

          <p className="text-center text-[11px] text-muted-foreground/60">
            {provider.displayName} will confirm availability. No charges until confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}
