"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const redirect = searchParams?.get("redirect") ?? "/";
      router.replace(redirect);
    }
  }, [isAuthenticated, loading, router, searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      showToast("Welcome back! Signed in successfully.", "success");
      const redirect = searchParams?.get("redirect") ?? "/";
      router.replace(redirect);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to sign in. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center gap-6 px-4 py-16">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
        <p className="text-sm text-slate-400">
          Sign in to post questions, craft answers, and collaborate with the community.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft backdrop-blur">
        <div className="space-y-2 text-left">
          <label htmlFor="usernameOrEmail" className="text-sm font-medium text-slate-200">
            Email or username
          </label>
          <input
            id="usernameOrEmail"
            type="text"
            required
            value={form.usernameOrEmail}
            onChange={(event) => setForm((prev) => ({ ...prev, usernameOrEmail: event.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="you@email.com"
          />
        </div>
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="password" className="font-medium text-slate-200">
              Password
            </label>
            <button type="button" className="text-xs font-medium text-primary hover:text-primary/80">
              Forgot?
            </button>
          </div>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-xs text-slate-400">
        Need an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
          Create one
        </Link>
      </p>
    </div>
  );
}

