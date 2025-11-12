"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }

    if (!form.acceptedTerms) {
      showToast("Please accept the Terms of Service and Privacy Policy", "warning");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password
      });
      showToast("Account created successfully! Welcome to the community.", "success");
      router.replace("/ask");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to create account. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center gap-8 px-4 py-16">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-white">Create your Community Q&A account</h1>
        <p className="text-sm text-slate-400">
          Join thousands of builders and engineers learning together every day.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft backdrop-blur md:grid-cols-2"
      >
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-200">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="Pratham Kumar"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-slate-200">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="pratham-dev"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="you@email.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-200">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="Choose a strong password"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-medium text-slate-200">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={form.confirmPassword}
            onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="Repeat your password"
          />
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-3 text-xs text-slate-400 md:col-span-2">
          <input
            type="checkbox"
            checked={form.acceptedTerms}
            onChange={(event) => setForm((prev) => ({ ...prev, acceptedTerms: event.target.checked }))}
            className="h-4 w-4 rounded border border-slate-700 bg-slate-900 text-primary focus:ring-primary/40"
          />
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
          .
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="md:col-span-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </div>
  );
}

