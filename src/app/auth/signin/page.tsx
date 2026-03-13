"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl,
    });

    if (result?.error) {
      setError("Unable to sign in. Please check your credentials and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-md shadow-pink-500/20">
              <span className="text-base font-bold text-white">C</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Concierge</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <h1 className="text-xl font-semibold">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignUp
                ? "Sign up to request bookings and access full profiles"
                : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm transition-all placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                {!isSignUp && (
                  <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Create a password" : "Enter your password"}
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm transition-all placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                isSignUp ? "Create account" : "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsSignUp(false)} className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button onClick={() => setIsSignUp(true)} className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Privacy note */}
        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground/50">
          Your privacy is our priority. We assign an anonymous alias
          to your account — providers never see your personal information.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
